import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { SourceList } from '.'

/**
 * `SourceList` shows the documents a retrieval-augmented answer was built from,
 * numbered so prose can cite them. Only `http(s)` URLs become real links — a
 * `file:` or `javascript:` URL coming out of a retrieval pipeline is rendered
 * as an inert button that emits `select`, so the host app can open it in its
 * own viewer.
 */
const meta = {
  title: 'AI/SourceList',
  component: SourceList,
  argTypes: {
    sources: {
      control: 'object',
      description:
        'The cited documents. Each has `title`, and optionally `url`, `snippet`, `source`, `relevance` (0–1), and `id`.',
    },
    label: {
      control: 'text',
      description: "Heading above the list. Set to `''` to render the list on its own.",
      table: { defaultValue: { summary: 'Sources' } },
    },
    variant: {
      control: 'inline-radio',
      options: ['list', 'compact'],
      description: '`list` is a numbered reading list; `compact` is a row of citation chips.',
      table: { defaultValue: { summary: 'list' } },
    },
    showRelevance: {
      control: 'boolean',
      description: 'Show the retrieval score for sources that carry one.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    label: 'Sources',
    variant: 'list',
    showRelevance: false,
    sources: [
      {
        id: 'rb-114',
        title: 'Runbook: payments-api connection pool exhaustion',
        url: 'https://docs.example.com/runbooks/payments-pool',
        snippet:
          'When max_connections drops below the worker count, requests queue until the ELB idle timeout fires. Restore the previous value and restart rolling.',
        source: 'Runbooks',
        relevance: 0.94,
      },
      {
        id: 'inc-2291',
        title: 'Incident 2291 — checkout 5xx spike in eu-west-1',
        url: 'https://status.example.com/incidents/2291',
        snippet:
          'Error rate peaked at 8.1% of checkout sessions for 29 minutes. Root cause was a config change merged at 13:58 UTC.',
        source: 'Status page',
        relevance: 0.81,
      },
      {
        id: 'pr-8840',
        title: 'PR #8840 — reduce payments-api max_connections',
        url: 'https://github.example.com/platform/payments-api/pull/8840',
        snippet: 'Lowers max_connections from 200 to 20 to fit the new RDS instance class.',
        relevance: 0.72,
      },
    ],
  },
} satisfies Meta<typeof SourceList>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Retrieval scores turned on, for debugging a RAG pipeline. */
export const WithRelevance: Story = {
  args: { showRelevance: true },
}

/** The compact form — citation chips under a message, where snippets would crowd the answer. */
export const Compact: Story = {
  args: { variant: 'compact', label: 'Cited' },
}

/**
 * Sources without a usable URL render as buttons rather than links, and emit
 * `select` so the app can open its own document viewer.
 */
export const NonLinkSources: Story = {
  args: {
    label: 'Retrieved context',
    sources: [
      {
        id: 'kb-1',
        title: 'Q3 capacity plan (internal)',
        snippet: 'Worker pools are provisioned for 2.1x peak, measured over the trailing 30 days.',
        source: 'Confluence export',
        relevance: 0.88,
      },
      {
        id: 'kb-2',
        title: 'On-call handbook §4: escalation paths',
        source: 'Internal wiki',
        relevance: 0.64,
      },
    ],
    showRelevance: true,
  },
}

/** Sitting under an assistant answer, which is where it usually lives. */
export const UnderAnAnswer: Story = {
  render: (args) => ({
    components: { SourceList },
    setup: () => ({ args }),
    template: `
      <div class="flex max-w-2xl flex-col gap-4">
        <p class="text-sm leading-relaxed text-fg">
          The checkout failures came from connection-pool exhaustion in
          <code class="rounded-sm bg-bg-subtle px-1 py-0.5 font-mono text-xs">payments-api</code>,
          introduced by PR #8840 lowering <code class="rounded-sm bg-bg-subtle px-1 py-0.5 font-mono text-xs">max_connections</code>
          from 200 to 20. Rolling that change back restored the error rate within four minutes.
        </p>
        <SourceList v-bind="args" />
      </div>`,
  }),
}
