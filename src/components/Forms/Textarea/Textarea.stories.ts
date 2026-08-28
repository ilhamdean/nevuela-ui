import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Textarea } from '.'

/** Multi-line text control. Native attributes fall through to the `<textarea>`. */
const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  argTypes: {
    modelValue: { control: 'text', description: 'Bound value (`v-model`).' },
    invalid: { control: 'boolean', description: 'Invalid state: red border + `aria-invalid`.' },
    disabled: { control: 'boolean' },
    resize: {
      control: 'inline-radio',
      options: ['none', 'vertical', 'both'],
      description: 'Resize affordance.',
      table: { defaultValue: { summary: 'vertical' } },
    },
    rows: { control: { type: 'number', min: 2, max: 12 } },
    placeholder: { control: 'text' },
  },
  args: {
    invalid: false,
    disabled: false,
    resize: 'vertical',
    rows: 4,
    placeholder: 'Add a note about this resource…',
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: `<div class="w-96"><Textarea v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Invalid: Story = {
  args: { invalid: true, modelValue: '' },
}

export const Disabled: Story = {
  args: { disabled: true, modelValue: 'This field is read-only in the current state.' },
}
