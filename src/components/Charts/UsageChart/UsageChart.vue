<script setup lang="ts">
import { computed, useTemplateRef, type HTMLAttributes } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import { ChartLine } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { useThemeTokens } from '@/lib/theme'
import { EmptyState } from '../../DataDisplay/EmptyState'
import { Skeleton } from '../../DataDisplay/Skeleton'
import type { UsageDonutDatum, UsageSeries } from '.'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

interface Props {
  /** One or more series to plot. Used for `type: 'line' | 'bar'`. */
  series?: UsageSeries[]
  /** X-axis category labels (timestamps, dates…). Used for `type: 'line' | 'bar'`. */
  categories?: string[]
  /** Slices for `type: 'donut'` — a status/category breakdown. */
  donutData?: UsageDonutDatum[]
  /** Inner/outer radius for the donut hole, e.g. `['58%', '82%']`. */
  donutRadius?: [string, string]
  /** Chart shape. `line`/`bar` plot `series` against `categories`; `donut` plots `donutData`. */
  type?: 'line' | 'bar' | 'donut'
  /** Fill under the line with a soft area gradient. Only applies to `type: 'line'`. */
  area?: boolean
  height?: number | string
  smooth?: boolean
  showLegend?: boolean
  /** Override the series colors (defaults to the Nevuela chart token ramp). */
  colors?: string[]
  /** Format y-axis / tooltip values. Ignored for `type: 'donut'`. */
  yFormatter?: (value: number) => string
  /** Render a skeleton placeholder instead of the chart. */
  loading?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  series: () => [],
  categories: () => [],
  donutRadius: () => ['58%', '82%'],
  type: 'line',
  area: false,
  height: 280,
  smooth: true,
  showLegend: true,
  loading: false,
})

// ECharts paints to a canvas, so the palette has to be passed as resolved
// color strings rather than Tailwind classes. Reading them through
// `useThemeTokens` (against our own root, so a scoped `.dark` ancestor counts)
// keeps the computeds below reactive to a runtime theme swap.
const rootRef = useTemplateRef<HTMLElement>('root')
const { token } = useThemeTokens(rootRef)

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
const surfaceColor = computed(() => token('--surface', '#ffffff'))

const isEmpty = computed(() => {
  if (props.type === 'donut') {
    return !props.donutData?.length || props.donutData.every((d) => d.value === 0)
  }
  return !props.series.length || props.series.every((s) => s.data.length === 0)
})

const legend = computed(() =>
  props.showLegend
    ? {
        top: 0,
        left: 0,
        icon: 'roundRect',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: labelColor.value },
      }
    : undefined,
)

const option = computed<EChartsOption>(() => {
  if (props.type === 'donut') {
    return {
      color: palette.value,
      tooltip: { trigger: 'item' },
      legend: legend.value,
      series: [
        {
          type: 'pie',
          radius: props.donutRadius,
          center: ['50%', props.showLegend ? '58%' : '50%'],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: surfaceColor.value, borderWidth: 2 },
          label: { show: false },
          labelLine: { show: false },
          data: props.donutData ?? [],
        },
      ],
    }
  }

  return {
    color: palette.value,
    grid: { left: 8, right: 12, top: props.showLegend ? 36 : 12, bottom: 4, containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: legend.value,
    xAxis: {
      type: 'category',
      boundaryGap: props.type === 'bar',
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
    series: props.series.map((s) =>
      props.type === 'bar'
        ? { name: s.name, type: 'bar', data: s.data, barMaxWidth: 28 }
        : {
            name: s.name,
            type: 'line',
            data: s.data,
            smooth: props.smooth,
            showSymbol: false,
            lineStyle: { width: 2 },
            areaStyle: props.area ? { opacity: 0.12 } : undefined,
          },
    ),
  }
})

const styleObject = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: '100%',
}))
</script>

<template>
  <div ref="root" :style="styleObject" :class="cn('relative', props.class)">
    <Skeleton v-if="loading" class="size-full" />
    <EmptyState
      v-else-if="isEmpty"
      title="No data"
      description="There's no usage data to display yet."
      :icon="ChartLine"
      :bordered="false"
      class="size-full justify-center"
    />
    <VChart v-else :option="option" autoresize style="height: 100%; width: 100%" />
  </div>
</template>
