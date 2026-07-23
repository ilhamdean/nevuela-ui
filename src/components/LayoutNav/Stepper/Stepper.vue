<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { Check } from '@lucide/vue'
import { cn } from '@/lib/utils'
import type { StepItem } from '.'

interface Props {
  steps: StepItem[]
  /** Zero-based index of the current step. */
  current?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  current: 0,
})

type StepState = 'complete' | 'current' | 'upcoming'
const stateOf = (i: number): StepState =>
  i < props.current ? 'complete' : i === props.current ? 'current' : 'upcoming'

const circleClass: Record<StepState, string> = {
  complete: 'border-brand bg-brand text-on-accent',
  current: 'border-brand bg-brand-subtle text-brand',
  upcoming: 'border-border bg-surface text-fg-muted',
}
const labelClass: Record<StepState, string> = {
  complete: 'text-fg',
  current: 'text-brand',
  upcoming: 'text-fg-muted',
}
</script>

<template>
  <ol :class="cn('flex w-full items-center', props.class)">
    <li
      v-for="(step, i) in steps"
      :key="i"
      :class="cn('flex items-center', i < steps.length - 1 && 'flex-1')"
    >
      <div class="flex items-center gap-2.5">
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
          <span v-else>{{ i + 1 }}</span>
        </span>

        <span class="hidden flex-col sm:flex">
          <span :class="cn('text-sm font-medium', labelClass[stateOf(i)])">{{ step.label }}</span>
          <span v-if="step.description" class="text-xs text-fg-muted">{{ step.description }}</span>
        </span>
      </div>

      <span
        v-if="i < steps.length - 1"
        aria-hidden="true"
        :class="cn('mx-3 h-px flex-1', i < current ? 'bg-brand' : 'bg-border')"
      />
    </li>
  </ol>
</template>
