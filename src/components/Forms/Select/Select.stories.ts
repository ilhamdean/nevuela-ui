import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Select } from '.'
import type { SelectOptionGroup } from '.'

const regions = [
  { label: 'New York 1 (NYC1)', value: 'nyc1' },
  { label: 'San Francisco 3 (SFO3)', value: 'sfo3' },
  { label: 'Amsterdam 3 (AMS3)', value: 'ams3' },
  { label: 'Singapore 1 (SGP1)', value: 'sgp1' },
  { label: 'Frankfurt 1 (FRA1) — at capacity', value: 'fra1', disabled: true },
]

const groupedRegions: SelectOptionGroup[] = [
  {
    label: 'Americas',
    options: [
      { label: 'New York 1 (NYC1)', value: 'nyc1' },
      { label: 'San Francisco 3 (SFO3)', value: 'sfo3' },
      { label: 'Toronto 1 (TOR1)', value: 'tor1' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { label: 'Amsterdam 3 (AMS3)', value: 'ams3' },
      { label: 'Frankfurt 1 (FRA1) — at capacity', value: 'fra1', disabled: true },
      { label: 'London 1 (LON1)', value: 'lon1' },
    ],
  },
  {
    label: 'Asia Pacific',
    options: [
      { label: 'Singapore 1 (SGP1)', value: 'sgp1' },
      { label: 'Bangalore 1 (BLR1)', value: 'blr1' },
    ],
  },
]

/**
 * `Select` wraps Reka UI's listbox with full keyboard support and typeahead. Pass `options`
 * (a flat list or `{ label, options }` groups), or supply custom `SelectItem`s through the
 * default slot. Set `multiple` for a `string[]` model, `searchable` for a filterable combobox
 * variant (backed by Reka UI's `Combobox` primitives), `clearable` for a reset button, and
 * `loading` for async-populated options.
 */
const meta = {
  title: 'Forms/Select',
  component: Select,
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Selected value (`v-model`) — `string`, or `string[]` when `multiple` is set.',
    },
    options: {
      control: 'object',
      description:
        'Array of `{ label, value, disabled? }`, or an array of `{ label, options }` groups.',
    },
    placeholder: { control: 'text', description: 'Text shown in the trigger when empty.' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Trigger height / density.',
      table: { defaultValue: { summary: 'md' } },
    },
    invalid: { control: 'boolean', description: 'Marks the trigger invalid (validation error).' },
    disabled: { control: 'boolean', description: 'Disables the whole control.' },
    multiple: {
      control: 'boolean',
      description: 'Allow selecting more than one option. Switches the model to `string[]`.',
      table: { defaultValue: { summary: 'false' } },
    },
    searchable: {
      control: 'boolean',
      description:
        'Adds a text filter inside the popover to search options by label (case-insensitive), backed by Reka UI `Combobox`.',
      table: { defaultValue: { summary: 'false' } },
    },
    clearable: {
      control: 'boolean',
      description: 'Shows a "×" button in the trigger to reset the selection when a value is set.',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description:
        'Async-populated options: shows a spinner in the trigger and skeleton rows in the popover.',
      table: { defaultValue: { summary: 'false' } },
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder for the filter input when `searchable` is set.',
      table: { defaultValue: { summary: 'Search…' } },
    },
  },
  args: {
    options: regions,
    placeholder: 'Choose a datacenter region',
    size: 'md',
    invalid: false,
    disabled: false,
    multiple: false,
    searchable: false,
    clearable: false,
    loading: false,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: `<div class="w-80"><Select v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Preselected: Story = { args: { modelValue: 'nyc1' } }

export const Invalid: Story = { args: { invalid: true } }

export const Disabled: Story = { args: { disabled: true, modelValue: 'nyc1' } }

/** `multiple` switches the model to `string[]`; selections render as removable chips, or a
 * "N selected" summary once more than three are picked. */
export const Multiple: Story = {
  args: { multiple: true, modelValue: ['nyc1', 'sfo3'], placeholder: 'Choose regions' },
}

export const MultipleManySelected: Story = {
  name: 'Multiple (summary chip)',
  args: {
    multiple: true,
    modelValue: ['nyc1', 'sfo3', 'ams3', 'sgp1'],
    placeholder: 'Choose regions',
  },
}

/** `searchable` swaps the trigger for a Reka UI `Combobox` with a filter input; typing narrows
 * the option list by label, case-insensitively. */
export const Searchable: Story = {
  args: { searchable: true, placeholder: 'Choose a datacenter region' },
}

export const SearchableMultiple: Story = {
  name: 'Searchable + multiple',
  args: {
    searchable: true,
    multiple: true,
    modelValue: ['nyc1', 'sfo3'],
    placeholder: 'Choose regions',
  },
}

/** `clearable` adds an icon-only "×" button (`aria-label="Clear selection"`) that resets the
 * model without opening the popover. */
export const Clearable: Story = { args: { clearable: true, modelValue: 'nyc1' } }

/** `loading` disables the trigger, shows a spinner in place of the chevron, and renders
 * skeleton rows in the popover for async-populated options. */
export const Loading: Story = { args: { loading: true } }

/** Grouped options render Reka UI's `SelectGroup`/`SelectLabel` (or `ComboboxGroup`/
 * `ComboboxLabel` when `searchable`) sections. */
export const Grouped: Story = { args: { options: groupedRegions, placeholder: 'Choose a region' } }

export const GroupedSearchable: Story = {
  name: 'Grouped + searchable',
  args: { options: groupedRegions, searchable: true, placeholder: 'Choose a region' },
}
