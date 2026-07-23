import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Box, Cpu, Sparkles } from '@lucide/vue'
import { Badge } from '.'

/**
 * `Badge` is a small generic label/tag chip for arbitrary categorical or
 * informational text — plan tiers, regions, resource types, feature flags.
 * Unlike `StatusBadge`, it carries no lifecycle/state meaning: color here is
 * purely decorative, there is never a status dot, and the status hues are
 * just borrowed as extra color choices. Optionally shows a leading icon or a
 * trailing remove ("x") — useful for filter chips in a toolbar. The
 * component is stateless: `removable` only emits `remove`, the parent owns
 * removing the item from its own list.
 */
const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'brand', 'green', 'amber', 'red', 'blue'],
      description:
        'Decorative color only — purely categorical, no lifecycle/state meaning. The `green`/`amber`/`red`/`blue` options reuse the status hues as plain colors.',
      table: { defaultValue: { summary: 'neutral' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { defaultValue: { summary: 'md' } },
    },
    icon: {
      control: false,
      description: 'Optional leading icon component.',
    },
    removable: {
      control: 'boolean',
      description: 'Show a trailing remove ("x") button; emits `remove` on click.',
      table: { defaultValue: { summary: 'false' } },
    },
    label: { control: 'text', description: 'Text label (or use the default slot).' },
  },
  args: {
    color: 'neutral',
    size: 'md',
    removable: false,
    label: 'Beta',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** All six colors side by side. */
export const Colors: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Badge v-bind="args" color="neutral" label="Neutral" />
        <Badge v-bind="args" color="brand" label="Brand" />
        <Badge v-bind="args" color="green" label="Green" />
        <Badge v-bind="args" color="amber" label="Amber" />
        <Badge v-bind="args" color="red" label="Red" />
        <Badge v-bind="args" color="blue" label="Blue" />
      </div>`,
  }),
  args: { label: '' },
}

/** `sm` and `md` side by side. */
export const Sizes: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Badge v-bind="args" size="sm" label="Small" />
        <Badge v-bind="args" size="md" label="Medium" />
      </div>`,
  }),
  args: { label: '' },
}

/** With a leading icon. */
export const WithIcon: Story = {
  render: (args) => ({
    components: { Badge, Cpu, Box, Sparkles },
    setup: () => ({ args, Cpu, Box, Sparkles }),
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Badge v-bind="args" color="neutral" :icon="Cpu" label="gpu" />
        <Badge v-bind="args" color="brand" :icon="Sparkles" label="Pro" />
        <Badge v-bind="args" color="blue" :icon="Box" label="us-east-1" />
      </div>`,
  }),
  args: { label: '' },
}

/**
 * Interactive: clicking the "x" emits `remove`. The badge itself doesn't
 * disappear on its own — this story owns a local list and removes the item
 * from it, which is the intended usage pattern for filter-chip toolbars.
 */
export const Removable: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => {
      const filters = ref(['Production', 'us-west-2', 'Tagged: team-infra'])
      function remove(filter: string) {
        filters.value = filters.value.filter((f) => f !== filter)
      }
      return { args, filters, remove }
    },
    template: `
      <div class="flex min-h-8 flex-wrap items-center gap-2">
        <Badge
          v-for="filter in filters"
          :key="filter"
          v-bind="args"
          :label="filter"
          removable
          @remove="remove(filter)"
        />
        <span v-if="!filters.length" class="text-sm text-fg-muted">No filters applied</span>
      </div>`,
  }),
  args: { color: 'brand', label: '' },
}

/** In context: category/plan-tier badges on a resource card. */
export const ResourceTags: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex w-80 flex-col gap-2 rounded-xl border border-border bg-surface p-4">
        <span class="text-sm font-medium text-fg">web-prod-01</span>
        <div class="flex flex-wrap items-center gap-1.5">
          <Badge color="brand" label="Pro" />
          <Badge color="blue" label="us-east-1" />
          <Badge color="neutral" label="GPU" />
          <Badge color="amber" label="Beta" />
        </div>
      </div>`,
  }),
}
