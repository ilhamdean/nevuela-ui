import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { StreamingText } from '.'

/**
 * `StreamingText` reveals text a character at a time, the way a token stream
 * arrives. Growing `text` continues the reveal; replacing it with unrelated
 * text restarts it. The full string is exposed to assistive tech immediately —
 * announcing a half-revealed buffer would read out truncated words — and the
 * animation is skipped entirely under `prefers-reduced-motion`.
 */
const meta = {
  title: 'AI/StreamingText',
  component: StreamingText,
  argTypes: {
    text: { control: 'text', description: 'The full text to reveal.' },
    streaming: {
      control: 'boolean',
      description: 'The model is still producing tokens. Keeps the caret visible once caught up.',
      table: { defaultValue: { summary: 'false' } },
    },
    charsPerSecond: {
      control: { type: 'range', min: 0, max: 2000, step: 50 },
      description: 'Reveal rate. `0` renders instantly with no animation.',
      table: { defaultValue: { summary: '400' } },
    },
    caret: {
      control: 'boolean',
      description: 'Blinking caret at the end of the revealed text.',
      table: { defaultValue: { summary: 'true' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
  },
  args: {
    text: 'Checking the deployment history for api-gateway. The last three releases all rolled back within 90 seconds of going live.',
    streaming: true,
    charsPerSecond: 400,
    caret: true,
    size: 'md',
  },
} satisfies Meta<typeof StreamingText>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Once the stream ends, `streaming: false` drops the caret. */
export const Finished: Story = {
  args: { streaming: false, charsPerSecond: 0 },
}

/** A slow rate makes the reveal deliberate — useful for short, high-stakes answers. */
export const SlowReveal: Story = {
  args: { charsPerSecond: 60 },
}

/** All three sizes, revealing together. */
export const Sizes: Story = {
  render: (args) => ({
    components: { StreamingText },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col gap-3">
        <StreamingText v-bind="args" size="sm" />
        <StreamingText v-bind="args" size="md" />
        <StreamingText v-bind="args" size="lg" />
      </div>`,
  }),
  args: { text: 'Scaling the worker pool from 4 to 12 instances.' },
}

/** An incident summary streaming into a response surface. */
export const IncidentSummary: Story = {
  render: (args) => ({
    components: { StreamingText },
    setup: () => ({ args }),
    template: `
      <div class="max-w-xl rounded-lg border border-border bg-surface p-4">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">Summary</p>
        <StreamingText v-bind="args" class="block leading-relaxed" />
      </div>`,
  }),
  args: {
    text: 'Between 14:02 and 14:31 UTC, checkout requests failed for roughly 8% of sessions in eu-west-1. The cause was a connection-pool exhaustion in payments-api after a config change reduced max_connections from 200 to 20. Rolling the change back restored the error rate to baseline within four minutes.',
    charsPerSecond: 300,
  },
}
