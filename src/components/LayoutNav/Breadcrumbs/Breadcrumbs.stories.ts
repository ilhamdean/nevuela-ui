import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { House } from '@lucide/vue'
import { Breadcrumbs } from '.'

/**
 * `Breadcrumbs` renders a navigation trail. The final item is marked
 * `aria-current="page"` and is not a link. Items with an `href` render as
 * anchors; the last one always renders as text.
 */
const meta = {
  title: 'Layout & Nav/Breadcrumbs',
  component: Breadcrumbs,
  argTypes: {
    items: {
      control: 'object',
      description: '`{ label, href?, icon? }[]` — the trail, root first.',
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
