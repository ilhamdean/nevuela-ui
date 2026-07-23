import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { InputGroup } from '.'
import { TextInput } from '../TextInput'
import { Select } from '../Select'

/**
 * A structural compositing wrapper that visually "joins" 2–3 adjacent form
 * controls into one seamless control — shared border/radius, no double
 * borders at the seams. It is not a form control itself (no `v-model`); it
 * composes other Nevuela controls passed via the default slot, plus optional
 * plain-text addons for static prefixes/suffixes like `https://`.
 */
const meta = {
  title: 'Forms/InputGroup',
  component: InputGroup,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description:
        'Height/padding/font-size of the plain-text addons only (leadingText/trailingText). Slotted controls must be given the same `size` by the consumer for heights to line up.',
      table: { defaultValue: { summary: 'md' } },
    },
    invalid: {
      control: 'boolean',
      description: "Tints the plain-text addons' border red to flag a validation error.",
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Dims the plain-text addons to match a disabled group of controls.',
      table: { defaultValue: { summary: 'false' } },
    },
    leadingText: {
      control: 'text',
      description: 'Static text addon rendered before the slot content, e.g. "https://".',
      table: { defaultValue: { summary: 'undefined' } },
    },
    trailingText: {
      control: 'text',
      description: 'Static text addon rendered after the slot content, e.g. ".example.com".',
      table: { defaultValue: { summary: 'undefined' } },
    },
    class: {
      control: false,
      description: 'Additional classes merged onto the root wrapper.',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
  args: {
    size: 'md',
    invalid: false,
    disabled: false,
  },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { InputGroup, TextInput },
    setup() {
      return { args }
    },
    template: `
      <InputGroup v-bind="args">
        <TextInput :size="args.size" placeholder="Value" />
      </InputGroup>
    `,
  }),
}

/** A static prefix and suffix (`https://` … `.example.com`) joined around a single TextInput. */
export const TextAddons: Story = {
  args: {
    leadingText: 'https://',
    trailingText: '.example.com',
  },
  render: (args) => ({
    components: { InputGroup, TextInput },
    setup() {
      return { args }
    },
    template: `
      <InputGroup v-bind="args">
        <TextInput :size="args.size" placeholder="subdomain" />
      </InputGroup>
    `,
  }),
}

/** A protocol Select joined to a host TextInput — two full controls side by side. */
export const SelectAndInput: Story = {
  render: (args) => ({
    components: { InputGroup, TextInput, Select },
    setup() {
      const protocolOptions = [
        { label: 'https://', value: 'https' },
        { label: 'http://', value: 'http' },
      ]
      return { args, protocolOptions }
    },
    template: `
      <InputGroup v-bind="args">
        <Select :options="protocolOptions" model-value="https" :size="args.size" class="w-28 shrink-0" />
        <TextInput :size="args.size" placeholder="host.example.com" />
      </InputGroup>
    `,
  }),
}

/** Invalid state tints the text addon's border to flag a validation error alongside the invalid slotted control. */
export const Invalid: Story = {
  args: {
    invalid: true,
    leadingText: 'https://',
  },
  render: (args) => ({
    components: { InputGroup, TextInput },
    setup() {
      return { args }
    },
    template: `
      <InputGroup v-bind="args">
        <TextInput :size="args.size" :invalid="args.invalid" placeholder="subdomain" />
      </InputGroup>
    `,
  }),
}

/** Realistic usage: a labeled webhook URL field with a fixed https:// prefix. */
export const WebhookUrl: Story = {
  name: 'Webhook URL',
  args: {
    leadingText: 'https://',
  },
  render: (args) => ({
    components: { InputGroup, TextInput },
    setup() {
      return { args }
    },
    template: `
      <div class="flex w-96 flex-col gap-1.5">
        <label for="webhook-url" class="text-sm font-medium text-fg">Webhook URL</label>
        <InputGroup v-bind="args">
          <TextInput id="webhook-url" :size="args.size" placeholder="hooks.example.com/deploy" />
        </InputGroup>
      </div>
    `,
  }),
}
