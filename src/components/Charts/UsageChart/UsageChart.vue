<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import type { UsageSeries } from '.'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

interface Props {
  /** One or more series to plot. */
  series: UsageSeries[]
  /** X-axis category labels (timestamps, dates…). */
  categories: string[]
  /** `area` fills under the line; `line` is a plain line. */
  type?: 'line' | 'area'
  height?: number | string
  smooth?: boolean
  showLegend?: boolean
  /** Override the series colors (defaults to the Nevuela chart token ramp). */
  colors?: string[]
  /** Format y-axis / tooltip values. */
  yFormatter?: (value: number) => string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  type: 'area',
  height: 280,
  smooth: true,
  showLegend: true,
})

// Read a CSS custom property so charts follow the live theme (with a hard
// fallback for non-DOM environments).
function token(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

const palette = computed(
  () =>
    props.colors ?? [
      token('--chart-1', '#0063f8'),
      token('--chart-2', '#03875b'),
      token('--chart-3', '#f59e0b'),
      token('--chart-4', '#9c668c'),
      token('--chart-5', '#6b5bd6'),
      token('--chart-6', '#1c9bb8'),
    ],
)
const axisColor = computed(() => token('--border-c', '#d9dede'))
const labelColor = computed(() => token('--fg-muted', '#919f9e'))

const option = computed<EChartsOption>(() => ({
  color: palette.value,
  grid: { left: 8, right: 12, top: props.showLegend ? 36 : 12, bottom: 4, containLabel: true },
  tooltip: { trigger: 'axis' },
  legend: props.showLegend
    ? {
        top: 0,
        left: 0,
        icon: 'roundRect',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: labelColor.value },
      }
    : undefined,
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.categories,
    axisLine: { lineStyle: { color: axisColor.value } },
    axisTick: { show: false },
    axisLabel: { color: labelColor.value },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: axisColor.value, type: 'dashed' } },
    axisLabel: { color: labelColor.value, formatter: props.yFormatter },
  },
  series: props.series.map((s) => ({
    name: s.name,
    type: 'line',
    data: s.data,
    smooth: props.smooth,
    showSymbol: false,
    lineStyle: { width: 2 },
    areaStyle: props.type === 'area' ? { opacity: 0.12 } : undefined,
  })),
}))

const styleObject = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: '100%',
}))
</script>

<template>
  <VChart :option="option" autoresize :style="styleObject" :class="props.class" />
</template>
