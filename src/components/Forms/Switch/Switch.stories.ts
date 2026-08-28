import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Switch } from '.'

/** `Switch` is a toggle for immediate on/off settings, built on Reka UI. */
const meta = {
  title: 'Forms/Switch',
  component: Switch,
  argTypes: {
    modelValue: { control: 'boolean', description: 'On/off state (`v-model`).' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: { control: 'boolean' },
    loading: {
      control: 'boolean',
      description:
        'Shows a spinner over the thumb, sets `aria-busy`, and blocks toggling — for a setting that calls an API and may fail/revert.',
      table: { defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the field invalid: status-error ring + `aria-invalid`. Pair with a FormField error.',
      table: { defaultValue: { summary: 'false' } },
    },
    label: { control: 'text', description: 'Inline label (or use the default slot).' },
  },
  args: {
    size: 'md',
    disabled: false,
    loading: false,
    invalid: false,
    modelValue: true,
    label: 'Enable backups',
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Off: Story = { args: { modelValue: false } }

export const Disabled: Story = { args: { disabled: true } }

/** Toggling a setting that calls an API — spinner replaces the thumb while in flight. */
export const Loading: Story = { args: { loading: true } }

/** Wired into a FormField error state — status-error ring + `aria-invalid`. */
export const Invalid: Story = { args: { invalid: true, modelValue: false } }

export const Sizes: Story = {
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col gap-3">
        <Switch v-bind="args" size="sm" label="Small" />
        <Switch v-bind="args" size="md" label="Medium" />
      </div>`,
  }),
  args: { label: '' },
}
