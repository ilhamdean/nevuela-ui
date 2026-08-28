<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { ArrowDown, ArrowUp, Coins, Zap } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { ProgressBar } from '../../DataDisplay/ProgressBar'
import { tokenUsageVariants, type TokenUsageValue, type TokenUsageVariants } from '.'

interface Props {
  usage: TokenUsageValue
  /**
   * Model context window, in tokens. Adds a meter showing how much of it the
   * prompt occupies — the number that actually predicts a truncated
   * conversation, so it's the one worth graphing.
   */
  contextLimit?: number
  /** Cost for this turn, already computed by the caller (pricing is provider-specific). */
  cost?: number
  /** ISO 4217 code used to format `cost`. */
  currency?: string
  /** BCP 47 locale for number formatting. Defaults to the browser's. */
  locale?: string
  variant?: TokenUsageVariants['variant']
  size?: TokenUsageVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  contextLimit: undefined,
  cost: undefined,
  currency: 'USD',
  locale: undefined,
  variant: 'inline',
  size: 'md',
})

const total = computed(() => props.usage.prompt + props.usage.completion)

const formatCount = (n: number) => new Intl.NumberFormat(props.locale).format(n)

const costLabel = computed(() =>
  props.cost === undefined
    ? undefined
    : new Intl.NumberFormat(props.locale, {
        style: 'currency',
        currency: props.currency,
        // Per-turn cost is routinely a fraction of a cent; two decimals would
        // round every call to $0.00.
        maximumFractionDigits: props.cost < 0.01 ? 4 : 2,
      }).format(props.cost),
)

const contextPercent = computed(() =>
  props.contextLimit ? Math.min(100, (props.usage.prompt / props.contextLimit) * 100) : 0,
)

/** Warn before the window is actually full — by then history is already being dropped. */
const contextColor = computed(() => {
  if (contextPercent.value >= 90) return 'error' as const
  if (contextPercent.value >= 75) return 'warning' as const
  return 'brand' as const
})
</script>

<template>
  <div :class="cn(tokenUsageVariants({ variant, size }), props.class)">
    <div
      :class="cn('flex flex-wrap items-center gap-x-3 gap-y-1', variant === 'card' && 'gap-x-4')"
    >
      <span
        class="inline-flex items-center gap-1"
        :title="`${formatCount(usage.prompt)} input tokens`"
      >
        <ArrowUp class="size-3.5" aria-hidden="true" />
        <span class="tabular-nums">{{ formatCount(usage.prompt) }}</span>
        <span class="sr-only">input tokens</span>
        <span aria-hidden="true">in</span>
      </span>

      <span
        class="inline-flex items-center gap-1"
        :title="`${formatCount(usage.completion)} output tokens`"
      >
        <ArrowDown class="size-3.5" aria-hidden="true" />
        <span class="tabular-nums">{{ formatCount(usage.completion) }}</span>
        <span class="sr-only">output tokens</span>
        <span aria-hidden="true">out</span>
      </span>

      <span v-if="usage.cached" class="inline-flex items-center gap-1 text-status-active-fg">
        <Zap class="size-3.5" aria-hidden="true" />
        <span class="tabular-nums">{{ formatCount(usage.cached) }}</span>
        <span class="sr-only">tokens read from cache</span>
        <span aria-hidden="true">cached</span>
      </span>

      <span class="inline-flex items-center gap-1 font-medium text-fg-subtle">
        <span class="tabular-nums">{{ formatCount(total) }}</span>
        <span>total</span>
      </span>

      <span v-if="costLabel" class="inline-flex items-center gap-1 font-medium text-fg-subtle">
        <Coins class="size-3.5" aria-hidden="true" />
        <span class="tabular-nums">{{ costLabel }}</span>
      </span>
    </div>

    <div v-if="contextLimit" class="flex w-full min-w-40 flex-col gap-1">
      <ProgressBar :value="contextPercent" :color="contextColor" size="sm" />
      <p class="text-fg-muted">
        {{ formatCount(usage.prompt) }} of {{ formatCount(contextLimit) }} tokens used —
        {{ Math.round(contextPercent) }}% of the context window
      </p>
    </div>
  </div>
</template>
