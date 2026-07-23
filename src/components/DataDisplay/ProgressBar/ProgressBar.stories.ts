import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ProgressBar } from '.'

/**
 * `ProgressBar` visualizes a bounded value (disk usage, transfer quota, upload
 * progress). Built on Reka UI's Progress, so it exposes the correct
 * `role="progressbar"` and `aria-valuenow` semantics.
 */
const meta = {
  title: 'Data Display/ProgressBar',
  component: ProgressBar,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number', table: { defaultValue: { summary: '100' } } },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    color: {
      control: 'inline-radio',
      options: ['brand', 'active', 'warning', 'error'],
      description: 'Indicator color — use `warning`/`error` to flag nearing/over quota.',
      table: { defaultValue: { summary: 'brand' } },
    },
    showValue: { control: 'boolean' },
    label: { control: 'text' },
    indeterminate: {
      control: 'boolean',
      description:
        '"Processing, duration unknown" state: an animated fill instead of a fixed width. Passes a `null` value through to Reka UI so `aria-valuenow` is correctly omitted.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    value: 64,
    max: 100,
    size: 'md',
    color: 'brand',
    showValue: true,
    label: 'Disk usage',
    indeterminate: false,
  },
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<div class="w-80"><ProgressBar v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Duration unknown — an animated fill with no `aria-valuenow`, not a fake 0%. */
export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Restoring from snapshot…', showValue: false },
}

/** Color communicates how close a quota is to its limit. */
export const QuotaThresholds: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `
      <div class="flex w-80 flex-col gap-4">
        <ProgressBar v-bind="args" :value="32" color="active" label="Bandwidth" />
        <ProgressBar v-bind="args" :value="78" color="warning" label="Storage" />
        <ProgressBar v-bind="args" :value="96" color="error" label="Transfer" />
      </div>`,
  }),
}
