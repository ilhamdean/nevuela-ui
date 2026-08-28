<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { ChevronRight, LoaderCircle, Wrench } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { CodeBlock } from '../../DataDisplay/CodeBlock'
import { toolCallCardVariants, toolCallStatusStyles, type ToolCallStatus } from '.'

interface Props {
  /** Tool the model called, as the model named it (e.g. `search_runbooks`). */
  name: string
  status?: ToolCallStatus
  /** One-line plain-English summary of what this call did. */
  summary?: string
  /** Arguments the model passed. Objects are pretty-printed as JSON. */
  args?: string | Record<string, unknown> | unknown[]
  /** What the tool returned. Ignored while `status` is `pending`/`running`. */
  result?: string | Record<string, unknown> | unknown[]
  /** Failure detail, shown instead of `result` when `status` is `error`. */
  error?: string
  /** Wall-clock duration in milliseconds. */
  durationMs?: number
  /** Start expanded. Failures default to expanded regardless. */
  defaultOpen?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  status: 'success',
  summary: undefined,
  args: undefined,
  result: undefined,
  error: undefined,
  durationMs: undefined,
  defaultOpen: false,
})

/**
 * Controlled expansion. Left undefined, Reka manages it internally from
 * `defaultOpen`, which is open on error — a failure the user has to expand to
 * read is a failure they'll miss.
 */
const open = defineModel<boolean | undefined>('open')

const contentId = useId()
const statusStyle = computed(() => toolCallStatusStyles[props.status])
const isBusy = computed(() => props.status === 'running' || props.status === 'pending')

const durationLabel = computed(() => {
  if (props.durationMs === undefined) return undefined
  return props.durationMs < 1000
    ? `${Math.round(props.durationMs)}ms`
    : `${(props.durationMs / 1000).toFixed(1)}s`
})

const hasBody = computed(
  () => props.args !== undefined || props.result !== undefined || !!props.error,
)
</script>

<template>
  <CollapsibleRoot
    v-model:open="open"
    :default-open="defaultOpen || status === 'error'"
    :disabled="!hasBody"
    :class="cn(toolCallCardVariants({ status }), props.class)"
  >
    <CollapsibleTrigger
      :aria-controls="hasBody ? contentId : undefined"
      :class="
        cn(
          'group flex w-full items-center gap-2 px-3 py-2 text-left outline-none',
          'focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:ring-inset',
          hasBody ? 'cursor-pointer hover:bg-bg-subtle' : 'cursor-default',
        )
      "
    >
      <ChevronRight
        v-if="hasBody"
        class="size-4 shrink-0 text-fg-muted transition-transform duration-150 group-data-[state=open]:rotate-90"
        aria-hidden="true"
      />
      <Wrench v-else class="size-4 shrink-0 text-fg-muted" aria-hidden="true" />

      <span class="flex min-w-0 flex-1 flex-col">
        <span class="flex items-center gap-2">
          <span class="truncate font-mono text-sm font-medium text-fg">{{ name }}</span>
          <span v-if="durationLabel" class="shrink-0 text-2xs text-fg-muted tabular-nums">{{
            durationLabel
          }}</span>
        </span>
        <span v-if="summary" class="truncate text-xs text-fg-muted">{{ summary }}</span>
      </span>

      <span :class="cn('inline-flex shrink-0 items-center gap-1.5 text-xs', statusStyle.text)">
        <LoaderCircle
          v-if="status === 'running'"
          class="size-3.5 animate-spin"
          aria-hidden="true"
        />
        <span v-else :class="cn('size-2 rounded-full', statusStyle.dot)" aria-hidden="true" />
        {{ statusStyle.label }}
      </span>
    </CollapsibleTrigger>

    <CollapsibleContent v-if="hasBody" :id="contentId" class="border-t border-border">
      <div class="flex flex-col gap-3 p-3">
        <div v-if="args !== undefined" class="flex flex-col gap-1.5">
          <p class="text-2xs font-semibold tracking-wide text-fg-muted uppercase">Arguments</p>
          <CodeBlock :code="args" language="json" :max-height="220" />
        </div>

        <div v-if="error" class="flex flex-col gap-1.5">
          <p class="text-2xs font-semibold tracking-wide text-fg-muted uppercase">Error</p>
          <p class="rounded-sm bg-status-error-subtle p-2 text-xs text-status-error-fg">
            {{ error }}
          </p>
        </div>

        <div v-else-if="result !== undefined && !isBusy" class="flex flex-col gap-1.5">
          <p class="text-2xs font-semibold tracking-wide text-fg-muted uppercase">Result</p>
          <!-- Named `output`, not `result`: a slot sharing a prop's name collides
               in tooling that merges props and slots into one type. -->
          <slot name="output">
            <CodeBlock :code="result" language="json" :max-height="260" />
          </slot>
        </div>
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
