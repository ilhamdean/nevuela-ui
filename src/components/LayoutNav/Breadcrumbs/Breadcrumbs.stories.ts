import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { House } from '@lucide/vue'
import { Breadcrumbs } from '.'

/**
 * `Breadcrumbs` renders a navigation trail. The final item is marked
 * `aria-current="page"` and is not a link. Items with an `href` render as
 * anchors; the last one always renders as text. When the trail is longer
 * than `maxItems` (default `4`), the middle items collapse into a single
 * "…" entry that expands in place when activated — the first and last
 * items always stay visible.
 */
const meta = {
  title: 'Layout & Nav/Breadcrumbs',
  component: Breadcrumbs,
  argTypes: {
    items: {
      control: 'object',
      description: '`{ label, href?, icon? }[]` — the trail, root first.',
    },
    maxItems: {
      control: { type: 'number', min: 0 },
      description:
        'Collapse the middle of the trail into a "…" item once it exceeds this many entries. `0` disables collapsing.',
      table: { defaultValue: { summary: '4' } },
    },
  },
  args: {
    items: [
      { label: 'Projects', href: '#' },
      { label: 'first-project', href: '#' },
      { label: 'Instances', href: '#' },
      { label: 'web-prod-01' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** With a home icon on the root item. */
export const WithHomeIcon: Story = {
  render: (args) => ({
    components: { Breadcrumbs },
    setup: () => ({ args, House }),
    template: `<Breadcrumbs :items="[{ label: 'Home', href: '#', icon: House }, { label: 'Billing', href: '#' }, { label: 'Invoices' }]" />`,
  }),
}

/**
 * A deep resource path collapses the middle of the trail behind a "…"
 * button (default `maxItems: 4`). Activating it reveals the full trail.
 */
export const LongTrailCollapsed: Story = {
  args: {
    items: [
      { label: 'Projects', href: '#' },
      { label: 'first-project', href: '#' },
      { label: 'Regions', href: '#' },
      { label: 'us-east-1', href: '#' },
      { label: 'Clusters', href: '#' },
      { label: 'prod-cluster', href: '#' },
      { label: 'Nodes', href: '#' },
      { label: 'node-08' },
    ],
  },
}
