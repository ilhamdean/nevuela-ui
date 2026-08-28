import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PromptInput } from '.'

/**
 * `PromptInput` is the composer: an auto-growing textarea that sends on Enter
 * and newlines on Shift+Enter, with a send button that becomes a stop button
 * while the model is responding. It never clears itself — `submit` hands the
 * caller the trimmed text and the caller owns the model, so a failed send does
 * not lose what the user typed.
 */
const meta = {
  title: 'AI/PromptInput',
  component: PromptInput,
  argTypes: {
    placeholder: { control: 'text', table: { defaultValue: { summary: 'Ask anything…' } } },
    minRows: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Rows the textarea starts at, and shrinks back to when emptied.',
      table: { defaultValue: { summary: '1' } },
    },
    maxRows: {
      control: { type: 'number', min: 2, max: 30 },
      description: 'Rows it grows to before scrolling instead.',
      table: { defaultValue: { summary: '12' } },
    },
    streaming: {
      control: 'boolean',
      description:
        'The model is mid-response. Swaps send for stop and blocks submission; the textarea stays editable.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    invalid: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    maxLength: {
      control: 'number',
      description: 'Character budget. Shows a counter and blocks send past the limit.',
    },
    allowAttachments: {
      control: 'boolean',
      description: 'Show the attachment button and emit `attach` when pressed.',
      table: { defaultValue: { summary: 'false' } },
    },
    attachments: {
      control: 'object',
      description: 'Files already staged for this prompt (`id`, `name`, optional `size`).',
    },
    hint: {
      control: 'text',
      description: 'Hint under the composer — shortcut, disclaimer, scope.',
    },
    label: {
      control: 'text',
      description: 'Accessible name for the textarea when there is no visible label.',
      table: { defaultValue: { summary: 'Message' } },
    },
    modelValue: { control: false, description: 'The prompt text (`v-model`).' },
  },
  args: {
    placeholder: 'Ask anything…',
    minRows: 1,
    maxRows: 12,
    streaming: false,
    disabled: false,
    invalid: false,
    allowAttachments: false,
    attachments: [],
    hint: 'Enter to send · Shift+Enter for a new line',
    label: 'Message',
  },
  render: (args) => ({
    components: { PromptInput },
    setup() {
      const value = ref('')
      const sent = ref<string[]>([])
      return { args, value, sent }
    },
    template: `
      <div class="flex w-[36rem] max-w-full flex-col gap-3">
        <PromptInput v-bind="args" v-model="value" @submit="(v) => { sent.push(v); value = '' }" />
        <ul v-if="sent.length" class="flex flex-col gap-1 text-xs text-fg-muted">
          <li v-for="(s, i) in sent" :key="i">sent: {{ s }}</li>
        </ul>
      </div>`,
  }),
} satisfies Meta<typeof PromptInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** The textarea grows with the content up to `maxRows`, then scrolls. */
export const AutoGrowing: Story = {
  render: (args) => ({
    components: { PromptInput },
    setup() {
      const value = ref(
        'Summarize the last three incidents affecting checkout.\n\nInclude:\n- the triggering change\n- time to detect\n- time to mitigate\n- whether the runbook was followed',
      )
      return { args, value }
    },
    template: `<div class="w-[36rem] max-w-full"><PromptInput v-bind="args" v-model="value" /></div>`,
  }),
  args: { maxRows: 8 },
}

/** Mid-response: send becomes stop, and submitting is blocked until the turn ends. */
export const Streaming: Story = {
  args: { streaming: true, hint: 'Generating a response…' },
  render: (args) => ({
    components: { PromptInput },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `<div class="w-[36rem] max-w-full"><PromptInput v-bind="args" v-model="value" /></div>`,
  }),
}

/** Attachments staged for the prompt, each removable. */
export const WithAttachments: Story = {
  args: {
    allowAttachments: true,
    attachments: [
      { id: 'f1', name: 'payments-api-error.log', size: 184_320 },
      { id: 'f2', name: 'incident-2291-timeline.csv', size: 4_096 },
    ],
  },
  render: (args) => ({
    components: { PromptInput },
    setup() {
      const value = ref('What do these two files have in common?')
      return { args, value }
    },
    template: `<div class="w-[36rem] max-w-full"><PromptInput v-bind="args" v-model="value" /></div>`,
  }),
}

/** Past the character budget: the counter and border both turn red and send is blocked. */
export const OverCharacterLimit: Story = {
  args: { maxLength: 120 },
  render: (args) => ({
    components: { PromptInput },
    setup() {
      const value = ref(
        'Explain in full detail why the checkout service missed its availability SLO this week, including every contributing deploy and config change.',
      )
      return { args, value }
    },
    template: `<div class="w-[36rem] max-w-full"><PromptInput v-bind="args" v-model="value" /></div>`,
  }),
}

/** Disabled — e.g. the session is read-only, or the user lacks permission to send. */
export const Disabled: Story = {
  args: { disabled: true, hint: 'This conversation is archived and cannot be continued.' },
  render: (args) => ({
    components: { PromptInput },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `<div class="w-[36rem] max-w-full"><PromptInput v-bind="args" v-model="value" /></div>`,
  }),
}
