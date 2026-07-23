import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FormField } from '../FormField'
import { TextInput } from '../TextInput'
import { Select } from '../Select'
import { Switch } from '../Switch'
import { FormSection } from '.'

/**
 * `FormSection` groups a set of related `FormField`s under a heading — the
 * layer above `FormField` for long creation/settings forms ("Network settings",
 * "Security settings", … each as a section within one big "Create Instance"
 * form). Its heading reads a clear step up from `FormField`'s label, and it can
 * optionally be made collapsible for forms with many sections.
 */
const meta = {
  title: 'Forms/FormSection',
  component: FormSection,
  argTypes: {
    title: {
      control: 'text',
      description: 'Section heading.',
    },
    description: {
      control: 'text',
      description: 'Supporting copy shown under the title.',
    },
    collapsible: {
      control: 'boolean',
      description: 'Render as an accordion-style disclosure the user can collapse.',
      table: { defaultValue: { summary: 'false' } },
    },
    defaultOpen: {
      control: 'boolean',
      description:
        "Initial open state when `collapsible` and the consumer isn't controlling `v-model:open` themselves. Ignored otherwise.",
      table: { defaultValue: { summary: 'true' } },
    },
  },
  args: {
    title: 'Network settings',
    description: 'Control how this Instance is reachable.',
    collapsible: false,
    defaultOpen: true,
  },
} satisfies Meta<typeof FormSection>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground — drive every prop from the Controls panel. */
export const Playground: Story = {
  render: (args) => ({
    components: { FormSection, FormField, TextInput },
    setup: () => ({ args }),
    template: `
      <div class="w-[520px]">
        <FormSection v-bind="args">
          <FormField label="VPC network" hint="Instances in the same network can talk over private IPs.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="default-vpc" placeholder="Select a network" />
            </template>
          </FormField>
          <FormField label="Subnet" required>
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="10.116.0.0/20" />
            </template>
          </FormField>
          <FormField label="Firewall tag" hint="Applies existing firewall rules matching this tag.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" placeholder="e.g. web-server" />
            </template>
          </FormField>
        </FormSection>
      </div>`,
  }),
}

/** `collapsible` renders the whole heading row as a clickable disclosure trigger. */
export const Collapsible: Story = {
  args: { collapsible: true },
  render: (args) => ({
    components: { FormSection, FormField, TextInput },
    setup: () => ({ args }),
    template: `
      <div class="w-[520px]">
        <FormSection v-bind="args">
          <FormField label="VPC network" hint="Instances in the same network can talk over private IPs.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="default-vpc" placeholder="Select a network" />
            </template>
          </FormField>
          <FormField label="Subnet" required>
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="10.116.0.0/20" />
            </template>
          </FormField>
          <FormField label="Firewall tag" hint="Applies existing firewall rules matching this tag.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" placeholder="e.g. web-server" />
            </template>
          </FormField>
        </FormSection>
      </div>`,
  }),
}

/** Starts collapsed — useful for sections a user is unlikely to need to edit. */
export const CollapsedByDefault: Story = {
  args: { collapsible: true, defaultOpen: false },
  render: (args) => ({
    components: { FormSection, FormField, TextInput },
    setup: () => ({ args }),
    template: `
      <div class="w-[520px]">
        <FormSection v-bind="args">
          <FormField label="VPC network" hint="Instances in the same network can talk over private IPs.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="default-vpc" placeholder="Select a network" />
            </template>
          </FormField>
          <FormField label="Subnet" required>
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="10.116.0.0/20" />
            </template>
          </FormField>
        </FormSection>
      </div>`,
  }),
}

/** A realistic "Create Instance" form: several `FormSection`s stacked, some collapsible. */
export const CreateInstanceForm: Story = {
  render: () => ({
    components: { FormSection, FormField, TextInput, Select, Switch },
    setup: () => ({
      regionOptions: [
        { label: 'NYC1 — New York', value: 'nyc1' },
        { label: 'SFO3 — San Francisco', value: 'sfo3' },
        { label: 'AMS3 — Amsterdam', value: 'ams3' },
      ],
      sizeOptions: [
        { label: '2 vCPU / 4 GB RAM', value: 's-2vcpu-4gb' },
        { label: '4 vCPU / 8 GB RAM', value: 's-4vcpu-8gb' },
      ],
    }),
    template: `
      <div class="flex w-[560px] flex-col gap-8 rounded-xl border border-border bg-surface p-6">
        <FormSection title="General" description="Name and place the Instance.">
          <FormField label="Instance name" required>
            <template #default="{ bind }">
              <TextInput v-bind="bind" placeholder="web-prod-01" />
            </template>
          </FormField>
          <FormField label="Region" required>
            <template #default="{ bind }">
              <Select v-bind="bind" :options="regionOptions" model-value="nyc1" />
            </template>
          </FormField>
          <FormField label="Machine size" required>
            <template #default="{ bind }">
              <Select v-bind="bind" :options="sizeOptions" model-value="s-2vcpu-4gb" />
            </template>
          </FormField>
        </FormSection>

        <FormSection
          title="Network settings"
          description="Control how this Instance is reachable."
          collapsible
        >
          <FormField label="VPC network" hint="Instances in the same network can talk over private IPs.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="default-vpc" />
            </template>
          </FormField>
          <FormField label="Assign public IPv4">
            <template #default="{ bind }">
              <Switch v-bind="bind" model-value />
            </template>
          </FormField>
        </FormSection>

        <FormSection
          title="Security settings"
          description="SSH access and firewall defaults."
          collapsible
          :default-open="false"
        >
          <FormField label="SSH keys" hint="Only selected keys can access this Instance over SSH.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" placeholder="Select SSH keys" />
            </template>
          </FormField>
          <FormField label="Enable monitoring agent">
            <template #default="{ bind }">
              <Switch v-bind="bind" model-value />
            </template>
          </FormField>
        </FormSection>
      </div>`,
  }),
}
