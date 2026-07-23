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
    label: { control: 'text', description: 'Inline label (or use the default slot).' },
  },
  args: {
    size: 'md',
    disabled: false,
    modelValue: true,
    label: 'Enable backups',
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Off: Story = { args: { modelValue: false } }

export const Disabled: Story = { args: { disabled: true } }

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
