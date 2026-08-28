import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ThinkingIndicator } from '.'

/**
 * `ThinkingIndicator` fills the gap between sending a prompt and the first
 * token arriving. The animated dots are decorative — the state is carried by
 * the text label and a `role="status"` region, so it's announced rather than
 * merely seen.
 */
const meta = {
  title: 'AI/ThinkingIndicator',
  component: ThinkingIndicator,
  argTypes: {
    label: {
      control: 'text',
      description: 'What the agent is doing. Say the actual step when you know it.',
      table: { defaultValue: { summary: 'Thinking' } },
    },
    showElapsed: {
      control: 'boolean',
      description: 'Count up from mount, so a long turn does not look hung.',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'inline-radio',
      options: ['bare', 'pill'],
      description: '`bare` sits inline in a message; `pill` reads as its own block.',
      table: { defaultValue: { summary: 'bare' } },
    },
  },
  args: {
    label: 'Thinking',
    showElapsed: false,
    size: 'md',
    variant: 'bare',
  },
} satisfies Meta<typeof ThinkingIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Both variants, at both sizes. */
export const Variants: Story = {
  render: (args) => ({
    components: { ThinkingIndicator },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col items-start gap-3">
        <ThinkingIndicator v-bind="args" variant="bare" size="sm" />
        <ThinkingIndicator v-bind="args" variant="bare" size="md" />
        <ThinkingIndicator v-bind="args" variant="pill" size="sm" />
        <ThinkingIndicator v-bind="args" variant="pill" size="md" />
      </div>`,
  }),
}

/** A running timer reassures the user that a slow turn is still alive. */
export const WithElapsedTime: Story = {
  args: { showElapsed: true, variant: 'pill', label: 'Analyzing 1,284 log lines' },
}

/** Naming the current step beats a generic "Thinking" whenever the agent knows it. */
export const NamedSteps: Story = {
  render: (args) => ({
    components: { ThinkingIndicator },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col items-start gap-3">
        <ThinkingIndicator v-bind="args" label="Searching runbooks" />
        <ThinkingIndicator v-bind="args" label="Querying the metrics API" />
        <ThinkingIndicator v-bind="args" label="Summarizing 6 incidents" />
      </div>`,
  }),
  args: { variant: 'pill' },
}
