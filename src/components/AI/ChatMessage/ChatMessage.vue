<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type HTMLAttributes } from 'vue'
import { Check, Copy, RefreshCw, Sparkles, ThumbsDown, ThumbsUp, TriangleAlert } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Avatar } from '../../DataDisplay/Avatar'
import { ThinkingIndicator } from '../ThinkingIndicator'
import { StreamingText } from '../StreamingText'
import { chatBubbleVariants, chatMessageVariants, type ChatRole } from '.'

interface Props {
  role?: ChatRole
  /** Message text. Ignore it and use the default slot for rich content (markdown, tables, tool cards). */
  content?: string
  /** Display name above the bubble. Defaults to a role label. */
  author?: string
  /** Avatar image for `role: 'user'`. Assistant turns use the brand mark. */
  avatarSrc?: string
  /** Rendered under the message, already formatted by the caller. */
  timestamp?: string
  /**
   * The turn is still being produced. With `content`, the text reveals as it
   * grows; without it, a thinking indicator stands in.
   */
  streaming?: boolean
  /** Failure text. Replaces the body and reveals the retry action. */
  error?: string
  /** Show copy / regenerate / feedback actions on hover and on focus. */
  showActions?: boolean
  /** Include thumbs up/down alongside the other actions. */
  showFeedback?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  role: 'assistant',
  content: undefined,
  author: undefined,
  avatarSrc: undefined,
  timestamp: undefined,
  streaming: false,
  error: undefined,
  showActions: false,
  showFeedback: false,
})

const emit = defineEmits<{
  /** Retry was pressed on a failed turn. */
  retry: []
  /** Regenerate was pressed. */
  regenerate: []
  /** Thumbs up/down. */
  feedback: [value: 'up' | 'down']
  /** The message text was copied to the clipboard. */
  copy: []
}>()

const roleLabels: Record<ChatRole, string> = {
  user: 'You',
  assistant: 'Assistant',
  system: 'System',
}

const authorName = computed(() => props.author ?? roleLabels[props.role])
const isAssistant = computed(() => props.role === 'assistant')
const isSystem = computed(() => props.role === 'system')
/** A streaming turn with nothing written yet — show that work is happening, not an empty bubble. */
const isWaiting = computed(() => props.streaming && !props.content)

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copyContent() {
  if (!props.content) return
  try {
    await navigator.clipboard.writeText(props.content)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1500)
    emit('copy')
  } catch {
    // Clipboard unavailable (insecure context / permissions) — no-op.
  }
}
onBeforeUnmount(() => clearTimeout(timer))

const actionClass =
  'inline-flex size-7 cursor-pointer items-center justify-center rounded-sm text-fg-muted outline-none transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/25'
</script>

<template>
  <article
    :class="cn('group', chatMessageVariants({ role }), props.class)"
    :data-role="role"
    :aria-busy="streaming || undefined"
  >
    <div v-if="!isSystem" class="shrink-0 pt-5">
      <span
        v-if="isAssistant"
        class="inline-flex size-8 items-center justify-center rounded-full bg-brand-subtle"
        aria-hidden="true"
      >
        <Sparkles class="size-4 text-brand-fg" />
      </span>
      <Avatar v-else :src="avatarSrc" :name="authorName" size="sm" />
    </div>

    <div
      :class="
        cn('flex min-w-0 flex-col gap-1', isSystem ? 'max-w-prose' : 'max-w-[min(42rem,85%)]')
      "
    >
      <div
        v-if="!isSystem"
        :class="cn('flex items-baseline gap-2 px-1', role === 'user' && 'flex-row-reverse')"
      >
        <span class="text-xs font-semibold text-fg-subtle">{{ authorName }}</span>
        <span v-if="timestamp" class="text-2xs text-fg-muted">{{ timestamp }}</span>
      </div>

      <div :class="chatBubbleVariants({ role, error: !!error })">
        <p v-if="error" class="flex items-start gap-2 text-sm text-status-error-fg">
          <TriangleAlert class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{{ error }}</span>
        </p>

        <ThinkingIndicator v-else-if="isWaiting" size="sm" />

        <slot v-else>
          <StreamingText
            v-if="isAssistant && content"
            :text="content"
            :streaming="streaming"
            class="block"
          />
          <p v-else-if="content" class="whitespace-pre-wrap">{{ content }}</p>
        </slot>
      </div>

      <div
        v-if="error || (showActions && !streaming)"
        :class="
          cn(
            'flex items-center gap-0.5 px-1',
            role === 'user' && 'flex-row-reverse',
            // Kept in the layout (not v-if'd away) so focusing an action with the
            // keyboard reveals it — hover alone would strand keyboard users.
            !error &&
              'opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100',
          )
        "
      >
        <button
          v-if="error"
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium text-status-error-fg outline-none hover:bg-status-error-subtle focus-visible:ring-2 focus-visible:ring-brand/25"
          @click="emit('retry')"
        >
          <RefreshCw class="size-3.5" aria-hidden="true" />
          Retry
        </button>

        <template v-else>
          <button
            v-if="content"
            type="button"
            :class="actionClass"
            :aria-label="copied ? 'Copied' : 'Copy message'"
            @click="copyContent"
          >
            <Check v-if="copied" class="size-4 text-status-active-fg" aria-hidden="true" />
            <Copy v-else class="size-4" aria-hidden="true" />
          </button>

          <button
            v-if="isAssistant"
            type="button"
            :class="actionClass"
            aria-label="Regenerate response"
            @click="emit('regenerate')"
          >
            <RefreshCw class="size-4" aria-hidden="true" />
          </button>

          <template v-if="showFeedback && isAssistant">
            <button
              type="button"
              :class="actionClass"
              aria-label="Good response"
              @click="emit('feedback', 'up')"
            >
              <ThumbsUp class="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              :class="actionClass"
              aria-label="Bad response"
              @click="emit('feedback', 'down')"
            >
              <ThumbsDown class="size-4" aria-hidden="true" />
            </button>
          </template>
        </template>
      </div>

      <slot name="footer" />
    </div>
  </article>
</template>
