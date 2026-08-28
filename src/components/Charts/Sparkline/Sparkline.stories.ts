import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Sparkline } from '.'
import { MetricCard } from '../../DataDisplay/MetricCard'

const rising = [12, 14, 13, 16, 18, 17, 21, 24, 23, 27, 30]
const falling = [30, 27, 28, 24, 22, 23, 19, 17, 18, 14, 12]

/**
 * `Sparkline` is a tiny, chrome-free inline trend line — no axes, legend, or
 * tooltip — meant for table cells and `MetricCard`'s `#sparkline` slot. It's
 * a plain hand-rolled SVG `<polyline>`/`<polygon>` (no echarts), so it stays
 * cheap to render dozens of at once in a data-dense list. Color defaults to
 * `tone: 'auto'`, which compares the last value in `data` to the first to
 * pick a rising/falling/flat tone; pass an explicit `tone` or `color` to
 * override it independent of the data's shape.
 */
const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  argTypes: {
    data: {
      control: 'object',
      description:
        'Trend values, oldest first. Empty renders nothing; one value renders a flat line.',
    },
    height: {
      control: 'number',
      description: 'SVG pixel height.',
      table: { defaultValue: { summary: '32' } },
    },
    width: {
      control: 'text',
      description: "Rendered width — a CSS length (e.g. '100%', '8rem') or a number of px.",
      table: { defaultValue: { summary: "'100%'" } },
    },
    color: {
      control: 'color',
      description: 'Explicit stroke/fill color override. Takes precedence over `tone`.',
    },
    tone: {
      control: 'select',
      options: ['auto', 'brand', 'positive', 'negative', 'neutral'],
      description:
        "'auto' compares the last value to the first (rising = green, falling = red, flat = " +
        'neutral). The other values force that tone regardless of trend.',
      table: { defaultValue: { summary: 'auto' } },
    },
    area: {
      control: 'boolean',
      description: 'Soft ~12% opacity fill under the line, down to the baseline.',
      table: { defaultValue: { summary: 'true' } },
    },
    strokeWidth: {
      control: 'number',
      description: 'Line stroke width in SVG user units.',
      table: { defaultValue: { summary: '1.5' } },
    },
  },
  args: {
    data: rising,
    height: 32,
    width: 160,
    area: true,
    tone: 'auto',
    strokeWidth: 1.5,
  },
  render: (args) => ({
    components: { Sparkline },
    setup: () => ({ args }),
    template: `<div style="width: 160px"><Sparkline v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof Sparkline>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** `tone: 'auto'` reads the trend from the data — no manual tone needed. */
export const UpTrend: Story = {
  args: { data: rising },
}

/** Same `tone: 'auto'`, but the data ends lower than it starts. */
export const DownTrend: Story = {
  args: { data: falling },
}

/** `area: false` renders just the stroked line, no fill under it. */
export const NoArea: Story = {
  args: { data: rising, area: false },
}

/**
 * Edge cases the component guards explicitly: empty data (renders nothing),
 * a single data point (flat line, no division by zero), and all-identical
 * values (would otherwise produce `NaN` from `(v - min) / (max - min)` when
 * `max === min` — falls back to the same flat mid-height line).
 */
export const EdgeCases: Story = {
  render: () => ({
    components: { Sparkline },
    setup: () => ({ empty: [] as number[], single: [42], flat: [10, 10, 10, 10, 10] }),
    template: `
      <div class="flex w-[480px] flex-col gap-4">
        <div>
          <p class="mb-1 text-xs text-fg-subtle">Empty data (renders nothing)</p>
          <div class="h-8 w-40 rounded border border-dashed border-border">
            <Sparkline :data="empty" />
          </div>
        </div>
        <div>
          <p class="mb-1 text-xs text-fg-subtle">Single value (flat line)</p>
          <div class="w-40"><Sparkline :data="single" /></div>
        </div>
        <div>
          <p class="mb-1 text-xs text-fg-subtle">All-identical values (flat line, no NaN)</p>
          <div class="w-40"><Sparkline :data="flat" /></div>
        </div>
      </div>`,
  }),
}

/** A realistic `MetricCard`, using its `#sparkline` slot exactly as intended. */
export const InMetricCard: Story = {
  render: () => ({
    components: { MetricCard, Sparkline },
    setup: () => ({
      trend: [48, 51, 50, 55, 58, 57, 60, 59, 62],
    }),
    template: `
      <div class="w-64">
        <MetricCard
          label="Checkout conversion"
          value="62"
          unit="%"
          :delta="{ value: 6.4, direction: 'up', tone: 'neutral' }"
          help-text="Avg over the last hour"
        >
          <template #sparkline>
            <Sparkline :data="trend" :height="48" />
          </template>
        </MetricCard>
      </div>`,
  }),
}
