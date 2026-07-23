<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type HTMLAttributes } from 'vue'
import { Check, Copy } from '@lucide/vue'
import { cn } from '@/lib/utils'

interface Props {
  /** The code/config/JSON to display. Objects and arrays are pretty-printed via `JSON.stringify(code, null, 2)`; strings render as-is. */
  code: string | Record<string, unknown> | unknown[]
  /** Cosmetic language label shown in the header (e.g. "json", "yaml", "bash"). No syntax highlighting is applied. */
  language?: string
  /** Filename shown in the header instead of/alongside `language`. */
  filename?: string
  /** Render a non-selectable line-number column on the left. */
  showLineNumbers?: boolean
  /** Cap the block's height and scroll vertically past it. Number is treated as px. */
  maxHeight?: number | string
  /** Wrap long lines instead of scrolling horizontally. */
  wrap?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  language: undefined,
  filename: undefined,
  showLineNumbers: false,
  maxHeight: undefined,
  wrap: false,
})

/** The final rendered string — JSON-pretty-printed if `code` is an object/array, verbatim if a string. This is what gets copied. */
const displayCode = computed(() =>
  typeof props.code === 'string' ? props.code : JSON.stringify(props.code, null, 2),
)

const lines = computed(() => displayCode.value.split('\n'))

const scrollStyle = computed(() => {
  if (props.maxHeight === undefined) return {}
  const maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  return { maxHeight, overflowY: 'auto' as const }
})

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(displayCode.value)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1500)
  } catch {
    // Clipboard unavailable (insecure context / permissions) — no-op.
  }
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div :class="cn('overflow-hidden rounded-lg border border-border bg-surface', props.class)">
    <div
      class="flex items-center justify-between gap-2 rounded-t-lg border-b border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted"
    >
      <span class="truncate font-mono">{{ filename || language || '' }}</span>

      <button
        type="button"
        class="inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:outline-none"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy"
      >
        <Check v-if="copied" class="size-4 text-status-active" aria-hidden="true" />
        <Copy v-else class="size-4" aria-hidden="true" />
      </button>
    </div>

    <pre
      :class="
        cn(
          'm-0 font-mono text-sm text-fg',
          wrap ? 'p-4 break-words whitespace-pre-wrap' : 'overflow-x-auto p-4 whitespace-pre',
        )
      "
      :style="scrollStyle"
    ><code v-if="!showLineNumbers">{{ displayCode }}</code><code v-else class="grid grid-cols-[auto_1fr] gap-x-4"><template v-for="(line, i) in lines" :key="i"><span class="pr-4 text-right text-fg-muted select-none" aria-hidden="true">{{ i + 1 }}</span><span class="min-w-0">{{ line || ' ' }}</span></template></code></pre>

    <span aria-live="polite" class="sr-only">{{ copied ? 'Copied to clipboard' : '' }}</span>
  </div>
</template>
