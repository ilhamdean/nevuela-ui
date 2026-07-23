import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UsageChart } from '.'

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
const wave = (base: number, amp: number, phase: number) =>
  hours.map((_, i) => Math.round(base + amp * Math.sin((i + phase) / 3) + (i % 5) * 1.5))

/**
 * `UsageChart` is a thin wrapper around Apache ECharts (via `vue-echarts`) for
 * time-series usage graphs. It reads the Nevuela chart-color tokens at runtime,
 * so series follow the theme. Pass `series` + `categories`; choose `area` or
 * `line`.
 */
const meta = {
  title: 'Charts/UsageChart',
  component: UsageChart,
  argTypes: {
    series: { control: 'object', description: '`{ name, data: number[] }[]`.' },
    categories: { control: 'object', description: 'X-axis labels.' },
    type: {
      control: 'inline-radio',
      options: ['area', 'line'],
      table: { defaultValue: { summary: 'area' } },
    },
    height: { control: 'number', table: { defaultValue: { summary: '280' } } },
    smooth: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    showLegend: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
  },
  args: {
    categories: hours,
    series: [
      { name: 'CPU %', data: wave(38, 18, 0) },
      { name: 'Memory %', data: wave(55, 10, 4) },
    ],
    type: 'area',
    height: 300,
    smooth: true,
    showLegend: true,
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
    showLegend: false,
    series: [{ name: 'Outbound', data: wave(120, 60, 2) }],
    yFormatter: (v: number) => `${v} MB/s`,
  },
}
