import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Checkbox } from '.'

/**
 * `Checkbox` wraps Reka UI's accessible checkbox primitive. Supports an
 * `indeterminate` state (bind `v-model` to `'indeterminate'`). The label is
 * associated via `for`/`id`, so clicking it toggles the box.
 */
const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: "Checked state (`v-model`). Also accepts the string `'indeterminate'`.",
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: { control: 'boolean' },
    label: { control: 'text', description: 'Inline label (or use the default slot).' },
  },
  args: {
    size: 'md',
    disabled: false,
    label: 'Enable automated backups',
    modelValue: false,
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Checked: Story = { args: { modelValue: true } }

export const Disabled: Story = { args: { disabled: true, modelValue: true } }

/** Indeterminate → checked → unchecked, driven interactively. */
export const Indeterminate: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const state = ref<boolean | 'indeterminate'>('indeterminate')
      return { args, state }
    },
    template: `<Checkbox v-bind="args" v-model="state" label="Select all Instances" />`,
  }),
}

/** A vertical group. */
export const Group: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const ipv4 = ref(true)
      const ipv6 = ref(false)
      const monitoring = ref(true)
      return { args, ipv4, ipv6, monitoring }
    },
    template: `
      <fieldset class="flex flex-col gap-3">
        <legend class="mb-1 text-sm font-semibold text-fg">Networking</legend>
        <Checkbox v-model="ipv4" label="Public IPv4 address" />
        <Checkbox v-model="ipv6" label="Public IPv6 address" />
        <Checkbox v-model="monitoring" label="Improved metrics & monitoring" />
      </fieldset>`,
  }),
  args: { label: '' },
}
