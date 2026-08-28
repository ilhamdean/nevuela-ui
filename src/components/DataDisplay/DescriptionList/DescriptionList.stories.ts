import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { StatusBadge } from '../StatusBadge'
import { DescriptionList, type DescriptionItem } from '.'

const items: DescriptionItem[] = [
  { term: 'Order ID', value: 'ord_0abcd1234ef567890', copyable: true },
  { term: 'Channel', value: 'Online store' },
  { term: 'Status', value: 'active' },
  { term: 'Placed at', value: '2026-06-02 14:31 UTC' },
  { term: 'Customer', value: 'orders@haldenco.com' },
  { term: 'Payment reference', value: 'pay_0f9a8b7c6d5e4f321', copyable: true },
]

/**
 * `DescriptionList` renders a semantic `<dl>` of term/value pairs in a
 * responsive grid — the standard layout for a record detail page (Order
 * ID, Channel, Status, Customer, …). Values can render as plain text, as a
 * copy-to-clipboard `CopyableField` (`copyable: true`), or as anything you
 * want via a per-item slot named `item-<slug>` (the term lowercased with
 * spaces turned into hyphens — e.g. a "Status" item's slot is `#item-status`).
 * A `span: 2` item takes the full row width, useful for long descriptions.
 */
const meta = {
  title: 'Data Display/DescriptionList',
  component: DescriptionList,
  argTypes: {
    items: {
      control: 'object',
      description:
        'Array of `{ term, value?, copyable?, span? }`. `copyable` renders the value via `CopyableField`; `span: 2` lets the item take the full row width; a term is slugified to key its `item-<slug>` slot.',
    },
    columns: {
      control: 'select',
      options: [1, 2, 3],
      description: 'Grid column count at the `md:` breakpoint. Always 1 column below that.',
      table: { defaultValue: { summary: '2' } },
    },
    loading: {
      control: 'boolean',
      description: 'Renders Skeleton placeholders in place of each term/value while data loads.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    items,
    columns: 2,
    loading: false,
  },
  render: (args) => ({
    components: { DescriptionList },
    setup: () => ({ args }),
    template: `<div class="w-[640px]"><DescriptionList v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof DescriptionList>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** While the detail data is being fetched — Skeleton stands in for each value. */
export const Loading: Story = { args: { loading: true } }

/** Three columns for a very wide detail panel. */
export const ThreeColumns: Story = {
  args: { columns: 3 },
  render: (args) => ({
    components: { DescriptionList },
    setup: () => ({ args }),
    template: `<div class="w-[900px]"><DescriptionList v-bind="args" /></div>`,
  }),
}

/**
 * A realistic "Order details" panel: a copyable order id and payment
 * reference, a real `StatusBadge` slotted in for the status via
 * `#item-status`, and a long note spanning the full row width.
 */
const orderItems: DescriptionItem[] = [
  { term: 'Order ID', value: 'ord_0abcd1234ef567890', copyable: true },
  { term: 'Channel', value: 'Online store' },
  { term: 'Status', value: 'active' },
  { term: 'Placed at', value: '2026-06-02 14:31 UTC' },
  { term: 'Payment reference', value: 'pay_0f9a8b7c6d5e4f321', copyable: true },
  { term: 'Shipping method', value: 'Express · 2 days' },
  {
    term: 'Note',
    value:
      'Customer asked for the invoice to be addressed to their accounts department, and for both parcels to ship together rather than as they are picked.',
    span: 2,
  },
]

export const OrderDetails: Story = {
  args: { items: orderItems, columns: 2 },
  render: (args) => ({
    components: { DescriptionList, StatusBadge },
    setup: () => ({ args }),
    template: `
      <div class="w-[720px] rounded-xl border border-border bg-surface p-5">
        <DescriptionList v-bind="args">
          <template #item-status>
            <StatusBadge status="active" label="Active" />
          </template>
        </DescriptionList>
      </div>`,
  }),
}
