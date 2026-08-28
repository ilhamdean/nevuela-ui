import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Button } from '../../Forms/Button'
import { ConfirmDialog } from '.'

/**
 * `ConfirmDialog` guards irreversible actions, built on Reka UI's AlertDialog
 * (assertive role, focus trap, Escape/Cancel only — the overlay doesn't
 * dismiss). Set `requireText` to force **type-to-confirm** — the confirm button
 * stays disabled until the user types the exact string (e.g. a resource name)
 * — a safeguard for destructive actions. `confirm` fires only when allowed;
 * the parent closes the dialog (so async work can keep it open).
 */
const meta = {
  title: 'Feedback/ConfirmDialog',
  component: ConfirmDialog,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    tone: {
      control: 'inline-radio',
      options: ['danger', 'default'],
      table: { defaultValue: { summary: 'danger' } },
    },
    requireText: {
      control: 'text',
      description: 'Exact string the user must type to enable confirm.',
    },
    loading: { control: 'boolean' },
  },
  args: {
    title: 'Delete this workspace?',
    description:
      'This permanently deletes Halden & Co. and every record in it. This cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    tone: 'danger',
    requireText: 'halden-co',
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Type-to-confirm: the confirm button unlocks only after typing `halden-co`. */
export const TypeToConfirm: Story = {
  render: (args) => ({
    components: { ConfirmDialog, Button },
    setup() {
      const open = ref(false)
      const onConfirm = () => (open.value = false)
      return { args, open, onConfirm }
    },
    template: `
      <div>
        <Button variant="destructive" @click="open = true">Delete workspace…</Button>
        <ConfirmDialog v-bind="args" v-model:open="open" @confirm="onConfirm" />
      </div>`,
  }),
}

/** A simpler confirm without type-to-confirm. */
export const SimpleConfirm: Story = {
  args: {
    title: 'Archive this workspace?',
    description: 'You can restore it from the archive at any time.',
    confirmLabel: 'Archive',
    tone: 'default',
    requireText: undefined,
  },
  render: (args) => ({
    components: { ConfirmDialog, Button },
    setup() {
      const open = ref(false)
      return { args, open, onConfirm: () => (open.value = false) }
    },
    template: `
      <div>
        <Button variant="secondary" @click="open = true">Archive…</Button>
        <ConfirmDialog v-bind="args" v-model:open="open" @confirm="onConfirm" />
      </div>`,
  }),
}
