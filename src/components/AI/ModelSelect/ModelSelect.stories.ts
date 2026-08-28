import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { ModelSelect } from '.'

const models = [
  {
    value: 'aurora-max',
    label: 'Aurora Max',
    provider: 'Nevuela Cloud',
    description: 'Deepest reasoning. Use for migrations, audits, and root-cause work.',
    contextWindow: 400_000,
    price: '$5 / $25 per Mtok',
    tag: 'New',
  },
  {
    value: 'aurora-balanced',
    label: 'Aurora Balanced',
    provider: 'Nevuela Cloud',
    description: 'The default for day-to-day console assistance.',
    contextWindow: 200_000,
    price: '$3 / $15 per Mtok',
  },
  {
    value: 'aurora-fast',
    label: 'Aurora Fast',
    provider: 'Nevuela Cloud',
    description: 'Sub-second replies for lookups, summaries, and autocomplete.',
    contextWindow: 128_000,
    price: '$0.80 / $4 per Mtok',
  },
  {
    value: 'nebula-oss-70b',
    label: 'Nebula OSS 70B',
    provider: 'Self-hosted',
    description: 'Runs in your VPC. No data leaves the account.',
    contextWindow: 32_000,
    price: 'Your infrastructure',
  },
  {
    value: 'nebula-oss-8b',
    label: 'Nebula OSS 8B',
    provider: 'Self-hosted',
    description: 'Cluster is scaled to zero — start it to select this model.',
    contextWindow: 32_000,
    tag: 'Offline',
    disabled: true,
  },
]

/**
 * `ModelSelect` is a model picker that shows the metadata people actually
 * choose on — context window, price, and a one-line positioning statement —
 * rather than an opaque model id. Built on Reka UI's Select, so keyboard
 * navigation, typeahead, and focus management come from the primitive.
 */
const meta = {
  title: 'AI/ModelSelect',
  component: ModelSelect,
  argTypes: {
    models: {
      control: 'object',
      description:
        'Selectable models. Each has `value` and `label`, plus optional `provider`, `description`, `contextWindow`, `price`, `tag`, and `disabled`.',
    },
    groupByProvider: {
      control: 'boolean',
      description: 'Group the list under provider headings, in first-seen order.',
      table: { defaultValue: { summary: 'true' } },
    },
    showMeta: {
      control: 'boolean',
      description: 'Show context window / price metadata on each row.',
      table: { defaultValue: { summary: 'true' } },
    },
    placeholder: { control: 'text', table: { defaultValue: { summary: 'Select a model' } } },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    invalid: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    id: { control: 'text', description: 'Associates the trigger with a `FormField` label.' },
    modelValue: { control: false, description: 'Selected model id (`v-model`).' },
  },
  args: {
    models,
    groupByProvider: true,
    showMeta: true,
    placeholder: 'Select a model',
    disabled: false,
    invalid: false,
    size: 'md',
  },
  render: (args) => ({
    components: { ModelSelect },
    setup() {
      const selected = ref('aurora-balanced')
      return { args, selected }
    },
    template: `<div class="w-80"><ModelSelect v-bind="args" v-model="selected" /></div>`,
  }),
} satisfies Meta<typeof ModelSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Nothing selected yet — the placeholder carries the prompt. */
export const Empty: Story = {
  render: (args) => ({
    components: { ModelSelect },
    setup: () => ({ args }),
    template: `<div class="w-80"><ModelSelect v-bind="args" /></div>`,
  }),
}

/** A flat list, for a short menu where provider headings are noise. */
export const Ungrouped: Story = {
  args: { groupByProvider: false, models: models.slice(0, 3) },
}

/** Names only — for a compact toolbar where the metadata does not fit. */
export const NamesOnly: Story = {
  args: { showMeta: false, size: 'sm' },
}

/** All three trigger sizes. */
export const Sizes: Story = {
  render: (args) => ({
    components: { ModelSelect },
    setup() {
      const selected = ref('aurora-balanced')
      return { args, selected }
    },
    template: `
      <div class="flex w-80 flex-col gap-3">
        <ModelSelect v-bind="args" v-model="selected" size="sm" />
        <ModelSelect v-bind="args" v-model="selected" size="md" />
        <ModelSelect v-bind="args" v-model="selected" size="lg" />
      </div>`,
  }),
}

/** In the header of an assistant panel, next to the rest of the run controls. */
export const InAPanelHeader: Story = {
  render: (args) => ({
    components: { ModelSelect },
    setup() {
      const selected = ref('aurora-fast')
      return { args, selected }
    },
    template: `
      <div class="w-[36rem] rounded-xl border border-border bg-surface">
        <div class="flex items-center justify-between gap-3 border-b border-border p-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-fg">Platform assistant</p>
            <p class="truncate text-xs text-fg-muted">Scoped to eu-west-1</p>
          </div>
          <div class="w-56 shrink-0">
            <ModelSelect v-bind="args" v-model="selected" size="sm" />
          </div>
        </div>
        <p class="p-4 text-sm text-fg-subtle">Conversation goes here.</p>
      </div>`,
  }),
}
