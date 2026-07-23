<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { ArrowDownRight, ArrowUpRight } from '@lucide/vue'
import { cn } from '@/lib/utils'
import type { MetricDelta } from '.'

interface Props {
  label: string
  value: string | number
  /** Small unit suffix, e.g. "GB", "ms". */
  unit?: string
  /** Leading icon (e.g. a Lucide icon). */
  icon?: Component
  /** Period-over-period change chip. */
  delta?: MetricDelta
  /** Caption under the value. */
  helpText?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const tone = computed(
  () => props.delta?.tone ?? (props.delta?.direction === 'down' ? 'negative' : 'positive'),
)

const toneClass = computed(
  () =>
    ({
      positive: 'text-status-active',
      negative: 'text-status-error',
      neutral: 'text-fg-subtle',
    })[tone.value],
)
</script>

<template>
  <div :class="cn('rounded-xl border border-border bg-surface p-4', props.class)">
    <div class="flex items-start justify-between gap-2">
      <span class="text-sm font-medium text-fg-subtle">{{ label }}</span>
      <component :is="icon" v-if="icon" class="size-4 shrink-0 text-fg-muted" aria-hidden="true" />
    </div>

    <div class="mt-2 flex items-end gap-2">
      <span class="text-2xl font-semibold text-fg tabular-nums">
        {{ value
        }}<span v-if="unit" class="ml-0.5 text-base font-normal text-fg-subtle">{{ unit }}</span>
      </span>

      <span
        v-if="delta"
        :class="
          cn('mb-1 inline-flex items-center gap-0.5 text-xs font-medium tabular-nums', toneClass)
        "
      >
        <component
          :is="delta.direction === 'down' ? ArrowDownRight : ArrowUpRight"
          class="size-3.5"
          aria-hidden="true"
        />
        {{ Math.abs(delta.value) }}%
        <span class="sr-only">{{ delta.direction === 'down' ? 'decrease' : 'increase' }}</span>
      </span>
    </div>

    <div v-if="$slots.sparkline" class="mt-3 h-12">
      <slot name="sparkline" />
    </div>

    <p v-if="helpText" class="mt-2 text-xs text-fg-subtle">{{ helpText }}</p>
  </div>
</template>
