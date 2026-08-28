import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ChatMessage } from '.'

/**
 * `ChatMessage` is one turn in a conversation. User turns are right-aligned in
 * a tinted bubble, assistant turns run flat and full-width (long answers read
 * better without a bubble around them), and system turns are a centered
 * out-of-band note. Hover actions stay in the layout rather than being
 * `v-if`'d away, so focusing one with the keyboard reveals it.
 */
const meta = {
  title: 'AI/ChatMessage',
  component: ChatMessage,
  argTypes: {
    role: {
      control: 'inline-radio',
      options: ['user', 'assistant', 'system'],
      description: 'Who produced the turn. Drives alignment, bubble style, and the avatar.',
      table: { defaultValue: { summary: 'assistant' } },
    },
    content: {
      control: 'text',
      description: 'Message text. Use the default slot instead for rich content.',
    },
    author: {
      control: 'text',
      description: 'Display name above the bubble. Defaults to a role label.',
    },
    avatarSrc: { control: 'text', description: "Avatar image for `role: 'user'`." },
    timestamp: { control: 'text', description: 'Rendered under the name, already formatted.' },
    streaming: {
      control: 'boolean',
      description:
        'The turn is still being produced. With `content` the text reveals; without it, a thinking indicator stands in.',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'text',
      description: 'Failure text. Replaces the body and reveals the retry action.',
    },
    showActions: {
      control: 'boolean',
      description: 'Show copy / regenerate actions on hover and on focus.',
      table: { defaultValue: { summary: 'false' } },
    },
    showFeedback: {
      control: 'boolean',
      description: 'Include thumbs up/down alongside the other actions.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    role: 'assistant',
    content:
      'The rollback was triggered by the readiness probe failing on 4 of 6 pods. payments-api could not open a database connection within the 5s probe timeout after max_connections dropped to 20.',
    timestamp: '14:31',
    streaming: false,
    showActions: true,
    showFeedback: false,
  },
  render: (args) => ({
    components: { ChatMessage },
    setup: () => ({ args }),
    template: `<div class="w-[42rem] max-w-full"><ChatMessage v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof ChatMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** All three roles, as they appear in sequence. */
export const Roles: Story = {
  render: (args) => ({
    components: { ChatMessage },
    setup: () => ({ args }),
    template: `
      <div class="flex w-[42rem] max-w-full flex-col gap-6">
        <ChatMessage
          v-bind="args"
          role="system"
          content="Assistant scoped to eu-west-1. Write actions require approval."
          :timestamp="undefined"
        />
        <ChatMessage
          v-bind="args"
          role="user"
          author="Dana Whitfield"
          content="Why did the payments-api deploy roll back at 14:02?"
          timestamp="14:29"
        />
        <ChatMessage v-bind="args" role="assistant" />
      </div>`,
  }),
}

/** A turn still being produced, before the first token arrives. */
export const Waiting: Story = {
  args: { content: undefined, streaming: true },
}

/** Tokens arriving — the text reveals as `content` grows. */
export const Streaming: Story = {
  args: { streaming: true },
}

/** A failed turn: the error replaces the body, and retry is always visible. */
export const Failed: Story = {
  args: {
    content: undefined,
    error: 'The model stopped responding after 60s. No tokens were received.',
  },
}

/** With feedback controls, for a thread that collects response quality signals. */
export const WithFeedback: Story = {
  args: { showFeedback: true },
}

/** Rich content via the default slot, with a footer for citations or usage. */
export const RichContent: Story = {
  render: (args) => ({
    components: { ChatMessage },
    setup: () => ({ args }),
    template: `
      <div class="w-[42rem] max-w-full">
        <ChatMessage v-bind="args" :content="undefined">
          <div class="flex flex-col gap-3 text-sm leading-relaxed">
            <p>Three services missed their availability SLO this week:</p>
            <ul class="flex flex-col gap-1 pl-4">
              <li class="list-disc"><span class="font-medium">checkout</span> — 99.10% against a 99.50% target</li>
              <li class="list-disc"><span class="font-medium">search</span> — 99.30% against a 99.50% target</li>
              <li class="list-disc"><span class="font-medium">notifications</span> — 98.80% against a 99.00% target</li>
            </ul>
            <p>checkout burned 80% of its monthly error budget in a single 29-minute incident.</p>
          </div>
          <template #footer>
            <p class="px-1 text-2xs text-fg-muted">Based on 4 sources · 1,284 tokens</p>
          </template>
        </ChatMessage>
      </div>`,
  }),
}

/** A user turn with an avatar and a name. */
export const UserTurn: Story = {
  args: {
    role: 'user',
    author: 'Dana Whitfield',
    content: 'Why did the payments-api deploy roll back at 14:02?',
    timestamp: '14:29',
  },
}
