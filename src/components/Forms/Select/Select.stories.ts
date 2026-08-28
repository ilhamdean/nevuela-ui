import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Select } from '.'
import type { SelectOptionGroup } from '.'

const members = [
  { label: 'Alia Novak', value: 'alia' },
  { label: 'Ben Okafor', value: 'ben' },
  { label: 'Priya Shah', value: 'priya' },
  { label: 'Marcus Webb', value: 'marcus' },
  { label: 'Tomas Iversen — on leave', value: 'tomas', disabled: true },
]

const groupedMembers: SelectOptionGroup[] = [
  {
    label: 'Design',
    options: [
      { label: 'Alia Novak', value: 'alia' },
      { label: 'Ben Okafor', value: 'ben' },
      { label: 'Rosa Lindqvist', value: 'rosa' },
    ],
  },
  {
    label: 'Engineering',
    options: [
      { label: 'Priya Shah', value: 'priya' },
      { label: 'Tomas Iversen — on leave', value: 'tomas', disabled: true },
      { label: 'Dae-jung Park', value: 'dae' },
    ],
  },
  {
    label: 'Operations',
    options: [
      { label: 'Marcus Webb', value: 'marcus' },
      { label: 'Hana Duarte', value: 'hana' },
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
    options: members,
    placeholder: 'Choose an assignee',
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

export const Preselected: Story = { args: { modelValue: 'alia' } }

export const Invalid: Story = { args: { invalid: true } }

export const Disabled: Story = { args: { disabled: true, modelValue: 'alia' } }

/** `multiple` switches the model to `string[]`; selections render as removable chips, or a
 * "N selected" summary once more than three are picked. */
export const Multiple: Story = {
  args: { multiple: true, modelValue: ['alia', 'ben'], placeholder: 'Choose assignees' },
}

export const MultipleManySelected: Story = {
  name: 'Multiple (summary chip)',
  args: {
    multiple: true,
    modelValue: ['alia', 'ben', 'priya', 'marcus'],
    placeholder: 'Choose assignees',
  },
}

/** `searchable` swaps the trigger for a Reka UI `Combobox` with a filter input; typing narrows
 * the option list by label, case-insensitively. */
export const Searchable: Story = {
  args: { searchable: true, placeholder: 'Choose an assignee' },
}

export const SearchableMultiple: Story = {
  name: 'Searchable + multiple',
  args: {
    searchable: true,
    multiple: true,
    modelValue: ['alia', 'ben'],
    placeholder: 'Choose assignees',
  },
}

/** `clearable` adds an icon-only "×" button (`aria-label="Clear selection"`) that resets the
 * model without opening the popover. */
export const Clearable: Story = { args: { clearable: true, modelValue: 'alia' } }

/** `loading` disables the trigger, shows a spinner in place of the chevron, and renders
 * skeleton rows in the popover for async-populated options. */
export const Loading: Story = { args: { loading: true } }

/** Grouped options render Reka UI's `SelectGroup`/`SelectLabel` (or `ComboboxGroup`/
 * `ComboboxLabel` when `searchable`) sections. */
export const Grouped: Story = { args: { options: groupedMembers, placeholder: 'Choose a member' } }

export const GroupedSearchable: Story = {
  name: 'Grouped + searchable',
  args: { options: groupedMembers, searchable: true, placeholder: 'Choose a member' },
}
