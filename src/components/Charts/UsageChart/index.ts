export { default as UsageChart } from './UsageChart.vue'

export interface UsageSeries {
  name: string
  data: number[]
}

/** A single slice for the `'donut'` chart type — a status/category breakdown. */
export interface UsageDonutDatum {
  name: string
  value: number
}
