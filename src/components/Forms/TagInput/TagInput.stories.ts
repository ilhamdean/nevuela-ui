import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { TagInput } from '.'

/**
 * `TagInput` wraps Reka UI's `TagsInput` for freeform multi-value text entry — type a value and
 * press Enter or comma to commit it as a removable chip. Unlike `Select`'s `multiple` +
 * `searchable` mode, there is no fixed option list: any string the user types can become a tag,
 * making it a fit for allow-listed IPs, invite emails, or free-text labels.
 */
const meta = {
  title: 'Forms/TagInput',
  component: TagInput,
  argTypes: {
    modelValue: {
      control: 'object',
      description: 'Committed tag values (`v-model`) — an array of arbitrary strings.',
    },
    placeholder: {
      control: 'text',
      description: 'Text shown in the input when empty.',
      table: { defaultValue: { summary: 'Add value…' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Field height / density (grows to a second line as chips wrap).',
      table: { defaultValue: { summary: 'md' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Marks the field invalid: red border + `aria-invalid` on the input.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the whole control — no typing, no chip removal.',
      table: { defaultValue: { summary: 'false' } },
    },
    max: {
      control: 'number',
      description: 'Maximum number of tags allowed. Once reached, the text input is disabled.',
    },
    id: {
      control: 'text',
      description: 'Id placed on the underlying `<input>`, for associating a `<label for>`.',
    },
  },
  args: {
    modelValue: [],
    placeholder: 'Add an IP address…',
    size: 'md',
    invalid: false,
    disabled: false,
  },
  render: (args) => ({
    components: { TagInput },
    setup: () => ({ args }),
    template: `<div class="w-96"><TagInput v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof TagInput>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground — drive every prop from the Controls panel. */
export const Playground: Story = {}

/** Starting values already committed, e.g. an existing IP allow-list. */
export const Prefilled: Story = {
  args: {
    modelValue: ['203.0.113.4', '198.51.100.20', '10.0.0.0/8'],
    placeholder: 'Add an IP address…',
  },
}

/** `max` caps the tag count; the text input disables itself once the limit is reached. */
export const MaxLimit: Story = {
  name: 'Max limit',
  args: {
    modelValue: ['203.0.113.4', '198.51.100.20', '10.0.0.0/8', '172.16.0.0/12', '192.168.1.1'],
    max: 5,
    placeholder: 'Add an IP address…',
  },
}

/** Invalid state — pair with a `FormField` error message. */
export const Invalid: Story = {
  args: { invalid: true, modelValue: ['not-an-ip'], placeholder: 'Add an IP address…' },
}

/** Disabled — no typing, no chip removal. */
export const Disabled: Story = {
  args: { disabled: true, modelValue: ['203.0.113.4', '198.51.100.20'] },
}

/** Realistic-data story: inviting teammates by email. */
export const InviteTeammates: Story = {
  name: 'Invite teammates by email',
  args: {
    modelValue: ['ada@example.com', 'grace@example.com'],
    placeholder: 'Enter an email and press Enter…',
  },
}
