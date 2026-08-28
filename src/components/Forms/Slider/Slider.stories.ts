import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Slider } from '.'

/**
 * `Slider` is a draggable numeric input for threshold, percentage, and range
 * filters — e.g. "stock threshold %" or "price range $" in a list-page filter
 * bar. It wraps Reka UI's array-based `SliderRoot`: a single thumb is bound
 * to a 1-length array (`[value]`), and a two-thumb range falls out of the
 * same model by binding a 2-length array (`[lo, hi]`) — one `SliderThumb`
 * renders per entry.
 */
const meta = {
  title: 'Forms/Slider',
  component: Slider,
  argTypes: {
    modelValue: {
      control: 'object',
      description:
        'Current value(s). A single thumb is `[value]`; a two-thumb range is `[lo, hi]`. `v-model`-able.',
      table: { defaultValue: { summary: '[0]' } },
    },
    min: {
      control: 'number',
      description: 'Minimum permitted value.',
      table: { defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description: 'Maximum permitted value.',
      table: { defaultValue: { summary: '100' } },
    },
    step: {
      control: 'number',
      description: 'Stepping interval.',
      table: { defaultValue: { summary: '1' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable dragging and keyboard interaction.',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description:
        'Track thickness and thumb size: `sm` 4px / 14px, `md` 6px / 16px, `lg` 8px / 18px.',
      table: { defaultValue: { summary: 'md' } },
    },
    showValue: {
      control: 'boolean',
      description: 'Show the current value(s) as a caption above the track.',
      table: { defaultValue: { summary: 'false' } },
    },
    label: {
      control: 'text',
      description:
        'Caption shown at the start of the label row, and the `aria-label` fallback for a single thumb.',
    },
    formatValue: {
      control: false,
      description:
        'Formats a raw numeric value for display in the caption, e.g. `(v) => `${v}%`` or `(v) => `$${v}``.',
    },
  },
  args: {
    modelValue: [40],
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    size: 'md',
    showValue: true,
    label: 'Value',
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground — single thumb, drive every prop from the Controls panel. */
export const Playground: Story = {
  render: (args) => ({
    components: { Slider },
    setup: () => ({ args }),
    template: `<div class="w-80"><Slider v-bind="args" /></div>`,
  }),
}

/** Two-thumb range — the same array model, just seeded with two values. */
export const Range: Story = {
  render: (args) => ({
    components: { Slider },
    setup: () => ({ args }),
    template: `<div class="w-80"><Slider v-bind="args" /></div>`,
  }),
  args: {
    modelValue: [50, 350],
    min: 0,
    max: 500,
    step: 10,
    label: 'Price range',
    formatValue: (v: number) => `$${v}`,
  },
}

/** The three track/thumb sizes side by side. */
export const Sizes: Story = {
  render: (args) => ({
    components: { Slider },
    setup: () => ({ args }),
    template: `
      <div class="flex w-80 flex-col gap-6">
        <Slider v-bind="args" size="sm" label="Small" :model-value="[30]" />
        <Slider v-bind="args" size="md" label="Medium" :model-value="[50]" />
        <Slider v-bind="args" size="lg" label="Large" :model-value="[70]" />
      </div>`,
  }),
}

/** Disabled state — dimmed and non-interactive. */
export const Disabled: Story = {
  args: {
    modelValue: [65],
    label: 'Low-stock threshold',
    disabled: true,
    formatValue: (v: number) => `${v}%`,
  },
  render: (args) => ({
    components: { Slider },
    setup: () => ({ args }),
    template: `<div class="w-80"><Slider v-bind="args" /></div>`,
  }),
}

/** Realistic usage: a low-stock alert threshold filter with a `%` suffix. */
export const StockAlertThreshold: Story = {
  render: (args) => ({
    components: { Slider },
    setup: () => ({ args }),
    template: `
      <div class="w-80 rounded-xl border border-border bg-surface p-4">
        <Slider v-bind="args" />
      </div>`,
  }),
  args: {
    modelValue: [80],
    min: 0,
    max: 100,
    step: 1,
    label: 'Low-stock alert threshold',
    showValue: true,
    formatValue: (v: number) => `${v}%`,
  },
}
