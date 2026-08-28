import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { ChatThread } from '.'
import { ChatMessage } from '../ChatMessage'
import { PromptInput } from '../PromptInput'
import { PromptSuggestions } from '../PromptSuggestions'
import { SourceList } from '../SourceList'
import { ToolCallCard } from '../ToolCallCard'
import { TokenUsage } from '../TokenUsage'

/**
 * `ChatThread` is the scroll container for a conversation. It auto-scrolls when
 * `revision` changes — and stops the moment the user scrolls up to read back,
 * offering a "Jump to latest" button instead. Yanking someone to the bottom
 * mid-sentence is the worst thing a chat log can do, so sticking is a state the
 * user controls, not a default that fights them.
 *
 * The thread doesn't own the messages, so it can't detect new ones on its own:
 * bump `revision` with the message count, or with the streaming text's length.
 */
const meta = {
  title: 'AI/ChatThread',
  component: ChatThread,
  argTypes: {
    revision: {
      control: 'text',
      description:
        'Changes signal new content and trigger auto-scroll. Use the message count, or the streaming text length.',
      table: { defaultValue: { summary: '0' } },
    },
    empty: {
      control: 'boolean',
      description: 'Render the empty state instead of the slot.',
      table: { defaultValue: { summary: 'false' } },
    },
    emptyTitle: { control: 'text', table: { defaultValue: { summary: 'Start a conversation' } } },
    emptyDescription: {
      control: 'text',
      table: { defaultValue: { summary: 'Ask a question to get started.' } },
    },
    live: {
      control: 'boolean',
      description: 'Announce new content to screen readers. Off for a transcript being re-read.',
      table: { defaultValue: { summary: 'true' } },
    },
    density: {
      control: 'inline-radio',
      options: ['comfortable', 'compact'],
      description: '`comfortable` for a full-page assistant, `compact` for a side panel.',
      table: { defaultValue: { summary: 'comfortable' } },
    },
    label: {
      control: 'text',
      description: 'Accessible name for the scrollable log region.',
      table: { defaultValue: { summary: 'Conversation' } },
    },
  },
  args: {
    revision: 0,
    empty: false,
    live: true,
    density: 'comfortable',
    label: 'Conversation',
  },
} satisfies Meta<typeof ChatThread>

export default meta
type Story = StoryObj<typeof meta>

interface Turn {
  role: 'user' | 'assistant' | 'system'
  author?: string
  content: string
  timestamp?: string
}

const transcript: Turn[] = [
  {
    role: 'user',
    author: 'Dana Whitfield',
    content: 'Why did the payments-api deploy roll back at 14:02?',
    timestamp: '14:29',
  },
  {
    role: 'assistant',
    content:
      'The rollback was triggered by the readiness probe failing on 4 of 6 pods. payments-api could not open a database connection within the 5s probe timeout after max_connections dropped from 200 to 20 in PR #8840.',
    timestamp: '14:31',
  },
  {
    role: 'user',
    author: 'Dana Whitfield',
    content: 'Who approved that PR, and was the runbook followed?',
    timestamp: '14:33',
  },
  {
    role: 'assistant',
    content:
      'PR #8840 was approved by one reviewer and merged by platform-bot. The RDS resize runbook (rb-087) requires recalculating max_connections against the worker count — that step was skipped, which is why the value landed below the pool size.',
    timestamp: '14:34',
  },
]

export const Playground: Story = {
  render: (args) => ({
    components: { ChatThread, ChatMessage },
    setup: () => ({ args, transcript }),
    template: `
      <div class="h-[28rem] w-[44rem] max-w-full rounded-xl border border-border bg-surface">
        <ChatThread v-bind="args" :revision="transcript.length" class="h-full">
          <ChatMessage
            v-for="(m, i) in transcript"
            :key="i"
            v-bind="m"
            show-actions
          />
        </ChatThread>
      </div>`,
  }),
}

/** Nothing sent yet — the empty state carries starter prompts through the `#empty` slot. */
export const Empty: Story = {
  args: {
    empty: true,
    emptyTitle: 'Ask the platform assistant',
    emptyDescription: 'It can read deploys, metrics, incidents, and runbooks for this workspace.',
  },
  render: (args) => ({
    components: { ChatThread, PromptSuggestions },
    setup: () => ({ args }),
    template: `
      <div class="h-[28rem] w-[44rem] max-w-full rounded-xl border border-border bg-surface">
        <ChatThread v-bind="args" class="h-full">
          <template #empty>
            <PromptSuggestions
              label=""
              :suggestions="[
                { label: 'Why did the last deploy roll back?' },
                { label: 'Summarize open incidents' },
                { label: 'Show error budget burn' },
              ]"
            />
          </template>
        </ChatThread>
      </div>`,
  }),
}

/**
 * A long transcript. Scroll up and the thread stops following new content —
 * "Jump to latest" appears until you return to the bottom.
 */
export const LongTranscript: Story = {
  render: (args) => ({
    components: { ChatThread, ChatMessage },
    setup() {
      const messages = computed(() =>
        Array.from({ length: 6 }, () => transcript)
          .flat()
          .map((m, i) => ({ ...m, key: i })),
      )
      return { args, messages }
    },
    template: `
      <div class="h-[28rem] w-[44rem] max-w-full rounded-xl border border-border bg-surface">
        <ChatThread v-bind="args" :revision="messages.length" class="h-full">
          <ChatMessage v-for="m in messages" :key="m.key" v-bind="m" show-actions />
        </ChatThread>
      </div>`,
  }),
}

/** The compact density, for an assistant docked in a side panel. */
export const CompactPanel: Story = {
  args: { density: 'compact' },
  render: (args) => ({
    components: { ChatThread, ChatMessage },
    setup: () => ({ args, transcript }),
    template: `
      <div class="h-[26rem] w-80 rounded-xl border border-border bg-surface">
        <ChatThread v-bind="args" :revision="transcript.length" class="h-full">
          <ChatMessage v-for="(m, i) in transcript" :key="i" v-bind="m" />
        </ChatThread>
      </div>`,
  }),
}

/**
 * The whole surface assembled: thread, agent trace, citations, usage, and the
 * composer. Sending a message appends it and streams a canned reply back.
 */
export const FullAssistantPanel: Story = {
  render: (args) => ({
    components: {
      ChatThread,
      ChatMessage,
      PromptInput,
      ToolCallCard,
      SourceList,
      TokenUsage,
    },
    setup() {
      const messages = ref<Turn[]>([...transcript])
      const draft = ref('')
      const streaming = ref(false)
      const streamed = ref('')
      const revision = computed(() => `${messages.value.length}:${streamed.value.length}`)

      const reply =
        'Checking now. The change was merged outside the deploy window, so the pre-merge capacity check never ran.'

      let timer: ReturnType<typeof setInterval> | undefined
      function send(value: string) {
        messages.value.push({
          role: 'user',
          author: 'Dana Whitfield',
          content: value,
          timestamp: '14:36',
        })
        draft.value = ''
        streaming.value = true
        streamed.value = ''
        clearInterval(timer)
        timer = setInterval(() => {
          streamed.value = reply.slice(0, streamed.value.length + 3)
          if (streamed.value.length >= reply.length) {
            clearInterval(timer)
            streaming.value = false
            messages.value.push({ role: 'assistant', content: reply, timestamp: '14:36' })
            streamed.value = ''
          }
        }, 30)
      }

      function stop() {
        clearInterval(timer)
        streaming.value = false
        streamed.value = ''
      }

      return { args, messages, draft, streaming, streamed, revision, send, stop }
    },
    template: `
      <div class="flex h-[36rem] w-[46rem] max-w-full flex-col rounded-xl border border-border bg-surface">
        <div class="flex items-center justify-between border-b border-border px-4 py-3">
          <p class="text-sm font-semibold text-fg">Platform assistant</p>
          <p class="text-xs text-fg-muted">eu-west-1</p>
        </div>

        <ChatThread v-bind="args" :revision="revision" class="flex-1">
          <ChatMessage v-for="(m, i) in messages" :key="i" v-bind="m" show-actions show-feedback>
            <template v-if="i === 3" #footer>
              <div class="flex flex-col gap-3 pt-1">
                <ToolCallCard
                  name="fetch_pull_request"
                  status="success"
                  summary="Loaded PR #8840 and its reviews"
                  :args="{ repo: 'platform/payments-api', number: 8840 }"
                  :result="{ merged_by: 'platform-bot', approvals: 1, checks: 'passed' }"
                  :duration-ms="212"
                />
                <SourceList
                  variant="compact"
                  label="Cited"
                  :sources="[
                    { id: 'rb-087', title: 'RDS instance resize checklist', url: 'https://docs.example.com/runbooks/rds-resize' },
                    { id: 'pr-8840', title: 'PR #8840', url: 'https://github.example.com/platform/payments-api/pull/8840' },
                  ]"
                />
                <TokenUsage size="sm" :usage="{ prompt: 12480, completion: 843 }" :cost="0.0412" />
              </div>
            </template>
          </ChatMessage>

          <ChatMessage v-if="streaming" role="assistant" :content="streamed" streaming />
        </ChatThread>

        <div class="border-t border-border p-3">
          <PromptInput
            v-model="draft"
            :streaming="streaming"
            allow-attachments
            hint="Enter to send · Shift+Enter for a new line"
            @submit="send"
            @stop="stop"
          />
        </div>
      </div>`,
  }),
}
