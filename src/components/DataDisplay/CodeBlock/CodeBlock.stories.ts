import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CodeBlock } from '.'

/**
 * `CodeBlock` is a multi-line, monospace code/config/JSON panel with a copy-to-clipboard
 * button and an optional header bar (filename/language label) — for API responses, webhook
 * payloads, config snippets, and CLI examples in a console UI. Unlike `CopyableField` (a
 * single-line inline value), this is a distinct block-level "code panel". There is no syntax
 * highlighting by design — `language` is a cosmetic label only. Passing an object or array as
 * `code` pretty-prints it via `JSON.stringify(code, null, 2)`; the copy button always copies
 * the final rendered string.
 */
const meta = {
  title: 'Data Display/CodeBlock',
  component: CodeBlock,
  argTypes: {
    code: {
      control: 'text',
      description:
        'The code/config/JSON to display. Objects and arrays are pretty-printed via `JSON.stringify(code, null, 2)`; strings render as-is.',
    },
    language: {
      control: 'text',
      description:
        'Cosmetic language label shown in the header (e.g. "json", "yaml", "bash"). No syntax highlighting is applied.',
      table: { defaultValue: { summary: 'undefined' } },
    },
    filename: {
      control: 'text',
      description: 'Filename shown in the header instead of/alongside `language`.',
      table: { defaultValue: { summary: 'undefined' } },
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Render a non-selectable line-number column on the left.',
      table: { defaultValue: { summary: 'false' } },
    },
    maxHeight: {
      control: 'text',
      description:
        'Cap the block\'s height and scroll vertically past it. A number is treated as px; a string is used as-is (e.g. "50vh").',
      table: { defaultValue: { summary: 'undefined' } },
    },
    wrap: {
      control: 'boolean',
      description: 'Wrap long lines instead of scrolling horizontally.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    code: 'name: web\nservices:\n  app:\n    image: nginx:latest\n    ports:\n      - "80:80"\n    restart: unless-stopped',
    language: 'yaml',
    filename: undefined,
    showLineNumbers: false,
    maxHeight: undefined,
    wrap: false,
  },
  render: (args) => ({
    components: { CodeBlock },
    setup: () => ({ args }),
    template: `<div class="w-[32rem]"><CodeBlock v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof CodeBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Passing an object as `code` pretty-prints it — the copy button copies the formatted JSON, not `[object Object]`. */
export const JsonObject: Story = {
  args: {
    language: 'json',
    filename: undefined,
    code: {
      id: 'req_8f2a1c3e',
      status: 'succeeded',
      amount: 4899,
      currency: 'usd',
      customer: 'cus_9k2LmQ',
      created: '2026-07-24T09:15:32Z',
    },
  },
}

/** The header shows the filename when provided, taking precedence over `language`. */
export const WithFilename: Story = {
  args: {
    filename: 'docker-compose.yml',
    language: undefined,
  },
}

/** A left-hand line-number column, non-selectable and sharing the code's line-height. */
export const WithLineNumbers: Story = {
  args: {
    showLineNumbers: true,
    code: {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: { name: 'web', namespace: 'production' },
      spec: {
        replicas: 3,
        selector: { matchLabels: { app: 'web' } },
      },
    },
    language: 'yaml',
    filename: undefined,
  },
}

/** Enough lines to exceed `maxHeight`, so the body scrolls vertically inside the panel. */
export const LongContentScroll: Story = {
  args: {
    filename: 'access.log',
    language: undefined,
    showLineNumbers: true,
    maxHeight: 200,
    code: Array.from(
      { length: 40 },
      (_, i) =>
        `203.0.113.${i % 255} - - [24/Jul/2026:09:${String(i).padStart(2, '0')}:00 +0000] "GET /health HTTP/1.1" 200 12`,
    ).join('\n'),
  },
}

/** A realistic webhook payload — filename header, line numbers, and JSON pretty-printing together. */
export const WebhookPayload: Story = {
  args: {
    filename: 'webhook-payload.json',
    language: undefined,
    showLineNumbers: true,
    code: {
      event: 'invoice.payment_succeeded',
      id: 'evt_3P8x2LmQ9k1c2f3a',
      created: '2026-07-24T09:15:32Z',
      data: {
        invoice: 'in_1P8x2LmQ9k1c2f3a',
        customer: 'cus_9k2LmQ',
        amount_paid: 12999,
        currency: 'usd',
        lines: [
          { description: 'Pro plan — monthly', amount: 9999 },
          { description: 'Extra seats (3)', amount: 3000 },
        ],
      },
    },
  },
}
