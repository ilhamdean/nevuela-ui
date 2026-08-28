<script setup lang="ts">
import { onBeforeUnmount, ref, type HTMLAttributes } from 'vue'
import { Check, Copy } from '@lucide/vue'
import { cn } from '@/lib/utils'

interface Props {
  /** The value shown and copied to the clipboard. */
  value: string
  label?: string
  /** Render the value in a monospace font (good for IPs, tokens, IDs). */
  mono?: boolean
  /** Truncate a long value with an ellipsis. */
  truncate?: boolean
  size?: 'sm' | 'md'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  mono: true,
  truncate: false,
  size: 'md',
})

const emit = defineEmits<{ copy: [value: string] }>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    emit('copy', props.value)
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1500)
  } catch {
    // Clipboard unavailable (insecure context / permissions) — no-op.
  }
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div :class="cn('flex flex-col gap-1', props.class)">
    <span v-if="label" class="text-xs font-medium text-fg-subtle">{{ label }}</span>

    <div
      :class="
        cn(
          'inline-flex items-center gap-2 rounded-sm border border-border bg-surface pr-1',
          size === 'sm' ? 'h-8 pl-2.5' : 'h-10 pl-3',
        )
      "
    >
      <span
        :class="
          cn(
            'min-w-0 flex-1 text-fg',
            mono && 'font-mono',
            truncate && 'truncate',
            size === 'sm' ? 'text-xs' : 'text-sm',
          )
        "
      >
        {{ value }}
      </span>

      <button
        type="button"
        class="inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:outline-none"
        :aria-label="copied ? 'Copied' : 'Copy to clipboard'"
        @click="copy"
      >
        <Check v-if="copied" class="size-4 text-status-active-fg" aria-hidden="true" />
        <Copy v-else class="size-4" aria-hidden="true" />
      </button>
    </div>

    <span aria-live="polite" class="sr-only">{{ copied ? 'Copied to clipboard' : '' }}</span>
  </div>
</template>
