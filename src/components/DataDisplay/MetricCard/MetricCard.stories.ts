import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Cpu } from '@lucide/vue'
import { MetricCard } from '.'

/**
 * `MetricCard` presents a single headline stat with an optional icon, a
 * period-over-period delta chip, and a `#sparkline` slot for an inline chart.
 * Delta tone defaults to positive/negative by direction, but you can override it
 * (e.g. a rising error rate is negative even though it went "up").
 */
const meta = {
  title: 'Data Display/MetricCard',
  component: MetricCard,
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    unit: { control: 'text' },
    helpText: { control: 'text' },
    delta: { control: 'object', description: '`{ value, direction: "up"|"down", tone? }`.' },
  },
  args: {
    label: 'CPU usage',
    value: '38',
    unit: '%',
    helpText: 'Avg over the last 24 hours',
    delta: { value: 4.2, direction: 'up', tone: 'neutral' },
  },
  render: (args) => ({
    components: { MetricCard, Cpu },
    setup: () => ({ args, Cpu }),
    template: `<div class="w-64"><MetricCard v-bind="args" :icon="Cpu" /></div>`,
  }),
} satisfies Meta<typeof MetricCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** A row of metrics with differing delta tones, plus a simple SVG sparkline. */
export const DashboardRow: Story = {
  render: (args) => ({
    components: { MetricCard },
    setup: () => ({ args }),
    template: `
      <div class="grid w-[720px] grid-cols-3 gap-4">
        <MetricCard label="Bandwidth" value="1.2" unit="TB" :delta="{ value: 8.1, direction: 'up', tone: 'positive' }" help-text="of 4 TB included">
          <template #sparkline>
            <svg viewBox="0 0 100 40" class="h-full w-full" preserveAspectRatio="none">
              <polyline fill="none" stroke="var(--brand)" stroke-width="2" points="0,30 20,26 40,28 60,16 80,18 100,8" />
            </svg>
          </template>
        </MetricCard>
        <MetricCard label="Requests" value="94.2k" :delta="{ value: 2.3, direction: 'down', tone: 'neutral' }" help-text="Last hour" />
        <MetricCard label="Error rate" value="0.42" unit="%" :delta="{ value: 15, direction: 'up', tone: 'negative' }" help-text="5xx responses" />
      </div>`,
  }),
}
