<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { cn } from '@/lib/utils'
import {
  progressIndicatorColors,
  progressTrackVariants,
  type ProgressColor,
  type ProgressVariants,
} from '.'

interface Props {
  /** Current value (0…max). */
  value?: number
  max?: number
  size?: ProgressVariants['size']
  color?: ProgressColor
  /** Show the value label and a caption row above the track. */
  showValue?: boolean
  /** Optional caption shown at the start of the label row. */
  label?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  size: 'md',
  color: 'brand',
  showValue: false,
})

const pct = computed(() => {
  const raw = (props.value / props.max) * 100
  return Math.max(0, Math.min(100, Math.round(raw)))
})
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div
      v-if="showValue || label"
      class="mb-1.5 flex items-center justify-between text-xs text-fg-subtle"
    >
      <span>{{ label }}</span>
      <span v-if="showValue" class="font-medium text-fg tabular-nums">{{ pct }}%</span>
    </div>

    <ProgressRoot :model-value="value" :max="max" :class="progressTrackVariants({ size })">
      <ProgressIndicator
        :class="
          cn('h-full rounded-full transition-[width] duration-300', progressIndicatorColors[color])
        "
        :style="{ width: `${pct}%` }"
      />
    </ProgressRoot>
  </div>
</template>
