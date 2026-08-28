import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { TokenUsage } from '.'

/**
 * `TokenUsage` reports what a turn (or a session) cost, in the two units that
 * matter operationally: tokens in/out, and how much of the model's context
 * window the prompt now occupies. The context meter turns amber at 75% and red
 * at 90% — well before the window is full, since by then history is already
 * being dropped.
 */
const meta = {
  title: 'AI/TokenUsage',
  component: TokenUsage,
  argTypes: {
    usage: {
      control: 'object',
      description:
        'Token counts: `prompt`, `completion`, and optionally `cached` (prompt tokens served from cache).',
    },
    contextLimit: {
      control: 'number',
      description:
        'Model context window in tokens. Adds a meter showing how much of it the prompt occupies. Omit to hide the meter.',
    },
    cost: {
      control: 'number',
      description:
        'Cost for this turn, already computed by the caller (pricing is provider-specific).',
    },
    currency: {
      control: 'text',
      description: 'ISO 4217 code used to format `cost`.',
      table: { defaultValue: { summary: 'USD' } },
    },
    locale: {
      control: 'text',
      description: "BCP 47 locale for number formatting. Defaults to the browser's.",
    },
    variant: {
      control: 'inline-radio',
      options: ['inline', 'card'],
      description: '`inline` is a meta line under a message; `card` is a bordered detail block.',
      table: { defaultValue: { summary: 'inline' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { defaultValue: { summary: 'md' } },
    },
  },
  args: {
    usage: { prompt: 12480, completion: 843 },
    cost: 0.0412,
    currency: 'USD',
    variant: 'inline',
    size: 'md',
  },
} satisfies Meta<typeof TokenUsage>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** The inline form, sized to sit under an assistant message. */
export const Inline: Story = {
  args: { size: 'sm', cost: 0.0038, usage: { prompt: 1820, completion: 264 } },
}

/** With a context meter — the number that predicts a truncated conversation. */
export const WithContextMeter: Story = {
  args: { variant: 'card', contextLimit: 200_000 },
}

/** Prompt caching reported separately, since it is billed differently. */
export const WithCachedTokens: Story = {
  args: {
    variant: 'card',
    contextLimit: 200_000,
    usage: { prompt: 48_200, completion: 1_940, cached: 41_600 },
    cost: 0.0217,
  },
}

/** The meter's three thresholds: healthy, amber at 75%, red at 90%. */
export const ContextThresholds: Story = {
  render: (args) => ({
    components: { TokenUsage },
    setup: () => ({ args }),
    template: `
      <div class="flex max-w-md flex-col gap-3">
        <TokenUsage v-bind="args" :usage="{ prompt: 60000, completion: 900 }" />
        <TokenUsage v-bind="args" :usage="{ prompt: 158000, completion: 900 }" />
        <TokenUsage v-bind="args" :usage="{ prompt: 189000, completion: 900 }" />
      </div>`,
  }),
  args: { variant: 'card', contextLimit: 200_000, cost: undefined },
}

/** A session total in a run-detail side panel. */
export const SessionTotal: Story = {
  render: (args) => ({
    components: { TokenUsage },
    setup: () => ({ args }),
    template: `
      <div class="w-80">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
          Run #4821 · 14 turns
        </p>
        <TokenUsage v-bind="args" />
      </div>`,
  }),
  args: {
    variant: 'card',
    contextLimit: 200_000,
    usage: { prompt: 146_800, completion: 22_310, cached: 98_400 },
    cost: 0.94,
  },
}
