import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ArrowRight, Plus, RefreshCw, Trash2 } from '@lucide/vue'
import { Button } from '.'

/**
 * `Button` is the primary action control. It renders a native `<button>` by
 * default but is polymorphic via `as` / `as-child` (e.g. render an `<a>` styled
 * as a button for navigation). Icon buttons require an `aria-label`.
 */
const meta = {
  title: 'Forms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'ghost'],
      description:
        'Visual intent. `primary` for the main action, `secondary` (outlined) for adjacent actions, `destructive` for irreversible actions, `ghost` for low-emphasis / toolbar actions.',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Control height: `sm` 32px, `md` 40px, `lg` 48px.',
      table: { defaultValue: { summary: 'md' } },
    },
    iconOnly: {
      control: 'boolean',
      description:
        'Render a square, padding-free button for a single icon. **Requires `aria-label`.**',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Show a spinner, set `aria-busy`, and block interaction.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button.',
      table: { defaultValue: { summary: 'false' } },
    },
    as: {
      control: 'text',
      description: 'Element/component to render as (polymorphic). Defaults to `button`.',
      table: { defaultValue: { summary: 'button' } },
    },
    default: {
      control: 'text',
      description: 'Button label (default slot).',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    iconOnly: false,
    loading: false,
    disabled: false,
    default: 'Create Instance',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground — drive every prop from the Controls panel. */
export const Playground: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">{{ args.default }}</Button>`,
  }),
}

/** The four intents side by side. */
export const Variants: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-bind="args" variant="primary">Primary</Button>
        <Button v-bind="args" variant="secondary">Secondary</Button>
        <Button v-bind="args" variant="destructive">Destroy</Button>
        <Button v-bind="args" variant="ghost">Ghost</Button>
      </div>`,
  }),
  args: { default: '' },
}

/** The three sizes. */
export const Sizes: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <Button v-bind="args" size="sm">Small</Button>
        <Button v-bind="args" size="md">Medium</Button>
        <Button v-bind="args" size="lg">Large</Button>
      </div>`,
  }),
  args: { default: '' },
}

/** Leading and trailing icons via the `#leading` / `#trailing` slots. */
export const WithIcons: Story = {
  render: (args) => ({
    components: { Button, Plus, ArrowRight },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-bind="args" variant="primary">
          <template #leading><Plus /></template>
          Create Instance
        </Button>
        <Button v-bind="args" variant="secondary">
          Continue
          <template #trailing><ArrowRight /></template>
        </Button>
      </div>`,
  }),
  args: { default: '' },
}

/** Loading state keeps the label and swaps in a spinner (or spinner-only when `iconOnly`). */
export const Loading: Story = {
  render: (args) => ({
    components: { Button, RefreshCw },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-bind="args" loading>Saving…</Button>
        <Button v-bind="args" variant="secondary" loading>Refreshing</Button>
        <Button v-bind="args" icon-only loading aria-label="Refreshing" />
      </div>`,
  }),
  args: { default: '' },
}

/** Icon-only buttons — always pass an `aria-label`. */
export const IconOnly: Story = {
  render: (args) => ({
    components: { Button, Plus, RefreshCw, Trash2 },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <Button v-bind="args" icon-only aria-label="Create"><Plus /></Button>
        <Button v-bind="args" icon-only variant="secondary" aria-label="Refresh"><RefreshCw /></Button>
        <Button v-bind="args" icon-only variant="ghost" aria-label="Delete"><Trash2 /></Button>
      </div>`,
  }),
  args: { default: '' },
}

/** A realistic resource-list toolbar. */
export const ResourceToolbar: Story = {
  render: (args) => ({
    components: { Button, Plus, RefreshCw },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-2 rounded-xl border border-border bg-surface p-3">
        <Button variant="primary" size="md">
          <template #leading><Plus /></template>
          Create Instance
        </Button>
        <Button variant="secondary" size="md">Actions</Button>
        <div class="flex-1"></div>
        <Button variant="ghost" size="md" icon-only aria-label="Refresh"><RefreshCw /></Button>
        <Button variant="destructive" size="md">Delete</Button>
      </div>`,
  }),
  args: { default: '' },
}
