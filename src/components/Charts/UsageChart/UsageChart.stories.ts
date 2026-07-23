import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UsageChart } from '.'

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
const wave = (base: number, amp: number, phase: number) =>
  hours.map((_, i) => Math.round(base + amp * Math.sin((i + phase) / 3) + (i % 5) * 1.5))

/**
 * `UsageChart` is a thin wrapper around Apache ECharts (via `vue-echarts`) for
 * console usage graphs. It reads the Nevuela chart-color tokens at runtime, so
 * series follow the theme. Choose a `type`: `line` (optionally with `area`
 * fill) and `bar` plot `series` against `categories`; `donut` plots a
 * `donutData` breakdown (`{ name, value }[]`) instead. Set `loading` for a
 * skeleton placeholder, or leave `series`/`donutData` empty for a built-in
 * "No data" state.
 */
const meta = {
  title: 'Charts/UsageChart',
  component: UsageChart,
  argTypes: {
    series: {
      control: 'object',
      description: '`{ name, data: number[] }[]` — used by `type: line | bar`.',
    },
    categories: { control: 'object', description: 'X-axis labels — used by `type: line | bar`.' },
    donutData: {
      control: 'object',
      description: '`{ name, value }[]` breakdown — used by `type: donut`.',
    },
    donutRadius: {
      control: 'object',
      description: 'Inner/outer radius of the donut hole.',
      table: { defaultValue: { summary: "['58%', '82%']" } },
    },
    type: {
      control: 'inline-radio',
      options: ['line', 'bar', 'donut'],
      description: 'Chart shape.',
      table: { defaultValue: { summary: 'line' } },
    },
    area: {
      control: 'boolean',
      description: 'Fill under the line with a soft area gradient. Only applies to `type: line`.',
      table: { defaultValue: { summary: 'false' } },
    },
    height: { control: 'number', table: { defaultValue: { summary: '280' } } },
    smooth: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    showLegend: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    loading: {
      control: 'boolean',
      description: 'Render a skeleton placeholder instead of the chart.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    categories: hours,
    series: [
      { name: 'CPU %', data: wave(38, 18, 0) },
      { name: 'Memory %', data: wave(55, 10, 4) },
    ],
    type: 'line',
    area: true,
    height: 300,
    smooth: true,
    showLegend: true,
    loading: false,
  },
  render: (args) => ({
    components: { UsageChart },
    setup: () => ({ args }),
    template: `<div class="w-[720px] rounded-xl border border-border bg-surface p-4"><UsageChart v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof UsageChart>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** A single-series line chart with a custom y-axis formatter. */
export const BandwidthLine: Story = {
  args: {
    type: 'line',
    area: false,
    showLegend: false,
    series: [{ name: 'Outbound', data: wave(120, 60, 2) }],
    yFormatter: (v: number) => `${v} MB/s`,
  },
}

/** `type: 'bar'` maps the same series shape onto grouped bars. */
export const BarVariant: Story = {
  args: {
    type: 'bar',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { name: 'Requests', data: [1200, 1900, 1700, 2400, 2100, 900, 700] },
      { name: 'Errors', data: [12, 30, 18, 42, 25, 6, 4] },
    ],
  },
}

/** `type: 'donut'` plots a `{ name, value }[]` breakdown instead of `series`/`categories`. */
export const DonutVariant: Story = {
  args: {
    type: 'donut',
    donutData: [
      { name: 'Running', value: 48 },
      { name: 'Stopped', value: 9 },
      { name: 'Provisioning', value: 3 },
      { name: 'Error', value: 2 },
    ],
  },
}

/** A skeleton placeholder shown while usage data is loading. */
export const Loading: Story = {
  args: { loading: true },
}

/** No series data yet — a "No data" message replaces the empty axis. */
export const Empty: Story = {
  args: { series: [] },
}
