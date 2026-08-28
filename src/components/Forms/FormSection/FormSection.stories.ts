import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FormField } from '../FormField'
import { TextInput } from '../TextInput'
import { Select } from '../Select'
import { Switch } from '../Switch'
import { FormSection } from '.'

/**
 * `FormSection` groups a set of related `FormField`s under a heading — the
 * layer above `FormField` for long creation/settings forms ("Access settings",
 * "Notifications", … each as a section within one big "Create workspace"
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
    title: 'Access settings',
    description: 'Control who can join this workspace.',
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
          <FormField label="Default role" hint="Applied to everyone who joins without an explicit invite.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="Member" placeholder="Select a role" />
            </template>
          </FormField>
          <FormField label="Allowed email domain" required>
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="haldenco.com" />
            </template>
          </FormField>
          <FormField label="Invite link label" hint="Shown to people who open the shared invite link.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" placeholder="e.g. Design team" />
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
          <FormField label="Default role" hint="Applied to everyone who joins without an explicit invite.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="Member" placeholder="Select a role" />
            </template>
          </FormField>
          <FormField label="Allowed email domain" required>
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="haldenco.com" />
            </template>
          </FormField>
          <FormField label="Invite link label" hint="Shown to people who open the shared invite link.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" placeholder="e.g. Design team" />
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
          <FormField label="Default role" hint="Applied to everyone who joins without an explicit invite.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="Member" placeholder="Select a role" />
            </template>
          </FormField>
          <FormField label="Allowed email domain" required>
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="haldenco.com" />
            </template>
          </FormField>
        </FormSection>
      </div>`,
  }),
}

/** A realistic "Create workspace" form: several `FormSection`s stacked, some collapsible. */
export const CreateWorkspaceForm: Story = {
  render: () => ({
    components: { FormSection, FormField, TextInput, Select, Switch },
    setup: () => ({
      planOptions: [
        { label: 'Starter — up to 10 members', value: 'starter' },
        { label: 'Team — up to 50 members', value: 'team' },
        { label: 'Business — unlimited members', value: 'business' },
      ],
      cycleOptions: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly (2 months free)', value: 'yearly' },
      ],
    }),
    template: `
      <div class="flex w-[560px] flex-col gap-8 rounded-xl border border-border bg-surface p-6">
        <FormSection title="General" description="Name the workspace and pick a plan.">
          <FormField label="Workspace name" required>
            <template #default="{ bind }">
              <TextInput v-bind="bind" placeholder="Halden & Co." />
            </template>
          </FormField>
          <FormField label="Plan" required>
            <template #default="{ bind }">
              <Select v-bind="bind" :options="planOptions" model-value="team" />
            </template>
          </FormField>
          <FormField label="Billing cycle" required>
            <template #default="{ bind }">
              <Select v-bind="bind" :options="cycleOptions" model-value="yearly" />
            </template>
          </FormField>
        </FormSection>

        <FormSection
          title="Access settings"
          description="Control who can join this workspace."
          collapsible
        >
          <FormField label="Allowed email domain" hint="Anyone with a matching address can join without an invite.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" model-value="haldenco.com" />
            </template>
          </FormField>
          <FormField label="Allow shared invite links">
            <template #default="{ bind }">
              <Switch v-bind="bind" model-value />
            </template>
          </FormField>
        </FormSection>

        <FormSection
          title="Notifications"
          description="What this workspace emails its members."
          collapsible
          :default-open="false"
        >
          <FormField label="Digest recipients" hint="Only these members receive the weekly summary.">
            <template #default="{ bind }">
              <TextInput v-bind="bind" placeholder="Select members" />
            </template>
          </FormField>
          <FormField label="Send weekly activity digest">
            <template #default="{ bind }">
              <Switch v-bind="bind" model-value />
            </template>
          </FormField>
        </FormSection>
      </div>`,
  }),
}
