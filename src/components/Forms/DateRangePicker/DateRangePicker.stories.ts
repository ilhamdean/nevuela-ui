import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { DateRangePicker, type DateRange } from '.'

/**
 * `DateRangePicker` is a start/end date-range field with two linked segmented
 * sub-fields and a two-month calendar popover, built on Reka UI's
 * `DateRangePicker` primitive. The public `v-model` is a plain
 * `{ start: Date | undefined; end: Date | undefined }` — the component
 * bridges to `@internationalized/date` internally.
 */
const meta = {
  title: 'Forms/DateRangePicker',
  component: DateRangePicker,
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
      description: 'Accessible label for the field.',
      table: { defaultValue: { summary: 'Select date range' } },
    },
  },
  args: {
    size: 'md',
    invalid: false,
    disabled: false,
    placeholder: 'Select date range',
  },
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

const emptyRange = (): DateRange => ({ start: undefined, end: undefined })

/** Interactive playground — drive every prop from the Controls panel. */
export const Playground: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup: () => ({ args, value: ref<DateRange>(emptyRange()) }),
    template: `<DateRangePicker v-bind="args" v-model="value" class="w-80" />`,
  }),
}

/** Bounded to a range — no dates before today, none more than a year out. */
export const WithMinMax: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup: () => ({
      args,
      value: ref<DateRange>(emptyRange()),
      min: new Date(),
      max: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    }),
    template: `<DateRangePicker v-bind="args" v-model="value" :min="min" :max="max" class="w-80" />`,
  }),
}

/** Invalid state — pair with a `FormField` error message in real usage. */
export const Invalid: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup: () => ({ args, value: ref<DateRange>(emptyRange()) }),
    template: `<DateRangePicker v-bind="args" v-model="value" invalid class="w-80" />`,
  }),
}

/** Disabled field. */
export const Disabled: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup: () => ({ args, value: ref<DateRange>(emptyRange()) }),
    template: `<DateRangePicker v-bind="args" v-model="value" disabled class="w-80" />`,
  }),
}

/** A realistic use: a billing report's date range, prefilled to the last 30 days. */
export const BillingReportRange: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup: () => {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)
      return { args, value: ref<DateRange>({ start: thirtyDaysAgo, end: now }) }
    },
    template: `
      <div class="w-96">
        <label class="mb-1.5 block text-sm font-semibold text-fg">Report date range</label>
        <DateRangePicker v-bind="args" v-model="value" :max="new Date()" />
      </div>`,
  }),
}
