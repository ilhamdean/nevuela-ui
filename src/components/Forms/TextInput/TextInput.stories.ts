import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Search } from '@lucide/vue'
import { TextInput } from '.'

/**
 * `TextInput` is the base single-line text control. Native attributes
 * (`placeholder`, `id`, `name`, `autocomplete`, `aria-describedby`…) fall
 * through to the underlying `<input>`. Pair it with `FormField` for a label,
 * hint, and error message.
 */
const meta = {
  title: 'Forms/TextInput',
  component: TextInput,
  argTypes: {
    modelValue: { control: 'text', description: 'Bound value (`v-model`).' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Control height: `sm` 32px, `md` 40px, `lg` 48px.',
      table: { defaultValue: { summary: 'md' } },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'number', 'url', 'tel'],
      table: { defaultValue: { summary: 'text' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Invalid state: red border + `aria-invalid`.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    placeholder: { control: 'text' },
  },
  args: {
    size: 'md',
    type: 'text',
    invalid: false,
    disabled: false,
    placeholder: 'e.g. web-prod-01',
  },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args }),
    template: `<div class="w-80"><TextInput v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** The three sizes. */
export const Sizes: Story = {
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args }),
    template: `
      <div class="flex w-80 flex-col gap-3">
        <TextInput v-bind="args" size="sm" placeholder="Small" />
        <TextInput v-bind="args" size="md" placeholder="Medium" />
        <TextInput v-bind="args" size="lg" placeholder="Large" />
      </div>`,
  }),
}

/** A leading icon via the `#leading` slot — a search field. */
export const WithLeadingIcon: Story = {
  render: (args) => ({
    components: { TextInput, Search },
    setup: () => ({ args }),
    template: `
      <div class="w-80">
        <TextInput v-bind="args" type="search" placeholder="Search Instances…">
          <template #leading><Search /></template>
        </TextInput>
      </div>`,
  }),
}

/** Invalid state. */
export const Invalid: Story = {
  args: { invalid: true, modelValue: 'not-a-valid-name!' },
}

/** Disabled state. */
export const Disabled: Story = {
  args: { disabled: true, modelValue: 'web-prod-01' },
}
