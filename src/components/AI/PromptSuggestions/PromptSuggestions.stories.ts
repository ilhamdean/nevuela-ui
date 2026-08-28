import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Activity, FileSearch, GitBranch, Receipt, ShieldAlert, TrendingUp } from '@lucide/vue'
import { PromptSuggestions } from '.'

/**
 * `PromptSuggestions` offers starter prompts — the cure for an empty composer.
 * `chip` is a wrapping row for follow-ups between turns; `card` is a grid for
 * the landing state of a fresh conversation. Picking one emits the text to
 * send (`prompt ?? label`), never the component's own state.
 */
const meta = {
  title: 'AI/PromptSuggestions',
  component: PromptSuggestions,
  argTypes: {
    suggestions: {
      control: 'object',
      description:
        'The offered prompts. Each has `label`, and optionally `prompt` (what to send), `description` (card variant), `icon`, and `disabled`.',
    },
    label: {
      control: 'text',
      description: "Heading above the group. Set to `''` to render the suggestions bare.",
      table: { defaultValue: { summary: 'Try asking' } },
    },
    variant: {
      control: 'inline-radio',
      options: ['chip', 'card'],
      table: { defaultValue: { summary: 'chip' } },
    },
    columns: {
      control: 'inline-radio',
      options: [1, 2, 3],
      description: "Grid columns for `variant: 'card'` at the `sm` breakpoint and up.",
      table: { defaultValue: { summary: '2' } },
    },
  },
  args: {
    label: 'Try asking',
    variant: 'chip',
    columns: 2,
    suggestions: [
      { label: 'Why did the last deploy roll back?' },
      { label: 'Show error budget burn for checkout' },
      { label: 'Summarize open incidents' },
      { label: 'Which services missed their SLO this week?' },
    ],
  },
} satisfies Meta<typeof PromptSuggestions>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** The card grid, for the landing state of an empty conversation. */
export const Cards: Story = {
  args: {
    variant: 'card',
    columns: 2,
    label: 'Get started',
    suggestions: [
      {
        label: 'Investigate an incident',
        prompt: 'Walk me through incident 2291 and what caused it.',
        description: 'Pull the timeline, the offending change, and the rollback.',
        icon: ShieldAlert,
      },
      {
        label: 'Explain a spend spike',
        prompt: "Why did last month's compute bill increase 34%?",
        description: 'Break the delta down by service and region.',
        icon: Receipt,
      },
      {
        label: 'Review a release',
        prompt: 'Summarize what shipped in release 2026.8.3.',
        description: 'Diff the changelog against the previous tag.',
        icon: GitBranch,
      },
      {
        label: 'Find a config change',
        prompt: 'Which config changes touched payments-api in the last 7 days?',
        description: 'Search audit logs across environments.',
        icon: FileSearch,
      },
    ],
  },
}

/** Icons and a third column, for a wider landing surface. */
export const ThreeColumns: Story = {
  args: {
    variant: 'card',
    columns: 3,
    label: '',
    suggestions: [
      {
        label: 'Traffic trends',
        description: 'Requests per second, last 30 days.',
        icon: TrendingUp,
      },
      {
        label: 'Service health',
        description: 'Current SLO status across all services.',
        icon: Activity,
      },
      {
        label: 'Open incidents',
        description: 'Anything still unresolved right now.',
        icon: ShieldAlert,
      },
    ],
  },
}

/** A follow-up row after an answer — chips, no heading. */
export const FollowUps: Story = {
  render: (args) => ({
    components: { PromptSuggestions },
    setup: () => ({ args }),
    template: `
      <div class="flex max-w-2xl flex-col gap-3">
        <p class="text-sm leading-relaxed text-fg">
          Three services missed their availability SLO this week: checkout (99.1% vs 99.5%),
          search (99.3%), and notifications (98.8%).
        </p>
        <PromptSuggestions v-bind="args" />
      </div>`,
  }),
  args: {
    label: '',
    suggestions: [
      { label: 'Why did notifications drop?' },
      { label: 'Show the error budget left' },
      { label: 'Draft a status update' },
    ],
  },
}

/** A suggestion can be disabled — e.g. gated behind a permission the user lacks. */
export const WithDisabled: Story = {
  args: {
    suggestions: [
      { label: 'Summarize open incidents' },
      { label: 'Restart the worker pool', disabled: true },
      { label: 'Show error budget burn' },
    ],
  },
}
