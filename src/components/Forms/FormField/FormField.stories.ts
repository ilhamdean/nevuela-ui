import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { TextInput } from '../TextInput'
import { Select } from '../Select'
import { FormField } from '.'

/**
 * `FormField` provides the label, required marker, hint, and error message for a
 * control, and wires up `for`/`id`, `aria-describedby`, and `aria-invalid`. The
 * control receives everything it needs through the slot's `bind` object:
 * `<FormField v-slot="{ bind }"><TextInput v-bind="bind" /></FormField>`.
 */
const meta = {
  title: 'Forms/FormField',
  component: FormField,
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text', description: 'Helper text (hidden while an error is shown).' },
    error: { control: 'text', description: 'Error message; sets the control invalid.' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Workspace name',
    hint: 'Lowercase letters, numbers, and hyphens only.',
    error: '',
    required: true,
  },
  render: (args) => ({
    components: { FormField, TextInput },
    setup: () => ({ args }),
    template: `
      <div class="w-96">
        <FormField v-bind="args" v-slot="{ bind }">
          <TextInput v-bind="bind" placeholder="e.g. halden-co" />
        </FormField>
      </div>`,
  }),
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithError: Story = {
  args: { error: 'That name is already taken in this organization.' },
}

/** Works with any control that accepts `id` / `aria-describedby` / `invalid`. */
export const WithSelect: Story = {
  render: (args) => ({
    components: { FormField, Select },
    setup: () => ({ args }),
    template: `
      <div class="w-96">
        <FormField v-bind="args" v-slot="{ bind }">
          <Select
            v-bind="bind"
            placeholder="Choose a plan"
            :options="[
              { label: 'Team — up to 50 members', value: 'team' },
              { label: 'Business — unlimited members', value: 'business' },
            ]"
          />
        </FormField>
      </div>`,
  }),
  args: { label: 'Plan', hint: 'You can change plans at any time.' },
}
