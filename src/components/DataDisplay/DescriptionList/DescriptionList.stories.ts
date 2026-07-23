import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { StatusBadge } from '../StatusBadge'
import { DescriptionList, type DescriptionItem } from '.'

const items: DescriptionItem[] = [
  { term: 'Resource ID', value: 'i-0abcd1234ef567890', copyable: true },
  { term: 'Region', value: 'us-east-1' },
  { term: 'Status', value: 'active' },
  { term: 'Created at', value: '2026-06-02 14:31 UTC' },
  { term: 'Owner', value: 'platform-team@example.com' },
  { term: 'VPC', value: 'vpc-0f9a8b7c6d5e4f321', copyable: true },
]

/**
 * `DescriptionList` renders a semantic `<dl>` of term/value pairs in a
 * responsive grid — the standard layout for a resource detail page (Resource
 * ID, Region, Status, Owner, …). Values can render as plain text, as a
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
 * A realistic "Instance details" panel: a copyable resource id and VPC, a
 * real `StatusBadge` slotted in for the status via `#item-status`, and a
 * long description spanning the full row width.
 */
const instanceItems: DescriptionItem[] = [
  { term: 'Resource ID', value: 'i-0abcd1234ef567890', copyable: true },
  { term: 'Region', value: 'us-east-1' },
  { term: 'Status', value: 'active' },
  { term: 'Created at', value: '2026-06-02 14:31 UTC' },
  { term: 'VPC', value: 'vpc-0f9a8b7c6d5e4f321', copyable: true },
  { term: 'Instance type', value: 'm6i.large' },
  {
    term: 'Description',
    value:
      'Primary application server for the checkout service. Provisioned via the platform-infra Terraform module; do not modify manually.',
    span: 2,
  },
]

export const InstanceDetails: Story = {
  args: { items: instanceItems, columns: 2 },
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
