import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ToolCallCard } from '.'

/**
 * `ToolCallCard` makes an agent's tool call inspectable: what it called, with
 * what arguments, what came back, and how long it took. Collapsed by default so
 * a long chain stays scannable — except on failure, where it opens itself,
 * since an error the user has to expand to read is an error they will miss.
 */
const meta = {
  title: 'AI/ToolCallCard',
  component: ToolCallCard,
  argTypes: {
    name: { control: 'text', description: 'Tool the model called, as the model named it.' },
    status: {
      control: 'inline-radio',
      options: ['pending', 'running', 'success', 'error'],
      description: 'Lifecycle of the invocation. Drives the label, dot, and border.',
      table: { defaultValue: { summary: 'success' } },
    },
    summary: {
      control: 'text',
      description: 'One-line plain-English summary of what the call did.',
    },
    args: {
      control: 'object',
      description: 'Arguments the model passed. Objects are pretty-printed as JSON.',
    },
    result: {
      control: 'object',
      description: 'What the tool returned. Ignored while `pending`/`running`.',
    },
    error: { control: 'text', description: 'Failure detail, shown instead of `result`.' },
    durationMs: { control: 'number', description: 'Wall-clock duration in milliseconds.' },
    defaultOpen: {
      control: 'boolean',
      description: 'Start expanded. Failures default to expanded regardless.',
      table: { defaultValue: { summary: 'false' } },
    },
    open: { control: false, description: 'Controlled expansion (`v-model:open`).' },
  },
  args: {
    name: 'search_runbooks',
    status: 'success',
    summary: 'Found 3 runbooks matching "connection pool"',
    args: { query: 'connection pool exhaustion', service: 'payments-api', limit: 3 },
    result: {
      matches: [
        { id: 'rb-114', title: 'payments-api connection pool exhaustion', score: 0.94 },
        { id: 'rb-087', title: 'RDS instance resize checklist', score: 0.61 },
        { id: 'rb-203', title: 'ELB idle timeout tuning', score: 0.55 },
      ],
      took_ms: 214,
    },
    durationMs: 214,
    defaultOpen: false,
  },
} satisfies Meta<typeof ToolCallCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Expanded, showing arguments and result. */
export const Expanded: Story = {
  args: { defaultOpen: true },
}

/** Every status, as a chain of calls would render them. */
export const AllStatuses: Story = {
  render: (args) => ({
    components: { ToolCallCard },
    setup: () => ({ args }),
    template: `
      <div class="flex max-w-2xl flex-col gap-2">
        <ToolCallCard
          v-bind="args"
          name="fetch_incident"
          status="success"
          summary="Loaded incident 2291"
          :duration-ms="96"
        />
        <ToolCallCard
          v-bind="args"
          name="query_metrics"
          status="running"
          summary="Fetching 5xx rate for checkout, last 24h"
          :duration-ms="undefined"
          :result="undefined"
        />
        <ToolCallCard
          v-bind="args"
          name="post_status_update"
          status="pending"
          summary="Waiting on approval"
          :duration-ms="undefined"
          :result="undefined"
        />
      </div>`,
  }),
}

/** A failed call opens itself and shows the error instead of a result. */
export const Failed: Story = {
  args: {
    name: 'query_metrics',
    status: 'error',
    summary: 'Metrics API rejected the request',
    args: { metric: 'http_5xx_rate', service: 'checkout', window: '24h' },
    result: undefined,
    error: 'HTTP 403: token lacks the `metrics:read` scope for workspace eu-west-1.',
    durationMs: 1840,
  },
}

/** In-flight: no result yet, and the duration is unknown. */
export const Running: Story = {
  args: {
    status: 'running',
    summary: 'Searching 1,284 runbooks',
    result: undefined,
    durationMs: undefined,
  },
}

/** With no arguments, result, or error, the card is a non-collapsible one-line record. */
export const HeaderOnly: Story = {
  args: {
    name: 'get_current_user',
    status: 'success',
    summary: 'Resolved the caller identity',
    args: undefined,
    result: undefined,
    durationMs: 12,
  },
}

/** A realistic agent turn: three calls, one of which failed. */
export const AgentTrace: Story = {
  render: (args) => ({
    components: { ToolCallCard },
    setup: () => ({ args }),
    template: `
      <div class="flex max-w-2xl flex-col gap-2">
        <ToolCallCard
          name="list_deploys"
          status="success"
          summary="3 deploys in the last 6 hours"
          :args="{ service: 'payments-api', since: '6h' }"
          :result="{ deploys: [
            { sha: '9f2c1ab', at: '13:58Z', author: 'platform-bot', rolled_back: true },
            { sha: '4d81e07', at: '11:12Z', author: 'platform-bot', rolled_back: false },
            { sha: 'c003fa9', at: '08:44Z', author: 'platform-bot', rolled_back: false }
          ] }"
          :duration-ms="143"
        />
        <ToolCallCard
          name="diff_config"
          status="success"
          summary="max_connections: 200 → 20"
          :args="{ from: '4d81e07', to: '9f2c1ab' }"
          :result="{ changed: [{ key: 'max_connections', before: 200, after: 20 }] }"
          :duration-ms="88"
          default-open
        />
        <ToolCallCard
          name="page_oncall"
          status="error"
          summary="Could not reach the paging provider"
          :args="{ rotation: 'payments-primary', severity: 'sev2' }"
          error="Upstream timeout after 10s. The paging provider returned no response."
          :duration-ms="10042"
        />
      </div>`,
  }),
  args: {},
}
