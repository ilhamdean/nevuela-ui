<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { Check, CircleAlert } from '@lucide/vue'
import { cn } from '@/lib/utils'
import type { StepItem } from '.'

interface Props {
  steps: StepItem[]
  /** Zero-based index of the current step. */
  current?: number
  /** Lay the rail out as a horizontal row or a vertical wizard rail. */
  orientation?: 'horizontal' | 'vertical'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  current: 0,
  orientation: 'horizontal',
})

type StepState = 'complete' | 'current' | 'upcoming' | 'error'
const stateOf = (i: number): StepState => {
  if (props.steps[i]?.status === 'error') return 'error'
  return i < props.current ? 'complete' : i === props.current ? 'current' : 'upcoming'
}

const circleClass: Record<StepState, string> = {
  complete: 'border-brand bg-brand text-on-accent',
  current: 'border-brand bg-brand-subtle text-brand-fg',
  upcoming: 'border-border bg-surface text-fg-muted',
  error: 'border-status-error bg-status-error-subtle text-status-error-fg',
}
const labelClass: Record<StepState, string> = {
  complete: 'text-fg',
  current: 'text-brand-fg',
  upcoming: 'text-fg-muted',
  error: 'text-status-error-fg',
}
const connectorClass = (i: number) => (i < props.current ? 'bg-brand' : 'bg-border')
</script>

<template>
  <ol
    :class="
      cn('flex', orientation === 'vertical' ? 'flex-col' : 'w-full items-center', props.class)
    "
  >
    <li
      v-for="(step, i) in steps"
      :key="i"
      :class="
        cn(
          'flex',
          orientation === 'vertical' ? 'items-stretch' : 'items-center',
          orientation === 'horizontal' && i < steps.length - 1 && 'flex-1',
        )
      "
    >
      <div
        :class="
          cn('flex', orientation === 'vertical' ? 'flex-col items-center' : 'items-center gap-2.5')
        "
      >
        <span
          :aria-current="i === current ? 'step' : undefined"
          :class="
            cn(
              'inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold',
              circleClass[stateOf(i)],
            )
          "
        >
          <Check v-if="stateOf(i) === 'complete'" class="size-4" aria-hidden="true" />
          <CircleAlert v-else-if="stateOf(i) === 'error'" class="size-4" aria-hidden="true" />
          <span v-else>{{ i + 1 }}</span>
        </span>

        <span
          v-if="orientation === 'vertical' && i < steps.length - 1"
          aria-hidden="true"
          :class="cn('my-1 min-h-6 w-px flex-1', connectorClass(i))"
        />
      </div>

      <span
        :class="
          cn(
            orientation === 'vertical'
              ? 'flex flex-col pb-6 pl-2.5'
              : 'ml-2.5 hidden flex-col sm:flex',
          )
        "
      >
        <span :class="cn('text-sm font-medium', labelClass[stateOf(i)])">
          {{ step.label }}
          <span v-if="stateOf(i) === 'error'" class="sr-only"> (error)</span>
        </span>
        <span v-if="step.description" class="text-xs text-fg-muted">{{ step.description }}</span>
      </span>

      <span
        v-if="orientation === 'horizontal' && i < steps.length - 1"
        aria-hidden="true"
        :class="cn('mx-3 h-px flex-1', connectorClass(i))"
      />
    </li>
  </ol>
</template>
