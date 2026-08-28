<script setup lang="ts">
import { computed, nextTick, ref, useId, watch, type HTMLAttributes } from 'vue'
import { ArrowUp, Paperclip, Square, X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { promptInputVariants, type PromptAttachment } from '.'

defineOptions({ inheritAttrs: false })

interface Props {
  placeholder?: string
  /** Rows the textarea starts at, and shrinks back to when emptied. */
  minRows?: number
  /** Rows it grows to before scrolling instead. */
  maxRows?: number
  /**
   * The model is mid-response. Swaps send for a stop button and blocks
   * submission — the textarea stays editable so the next prompt can be typed
   * while the current one finishes.
   */
  streaming?: boolean
  disabled?: boolean
  invalid?: boolean
  /** Character budget. Shows a counter, and blocks send past the limit. */
  maxLength?: number
  /** Show the attachment button and emit `attach` when it's pressed. */
  allowAttachments?: boolean
  /** Files already staged for this prompt. */
  attachments?: PromptAttachment[]
  /** Hint under the composer (keyboard shortcut, model disclaimer…). */
  hint?: string
  /** Accessible name for the textarea when there's no visible `FormField` label. */
  label?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Ask anything…',
  minRows: 1,
  maxRows: 12,
  streaming: false,
  disabled: false,
  invalid: false,
  maxLength: undefined,
  allowAttachments: false,
  attachments: () => [],
  hint: undefined,
  label: 'Message',
})

const emit = defineEmits<{
  /** The prompt was submitted. Fires with the trimmed text; the caller owns clearing the model. */
  submit: [value: string]
  /** Stop was pressed while `streaming`. */
  stop: []
  /** The attachment button was pressed — open a picker. */
  attach: []
  /** A staged attachment's remove button was pressed. */
  removeAttachment: [attachment: PromptAttachment]
}>()

const model = defineModel<string>({ default: '' })

const textareaRef = ref<HTMLTextAreaElement>()
const hintId = useId()
const counterId = useId()

const trimmed = computed(() => model.value.trim())
const overLimit = computed(
  () => props.maxLength !== undefined && model.value.length > props.maxLength,
)
const canSubmit = computed(
  () => !!trimmed.value && !props.disabled && !props.streaming && !overLimit.value,
)

/**
 * Grow with the content instead of scrolling a fixed box. Measured off
 * `scrollHeight` after a reset to `auto`, because `scrollHeight` never shrinks
 * on its own once the element has been sized.
 */
function resize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 21
  const padding = el.offsetHeight - el.clientHeight
  const max = lineHeight * props.maxRows + padding
  el.style.height = `${Math.min(el.scrollHeight, max)}px`
  el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
}

watch(
  () => model.value,
  () => nextTick(resize),
  { immediate: true, flush: 'post' },
)
watch(
  () => props.maxRows,
  () => nextTick(resize),
)

function submit() {
  if (!canSubmit.value) return
  emit('submit', trimmed.value)
}

/**
 * Enter sends, Shift+Enter (and the IME's own Enter, via `isComposing`) inserts
 * a newline — the convention every chat surface has trained users on.
 */
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return
  event.preventDefault()
  submit()
}

function formatSize(bytes?: number) {
  if (bytes === undefined) return undefined
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const describedBy = computed(
  () =>
    [props.hint ? hintId : undefined, props.maxLength ? counterId : undefined]
      .filter(Boolean)
      .join(' ') || undefined,
)

defineExpose({
  textareaRef,
  focus: () => textareaRef.value?.focus(),
})

const iconButtonClass =
  'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-fg-muted outline-none transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/25 disabled:pointer-events-none disabled:opacity-60'
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5', props.class)">
    <div :class="promptInputVariants({ invalid: invalid || overLimit, disabled })">
      <ul v-if="attachments.length" class="flex flex-wrap gap-1.5">
        <li
          v-for="file in attachments"
          :key="file.id"
          class="inline-flex max-w-56 items-center gap-1.5 rounded-sm border border-border bg-bg-subtle py-1 pr-1 pl-2 text-xs text-fg-subtle"
        >
          <span class="truncate">{{ file.name }}</span>
          <span v-if="formatSize(file.size)" class="shrink-0 text-fg-muted tabular-nums">{{
            formatSize(file.size)
          }}</span>
          <button
            type="button"
            class="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm text-fg-muted hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:outline-none"
            :aria-label="`Remove ${file.name}`"
            @click="emit('removeAttachment', file)"
          >
            <X class="size-3.5" aria-hidden="true" />
          </button>
        </li>
      </ul>

      <textarea
        ref="textareaRef"
        v-model="model"
        v-bind="$attrs"
        :rows="minRows"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-label="label"
        :aria-invalid="invalid || overLimit || undefined"
        :aria-describedby="describedBy"
        class="w-full resize-none border-0 bg-transparent px-1 py-1.5 text-sm text-fg outline-none placeholder:text-fg-muted disabled:cursor-not-allowed"
        @keydown="onKeydown"
      />

      <div class="flex items-center gap-1">
        <button
          v-if="allowAttachments"
          type="button"
          :class="iconButtonClass"
          :disabled="disabled"
          aria-label="Attach a file"
          @click="emit('attach')"
        >
          <Paperclip class="size-4" aria-hidden="true" />
        </button>

        <slot name="tools" />

        <span
          v-if="maxLength"
          :id="counterId"
          :class="
            cn(
              'ml-auto text-2xs tabular-nums',
              overLimit ? 'text-status-error-fg' : 'text-fg-muted',
            )
          "
        >
          {{ model.length }} / {{ maxLength }}
        </span>

        <button
          v-if="streaming"
          type="button"
          :class="
            cn(
              iconButtonClass,
              maxLength ? 'ml-1' : 'ml-auto',
              'bg-bg-subtle text-fg hover:bg-border',
            )
          "
          aria-label="Stop generating"
          @click="emit('stop')"
        >
          <Square class="size-3.5 fill-current" aria-hidden="true" />
        </button>

        <button
          v-else
          type="button"
          :class="
            cn(
              iconButtonClass,
              maxLength ? 'ml-1' : 'ml-auto',
              'bg-brand text-on-accent hover:bg-brand-hover hover:text-on-accent',
            )
          "
          :disabled="!canSubmit"
          aria-label="Send message"
          @click="submit"
        >
          <ArrowUp class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <p v-if="hint" :id="hintId" class="px-1 text-2xs text-fg-muted">{{ hint }}</p>
  </div>
</template>
