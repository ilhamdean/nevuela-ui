import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { DatePicker } from '.'

/**
 * `DatePicker` is a single-date field with typed segments (month/day/year) and
 * a calendar popover, built on Reka UI's `DatePicker` primitive. The public
 * `v-model` is a plain `Date | undefined` — the component bridges to
 * `@internationalized/date` internally so consumers never need that package.
 */
const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  argTypes: {
    min: {
      control: 'date',
      description: 'Earliest selectable date.',
    },
    max: {
      control: 'date',
      description: 'Latest selectable date.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Control height: `sm` 32px, `md` 40px, `lg` 48px.',
      table: { defaultValue: { summary: 'md' } },
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the field invalid: red border + `aria-invalid`. Pair with a FormField error.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the field entirely.',
      table: { defaultValue: { summary: 'false' } },
    },
    placeholder: {
      control: 'text',
      description: 'Accessible label for the field when no date is selected.',
      table: { defaultValue: { summary: 'Pick a date' } },
    },
  },
  args: {
    size: 'md',
    invalid: false,
    disabled: false,
    placeholder: 'Pick a date',
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground — drive every prop from the Controls panel. */
export const Playground: Story = {
  render: (args) => ({
    components: { DatePicker },
    setup: () => ({ args, value: ref<Date>() }),
    template: `<DatePicker v-bind="args" v-model="value" class="w-64" />`,
  }),
}

/** Bounded to a range — here, no dates before today (a future-only schedule date). */
export const WithMinMax: Story = {
  render: (args) => ({
    components: { DatePicker },
    setup: () => ({ args, value: ref<Date>(), min: new Date() }),
    template: `<DatePicker v-bind="args" v-model="value" :min="min" class="w-64" />`,
  }),
}

/** Invalid state — pair with a `FormField` error message in real usage. */
export const Invalid: Story = {
  render: (args) => ({
    components: { DatePicker },
    setup: () => ({ args, value: ref<Date>() }),
    template: `<DatePicker v-bind="args" v-model="value" invalid class="w-64" />`,
  }),
}

/** Disabled field. */
export const Disabled: Story = {
  render: (args) => ({
    components: { DatePicker },
    setup: () => ({ args, value: ref<Date>() }),
    template: `<DatePicker v-bind="args" v-model="value" disabled class="w-64" />`,
  }),
}

/** A realistic use: a certificate's expiry date in a creation form. */
export const CertificateExpiry: Story = {
  render: (args) => ({
    components: { DatePicker },
    setup: () => ({ args, value: ref<Date>(new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)) }),
    template: `
      <div class="w-72">
        <label class="mb-1.5 block text-sm font-semibold text-fg">Certificate expiry date</label>
        <DatePicker v-bind="args" v-model="value" :min="new Date()" />
      </div>`,
  }),
}
