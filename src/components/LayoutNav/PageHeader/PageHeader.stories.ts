import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Plus } from '@lucide/vue'
import { Button } from '../../Forms/Button'
import { StatusBadge } from '../../DataDisplay/StatusBadge'
import { Breadcrumbs } from '../Breadcrumbs'
import { PageHeader } from '.'

/**
 * `PageHeader` is the standard top-of-page block: an optional breadcrumb row,
 * a title with optional leading element and status badge, a description, and
 * right-aligned actions. Everything but the title is a slot.
 */
const meta = {
  title: 'Layout & Nav/PageHeader',
  component: PageHeader,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'ORD-4821',
    description: 'Halden & Co. · 3 line items · $482.00',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { PageHeader, Button },
    setup: () => ({ args }),
    template: `
      <div class="w-[820px]">
        <PageHeader v-bind="args">
          <template #actions>
            <Button variant="secondary">Archive</Button>
            <Button variant="primary">Fulfil order</Button>
          </template>
        </PageHeader>
      </div>`,
  }),
}

/** The full composition: breadcrumbs, a status badge, and actions. */
export const FullRecordHeader: Story = {
  render: (args) => ({
    components: { PageHeader, Button, StatusBadge, Breadcrumbs, Plus },
    setup: () => ({ args }),
    template: `
      <div class="w-[820px]">
        <PageHeader v-bind="args">
          <template #breadcrumbs>
            <Breadcrumbs :items="[{ label: 'Workspaces', href: '#' }, { label: 'Halden & Co.', href: '#' }, { label: 'Orders' }]" />
          </template>
          <template #badge><StatusBadge status="active" label="Active" /></template>
          <template #actions>
            <Button variant="secondary">More</Button>
            <Button variant="primary"><template #leading><Plus /></template>New order</Button>
          </template>
        </PageHeader>
      </div>`,
  }),
}
