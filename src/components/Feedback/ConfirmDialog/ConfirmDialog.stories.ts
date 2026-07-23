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
    title: 'Destroy this Instance?',
    description:
      'This permanently destroys web-prod-01 and all of its data. This cannot be undone.',
    confirmLabel: 'Destroy',
    cancelLabel: 'Cancel',
    tone: 'danger',
    requireText: 'web-prod-01',
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Type-to-confirm: the confirm button unlocks only after typing `web-prod-01`. */
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
        <Button variant="destructive" @click="open = true">Destroy Instance…</Button>
        <ConfirmDialog v-bind="args" v-model:open="open" @confirm="onConfirm" />
      </div>`,
  }),
}

/** A simpler confirm without type-to-confirm. */
export const SimpleConfirm: Story = {
  args: {
    title: 'Power off Instance?',
    description: 'You can power it back on at any time.',
    confirmLabel: 'Power off',
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
        <Button variant="secondary" @click="open = true">Power off…</Button>
        <ConfirmDialog v-bind="args" v-model:open="open" @confirm="onConfirm" />
      </div>`,
  }),
}
