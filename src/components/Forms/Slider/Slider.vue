<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { cn } from '@/lib/utils'
import { sliderThumbVariants, sliderTrackVariants, type SliderVariants } from '.'

interface Props {
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** Track thickness / thumb size. */
  size?: SliderVariants['size']
  /** Show the current value(s) as a caption above the track. */
  showValue?: boolean
  /** Optional caption shown at the start of the label row, and the single-thumb `aria-label` fallback. */
  label?: string
  /** Format a raw numeric value for display, e.g. `(v) => \`${v}%\`` or `(v) => \`$${v}\`` . */
  formatValue?: (value: number) => string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  size: 'md',
  showValue: false,
  formatValue: undefined,
})

/** Single thumb is `[value]`, a range is `[lo, hi]` — one `SliderThumb` per entry. */
const modelValue = defineModel<number[]>('modelValue', { default: () => [0] })

function format(value: number) {
  return props.formatValue ? props.formatValue(value) : String(value)
}

const valueCaption = computed(() => {
  const values = modelValue.value
  if (values.length < 2) return format(values[0] ?? props.min)
  return `${format(values[0])} – ${format(values[values.length - 1])}`
})

function thumbLabel(index: number) {
  if (modelValue.value.length < 2) return props.label || 'Value'
  return index === 0 ? 'Minimum' : 'Maximum'
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div
      v-if="showValue || label"
      class="mb-1.5 flex items-center justify-between text-xs text-fg-subtle"
    >
      <span>{{ label }}</span>
      <span v-if="showValue" class="font-medium text-fg tabular-nums">{{ valueCaption }}</span>
    </div>

    <SliderRoot
      v-model="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :class="
        cn(
          'relative flex w-full touch-none select-none items-center',
          disabled && 'pointer-events-none opacity-60',
        )
      "
    >
      <SliderTrack :class="sliderTrackVariants({ size })">
        <SliderRange class="absolute h-full rounded-full bg-brand" />
      </SliderTrack>
      <SliderThumb
        v-for="(_, index) in modelValue"
        :key="index"
        :aria-label="thumbLabel(index)"
        :class="sliderThumbVariants({ size })"
      />
    </SliderRoot>
  </div>
</template>
