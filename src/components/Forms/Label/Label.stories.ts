import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Label } from '.'

/**
 * `Label` wraps Reka UI's accessible label primitive. Pair with `for`/`id` so
 * clicking the label focuses (or, for checkboxes, toggles) its control.
 */
const meta = {
  title: 'Forms/Label',
  component: Label,
  argTypes: {
    for: { control: 'text', description: 'Associates the label with a control by id.' },
    default: { control: 'text', description: 'Label text.' },
  },
  args: {
    for: 'workspace-name',
  },
  render: (args) => ({
    components: { Label },
    setup: () => ({ args }),
    template: `<Label v-bind="args">Workspace name</Label>`,
  }),
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Associated with a real control — clicking the label focuses the input. */
export const WithControl: Story = {
  render: () => ({
    components: { Label },
    template: `
      <div class="flex flex-col gap-1.5">
        <Label for="workspace-name">Workspace name</Label>
        <input
          id="workspace-name"
          class="h-10 rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
          placeholder="Halden &amp; Co."
        />
      </div>`,
  }),
}
