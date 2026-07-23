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
    title: 'web-prod-01',
    description: '4 GB / 2 vCPUs / 120 GB Disk · NYC1',
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
            <Button variant="secondary">Power off</Button>
            <Button variant="primary">Access console</Button>
          </template>
        </PageHeader>
      </div>`,
  }),
}

/** The full composition: breadcrumbs, a status badge, and actions. */
export const FullResourceHeader: Story = {
  render: (args) => ({
    components: { PageHeader, Button, StatusBadge, Breadcrumbs, Plus },
    setup: () => ({ args }),
    template: `
      <div class="w-[820px]">
        <PageHeader v-bind="args">
          <template #breadcrumbs>
            <Breadcrumbs :items="[{ label: 'Projects', href: '#' }, { label: 'first-project', href: '#' }, { label: 'Instances' }]" />
          </template>
          <template #badge><StatusBadge status="active" label="Active" /></template>
          <template #actions>
            <Button variant="secondary">More</Button>
            <Button variant="primary"><template #leading><Plus /></template>Add resource</Button>
          </template>
        </PageHeader>
      </div>`,
  }),
}
