import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { SearchInput, type SearchFilter } from '.'

/**
 * `SearchInput` is a search field with a leading icon, removable filter chips,
 * and a clear affordance. `v-model` binds the query; `remove-filter` and `clear`
 * events let the parent manage the chips.
 */
const meta = {
  title: 'Forms/SearchInput',
  component: SearchInput,
  argTypes: {
    modelValue: { control: 'text', description: 'Search query (`v-model`).' },
    filters: { control: 'object', description: 'Active filter chips: `{ id, label }[]`.' },
    placeholder: { control: 'text' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: { control: 'boolean' },
    loading: {
      control: 'boolean',
      description: 'Shows a spinner in place of the search icon, for async search-as-you-type.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    placeholder: 'Search by resource name or public IP…',
    size: 'md',
    disabled: false,
    loading: false,
    filters: [],
  },
  render: (args) => ({
    components: { SearchInput },
    setup: () => ({ args }),
    template: `<div class="w-[560px]"><SearchInput v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Async search-as-you-type — spinner replaces the search icon while results load. */
export const Loading: Story = {
  args: { loading: true },
  render: (args) => ({
    components: { SearchInput },
    setup: () => ({ args }),
    template: `<div class="w-[560px]"><SearchInput v-bind="args" model-value="web-prod" /></div>`,
  }),
}

/** With active filter chips that the parent can remove. */
export const WithFilters: Story = {
  render: (args) => ({
    components: { SearchInput },
    setup() {
      const query = ref('')
      const filters = ref<SearchFilter[]>([
        { id: 'region:nyc1', label: 'Region: NYC1' },
        { id: 'status:active', label: 'Status: Active' },
        { id: 'tag:web', label: 'Tag: web' },
      ])
      const remove = (id: string) => (filters.value = filters.value.filter((f) => f.id !== id))
      const clear = () => {
        query.value = ''
        filters.value = []
      }
      return { args, query, filters, remove, clear }
    },
    template: `
      <div class="w-[560px]">
        <SearchInput
          v-bind="args"
          v-model="query"
          :filters="filters"
          @remove-filter="remove"
          @clear="clear"
        />
      </div>`,
  }),
}
