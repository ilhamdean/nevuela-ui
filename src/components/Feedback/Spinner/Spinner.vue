<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { LoaderCircle } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { spinnerColors, spinnerVariants, type SpinnerColor, type SpinnerVariants } from '.'

interface Props {
  /** Icon dimensions. */
  size?: SpinnerVariants['size']
  /** Icon color. `current` (default) inherits `text-current` so it can sit inside
   * already-colored contexts (e.g. a solid button or a colored banner). */
  color?: SpinnerColor
  /**
   * Visually-hidden accessible label announced once via `role="status"`.
   * Ignored when the default slot has content — the visible text already
   * labels the status region.
   */
  label?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'current',
  label: 'Loading',
})
</script>

<template>
  <span role="status" :class="cn('inline-flex items-center gap-2', props.class)">
    <LoaderCircle :class="cn(spinnerVariants({ size }), spinnerColors[color])" aria-hidden="true" />
    <span v-if="$slots.default" class="text-sm text-fg-subtle"><slot /></span>
    <span v-else class="sr-only">{{ label }}</span>
  </span>
</template>
