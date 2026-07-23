<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { SparklineTone } from '.'

interface Props {
  /** Trend values, oldest first. Empty renders nothing; a single value renders a flat line. */
  data: number[]
  /** SVG pixel height. */
  height?: number
  /** Rendered width — a CSS length (`'100%'`, `'8rem'`…) or a number of px. */
  width?: number | string
  /** Explicit stroke/fill color (any CSS color). Overrides `tone`. */
  color?: string
  /**
   * Line color. `'auto'` compares the last value to the first: rising ends
   * green (`--status-active`), falling ends red (`--status-error`), flat
   * ends neutral (`--status-off`). The other values force that tone
   * regardless of trend direction.
   */
  tone?: SparklineTone
  /** Soft ~12% opacity fill under the line, down to the baseline. */
  area?: boolean
  /** Line stroke width in SVG user units. */
  strokeWidth?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  height: 32,
  width: '100%',
  tone: 'auto',
  area: true,
  strokeWidth: 1.5,
})

// Read a CSS custom property so the line follows the live theme (with a hard
// fallback for non-DOM environments) — same approach as UsageChart's token().
function token(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

const toneColor = computed<Record<Exclude<SparklineTone, 'auto'>, string>>(() => ({
  brand: token('--brand', '#1f8a5c'),
  positive: token('--status-active', '#3f9142'),
  negative: token('--status-error', '#c4432b'),
  neutral: token('--status-off', '#9a9fa6'),
}))

const resolvedColor = computed(() => {
  if (props.color) return props.color
  if (props.tone !== 'auto') return toneColor.value[props.tone]

  const { data } = props
  if (data.length < 2) return toneColor.value.neutral
  const first = data[0]
  const last = data[data.length - 1]
  if (last > first) return toneColor.value.positive
  if (last < first) return toneColor.value.negative
  return toneColor.value.neutral
})

// Internal coordinate space for the viewBox. When `width` is a number we use
// it directly (1 user unit == 1px); for CSS lengths like the '100%' default
// there's no pixel value to compute against, so we fall back to a fixed
// 100-wide coordinate space and let `preserveAspectRatio="none"` stretch it
// to fill the rendered (CSS) width.
const viewBoxWidth = computed(() => (typeof props.width === 'number' ? props.width : 100))

// ~2px padding top/bottom so the tallest peak / lowest trough isn't clipped
// by the stroke width.
const PADDING = 2

/**
 * Normalized (x, y) points in the `0..viewBoxWidth` x `0..height` coordinate
 * space. Handles the edge cases explicitly:
 *  - empty data -> [] (caller guards rendering, see template's v-if)
 *  - a single value, or all-identical values (max === min, which would
 *    otherwise divide by zero) -> a flat line at mid-height instead of NaN
 */
const points = computed<[number, number][]>(() => {
  const { data, height } = props
  const w = viewBoxWidth.value
  if (data.length === 0) return []

  if (data.length === 1)
    return [
      [0, height / 2],
      [w, height / 2],
    ]

  const min = Math.min(...data)
  const max = Math.max(...data)
  if (max === min)
    return [
      [0, height / 2],
      [w, height / 2],
    ]

  const usableHeight = Math.max(height - PADDING * 2, 0)
  const step = w / (data.length - 1)
  return data.map((value, i) => {
    const x = i * step
    const normalized = (value - min) / (max - min)
    const y = PADDING + (1 - normalized) * usableHeight
    return [x, y]
  })
})

const linePointsAttr = computed(() => points.value.map(([x, y]) => `${x},${y}`).join(' '))

// The same points closed down to the baseline (bottom-right, bottom-left),
// forming a filled polygon under the line.
const areaPointsAttr = computed(() => {
  if (!props.area || points.value.length === 0) return ''
  const w = viewBoxWidth.value
  const h = props.height
  return `${linePointsAttr.value} ${w},${h} 0,${h}`
})
</script>

<template>
  <svg
    v-if="data.length > 0"
    :viewBox="`0 0 ${viewBoxWidth} ${height}`"
    :width="width"
    :height="height"
    preserveAspectRatio="none"
    aria-hidden="true"
    :class="cn('block overflow-visible', props.class)"
  >
    <polygon
      v-if="area"
      :points="areaPointsAttr"
      :fill="resolvedColor"
      fill-opacity="0.12"
      stroke="none"
    />
    <polyline
      :points="linePointsAttr"
      fill="none"
      :stroke="resolvedColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
