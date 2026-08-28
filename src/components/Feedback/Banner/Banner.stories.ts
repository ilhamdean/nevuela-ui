import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Banner } from '.'

/**
 * `Banner` is a full-width, persistent, page-level system notice — for
 * account-wide or system-wide messages like scheduled maintenance or a
 * trial ending. Unlike `Alert` (a bordered, rounded card that sits inside a
 * page's content flow), `Banner` spans edge-to-edge with no radius and no
 * side borders, typically pinned at the top of a page or app shell. Tone
 * drives the color and icon; `error`/`warning` announce assertively
 * (`role="alert"`), `info`/`success` politely (`role="status"`).
 */
const meta = {
  title: 'Feedback/Banner',
  component: Banner,
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Color and icon of the banner.',
      table: { defaultValue: { summary: 'info' } },
    },
    title: {
      control: 'text',
      description: 'Optional lead-in text — banners are often a single line.',
    },
    description: {
      control: 'text',
      description: 'Body text (or use the default slot).',
    },
    dismissible: {
      control: 'boolean',
      description: 'Show a dismiss button and emit `dismiss` when clicked.',
      table: { defaultValue: { summary: 'false' } },
    },
    icon: {
      control: false,
      description: 'Override the tone icon, or pass `null` to hide it.',
    },
    sticky: {
      control: 'boolean',
      description: 'Pin the banner to the top of its scroll container (`sticky top-0 z-40`).',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    tone: 'warning',
    title: 'Scheduled maintenance',
    description: 'This weekend from 2–4am UTC — expect brief interruptions to the API.',
    dismissible: true,
    sticky: false,
  },
  render: (args) => ({
    components: { Banner },
    setup: () => ({ args }),
    template: `<Banner v-bind="args" />`,
  }),
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** All four tones, stacked full-width. */
export const Tones: Story = {
  render: (args) => ({
    components: { Banner },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col gap-px">
        <Banner tone="info" description="A new export format, XLSX, is now available." />
        <Banner tone="success" description="Your account has been verified." />
        <Banner tone="warning" title="Scheduled maintenance" description="This weekend from 2–4am UTC." />
        <Banner tone="error" title="Billing payment failed" description="Update your payment method to avoid service interruption." />
      </div>`,
  }),
}

/** Dismissible — emits `dismiss` so the parent can hide it. */
export const Dismissible: Story = {
  args: {
    tone: 'info',
    title: undefined,
    description: 'A new dashboard experience is available. Try it from your account settings.',
    dismissible: true,
  },
}

/** An inline text-link-style action alongside the dismiss button. */
export const WithAction: Story = {
  args: {
    tone: 'info',
    title: undefined,
    description: 'A new dashboard layout is rolling out to your account.',
    dismissible: true,
  },
  render: (args) => ({
    components: { Banner },
    setup: () => ({ args }),
    template: `
      <Banner v-bind="args">
        <template #actions>
          <a href="#" class="font-semibold text-fg underline underline-offset-2 hover:no-underline">
            Learn more
          </a>
        </template>
      </Banner>`,
  }),
}

/** Pinned to the top of a scrollable container via `sticky`. */
export const Sticky: Story = {
  render: (args) => ({
    components: { Banner },
    setup: () => ({ args }),
    template: `
      <div class="h-64 w-full overflow-y-auto rounded-md border border-border">
        <Banner tone="error" title="Billing payment failed" description="Update your payment method to avoid service interruption." dismissible sticky />
        <div class="space-y-3 p-4">
          <p v-for="n in 12" :key="n" class="text-sm text-fg-subtle">
            Scroll to see the banner stay pinned to the top — line {{ n }}.
          </p>
        </div>
      </div>`,
  }),
}

/** Realistic example: a trial-ending notice with an inline upgrade action. */
export const TrialEnding: Story = {
  args: {
    tone: 'warning',
    title: undefined,
    description: 'Your trial ends in 3 days.',
    dismissible: true,
  },
  render: (args) => ({
    components: { Banner },
    setup: () => ({ args }),
    template: `
      <Banner v-bind="args">
        <template #actions>
          <a href="#" class="font-semibold text-fg underline underline-offset-2 hover:no-underline">
            Upgrade now
          </a>
        </template>
      </Banner>`,
  }),
}
