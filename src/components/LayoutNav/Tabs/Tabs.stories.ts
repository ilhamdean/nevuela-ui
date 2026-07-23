import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Activity, Gauge, Settings } from '@lucide/vue'
import { Tabs } from '.'

/**
 * `Tabs` renders an underline tab bar (built on Reka UI — full keyboard support,
 * roving focus). Pass `tabs`; render each panel through a slot named after the
 * tab's `value`.
 */
const meta = {
  title: 'Layout & Nav/Tabs',
  component: Tabs,
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Active tab value (`v-model`). Defaults to the first tab.',
    },
    tabs: { control: 'object', description: '`{ value, label, disabled?, icon? }[]`.' },
  },
  args: {
    tabs: [
      { value: 'overview', label: 'Overview' },
      { value: 'graphs', label: 'Graphs' },
      { value: 'settings', label: 'Settings' },
      { value: 'destroy', label: 'Destroy', disabled: true },
    ],
  },
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args }),
    template: `
      <div class="w-[640px]">
        <Tabs v-bind="args">
          <template #overview><p class="text-sm text-fg-subtle">Resource summary and quick stats.</p></template>
          <template #graphs><p class="text-sm text-fg-subtle">CPU, memory, and bandwidth over time.</p></template>
          <template #settings><p class="text-sm text-fg-subtle">Resize, backups, and networking.</p></template>
        </Tabs>
      </div>`,
  }),
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** With leading icons per tab. */
export const WithIcons: Story = {
  render: (args) => ({
    components: { Tabs },
    setup: () => ({
      args,
      tabs: [
        { value: 'overview', label: 'Overview', icon: Gauge },
        { value: 'graphs', label: 'Graphs', icon: Activity },
        { value: 'settings', label: 'Settings', icon: Settings },
      ],
    }),
    template: `
      <div class="w-[640px]">
        <Tabs :tabs="tabs">
          <template #panel="{ value }"><p class="text-sm text-fg-subtle">Panel: {{ value }}</p></template>
        </Tabs>
      </div>`,
  }),
}
