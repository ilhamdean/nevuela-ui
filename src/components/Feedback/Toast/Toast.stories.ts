import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Button } from '../../Forms/Button'
import { Toast } from '.'

/**
 * `Toast` is a transient notification built on Reka UI's Toast (swipe to
 * dismiss, timed auto-close, accessible live region). This component is
 * controlled via `v-model:open` and bundles its own provider + viewport for
 * convenience — in a real app you'd typically host one provider and push toasts
 * through a small store.
 */
const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
      table: { defaultValue: { summary: 'info' } },
    },
    title: { control: 'text' },
    description: { control: 'text' },
    duration: { control: 'number', table: { defaultValue: { summary: '5000' } } },
    actionLabel: { control: 'text' },
  },
  args: {
    tone: 'success',
    title: 'Instance created',
    description: 'web-prod-03 is booting up in NYC1.',
    duration: 5000,
    actionLabel: 'View',
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Toast, Button },
    setup() {
      const open = ref(false)
      const show = () => {
        open.value = false
        requestAnimationFrame(() => (open.value = true))
      }
      return { args, open, show }
    },
    template: `
      <div>
        <Button variant="secondary" @click="show">Show toast</Button>
        <Toast v-bind="args" v-model:open="open" />
      </div>`,
  }),
}
