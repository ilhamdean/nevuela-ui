import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Select } from '.'

const regions = [
  { label: 'New York 1 (NYC1)', value: 'nyc1' },
  { label: 'San Francisco 3 (SFO3)', value: 'sfo3' },
  { label: 'Amsterdam 3 (AMS3)', value: 'ams3' },
  { label: 'Singapore 1 (SGP1)', value: 'sgp1' },
  { label: 'Frankfurt 1 (FRA1) — at capacity', value: 'fra1', disabled: true },
]

/**
 * `Select` wraps Reka UI's listbox with full keyboard support and typeahead.
 * Pass `options`, or supply custom `SelectItem`s through the default slot.
 */
const meta = {
  title: 'Forms/Select',
  component: Select,
  argTypes: {
    modelValue: { control: 'text', description: 'Selected value (`v-model`).' },
    options: { control: 'object', description: 'Array of `{ label, value, disabled? }`.' },
    placeholder: { control: 'text' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    options: regions,
    placeholder: 'Choose a datacenter region',
    size: 'md',
    invalid: false,
    disabled: false,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: `<div class="w-80"><Select v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Preselected: Story = { args: { modelValue: 'nyc1' } }

export const Invalid: Story = { args: { invalid: true } }

export const Disabled: Story = { args: { disabled: true, modelValue: 'nyc1' } }
