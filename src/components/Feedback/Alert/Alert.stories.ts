import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Button } from '../../Forms/Button'
import { Alert } from '.'

/**
 * `Alert` (a.k.a. banner) surfaces contextual status messages. Tone drives the
 * color and icon; `error`/`warning` announce assertively (`role="alert"`),
 * `info`/`success` politely (`role="status"`).
 */
const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
      table: { defaultValue: { summary: 'info' } },
    },
    title: { control: 'text' },
    description: { control: 'text', description: 'Body text (or use the default slot).' },
    dismissible: { control: 'boolean' },
  },
  args: {
    tone: 'info',
    title: 'Scheduled maintenance',
    description: 'Scheduled maintenance on Saturday between 02:00–04:00 UTC.',
    dismissible: true,
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: `<div class="w-[560px]"><Alert v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** All four tones. */
export const Tones: Story = {
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: `
      <div class="flex w-[560px] flex-col gap-3">
        <Alert tone="info" title="Info" description="A new export format is available." />
        <Alert tone="success" title="Import complete" description="All 248 customer records were imported successfully." />
        <Alert tone="warning" title="Approaching quota" description="You've used 82% of your transfer allowance." />
        <Alert tone="error" title="Payment failed" description="We couldn't charge your card ending in 4242." />
      </div>`,
  }),
}

/** With an action. */
export const WithActions: Story = {
  render: (args) => ({
    components: { Alert, Button },
    setup: () => ({ args }),
    template: `
      <div class="w-[560px]">
        <Alert tone="warning" title="Add a payment method" description="Add a card to keep this workspace active past the trial.">
          <template #actions>
            <Button variant="primary" size="sm">Add payment method</Button>
            <Button variant="ghost" size="sm">Dismiss</Button>
          </template>
        </Alert>
      </div>`,
  }),
}
