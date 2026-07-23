import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NumberInput } from '.'

/**
 * `NumberInput` is a numeric field with increment/decrement steppers, for
 * quota/limit/count values in console forms (replica counts, connection
 * limits, storage size). For free-form numeric entry without stepping,
 * use `TextInput` with `type="number"` instead. Pair with `FormField` for a
 * label, hint, and error message.
 */
const meta = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  argTypes: {
    modelValue: { control: 'number', description: 'Bound value (`v-model`).' },
    min: {
      control: 'number',
      description: 'Smallest value allowed. Disables the decrement stepper once reached.',
    },
    max: {
      control: 'number',
      description: 'Largest value allowed. Disables the increment stepper once reached.',
    },
    step: {
      control: 'number',
      description: 'Amount the value changes per increment/decrement "tick".',
      table: { defaultValue: { summary: '1' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Control height: `sm` 32px, `md` 40px, `lg` 48px.',
      table: { defaultValue: { summary: 'md' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Invalid state: red border + `aria-invalid`.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    placeholder: { control: 'text' },
    formatOptions: {
      control: 'object',
      description:
        'Intl.NumberFormatOptions passed through to the field, e.g. `{ style: "unit", unit: "gigabyte" }`. Also constrains which characters are typeable.',
    },
  },
  args: {
    min: 1,
    max: 10,
    step: 1,
    size: 'md',
    invalid: false,
    disabled: false,
    placeholder: 'Replicas',
    modelValue: 3,
  },
  render: (args) => ({
    components: { NumberInput },
    setup: () => ({ args }),
    template: `<div class="w-56"><NumberInput v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** The three sizes. */
export const Sizes: Story = {
  render: (args) => ({
    components: { NumberInput },
    setup: () => ({ args }),
    template: `
      <div class="flex w-56 flex-col gap-3">
        <NumberInput v-bind="args" size="sm" :model-value="1" />
        <NumberInput v-bind="args" size="md" :model-value="2" />
        <NumberInput v-bind="args" size="lg" :model-value="3" />
      </div>`,
  }),
}

/** At `min`/`max` the corresponding stepper button disables itself automatically. */
export const MinMaxBounds: Story = {
  render: () => ({
    components: { NumberInput },
    template: `
      <div class="flex w-56 flex-col gap-3">
        <div>
          <p class="mb-1.5 text-xs text-fg-muted">At minimum (min: 1)</p>
          <NumberInput :min="1" :max="10" :model-value="1" placeholder="Replicas" />
        </div>
        <div>
          <p class="mb-1.5 text-xs text-fg-muted">At maximum (max: 10)</p>
          <NumberInput :min="1" :max="10" :model-value="10" placeholder="Replicas" />
        </div>
      </div>`,
  }),
}

/** Invalid state. */
export const Invalid: Story = {
  args: { invalid: true, modelValue: 0 },
}

/** Disabled state. */
export const Disabled: Story = {
  args: { disabled: true, modelValue: 3 },
}

/** A realistic console form snippet: setting an instance's connection quota. */
export const InstanceQuotaForm: Story = {
  render: () => ({
    components: { NumberInput },
    template: `
      <div class="w-80 rounded-xl border border-border bg-surface p-5 shadow-sm">
        <h3 class="text-sm font-semibold text-fg">Instance quota</h3>
        <p class="mt-1 text-xs text-fg-muted">Limits applied to db-prod-primary.</p>

        <div class="mt-4 flex flex-col gap-4">
          <div>
            <label for="max-connections" class="mb-1.5 block text-sm font-medium text-fg">
              Max connections
            </label>
            <NumberInput id="max-connections" :min="1" :max="500" :step="10" :model-value="100" />
          </div>

          <div>
            <label for="storage-gb" class="mb-1.5 block text-sm font-medium text-fg">
              Storage (GB)
            </label>
            <NumberInput id="storage-gb" :min="10" :max="2048" :step="10" :model-value="50" />
          </div>
        </div>
      </div>`,
  }),
}
