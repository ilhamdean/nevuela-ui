<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch, type HTMLAttributes } from 'vue'
import { ArrowDown, MessageSquare } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { EmptyState } from '../../DataDisplay/EmptyState'
import { chatThreadVariants, type ChatThreadVariants } from '.'

interface Props {
  /**
   * Changes to this value mean new content arrived — bump it with the message
   * count, or with the streaming text's length, to trigger auto-scroll. The
   * thread doesn't own the messages, so it can't detect that itself.
   */
  revision?: number | string
  /** Render the empty state instead of the slot. */
  empty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  /** Announce new content to screen readers as it arrives. Off for a transcript being re-read. */
  live?: boolean
  density?: ChatThreadVariants['density']
  /** Accessible name for the scrollable log region. */
  label?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  revision: 0,
  empty: false,
  emptyTitle: 'Start a conversation',
  emptyDescription: 'Ask a question to get started.',
  live: true,
  density: 'comfortable',
  label: 'Conversation',
})

const scrollRef = ref<HTMLElement>()
/**
 * Whether new messages should pull the view down. Turns off the moment the user
 * scrolls up to read back — yanking them to the bottom mid-sentence is the
 * single worst thing a chat log can do.
 */
const stickToBottom = ref(true)

/** Slack in px: a couple of lines of drift still counts as "at the bottom". */
const BOTTOM_THRESHOLD = 48

function onScroll() {
  const el = scrollRef.value
  if (!el) return
  const distance = el.scrollHeight - el.scrollTop - el.clientHeight
  stickToBottom.value = distance <= BOTTOM_THRESHOLD
}

function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
  const el = scrollRef.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior })
  stickToBottom.value = true
}

watch(
  () => props.revision,
  () => {
    if (!stickToBottom.value) return
    // After the DOM has the new turn in it, or we'd scroll to the old height.
    nextTick(() => scrollToBottom('smooth'))
  },
)

onMounted(() => {
  scrollRef.value?.addEventListener('scroll', onScroll, { passive: true })
  nextTick(() => scrollToBottom('auto'))
})
onBeforeUnmount(() => scrollRef.value?.removeEventListener('scroll', onScroll))

defineExpose({ scrollRef, scrollToBottom })
</script>

<template>
  <div :class="cn(chatThreadVariants({ density }), props.class)">
    <div
      ref="scrollRef"
      data-thread-scroll
      role="log"
      :aria-label="label"
      :aria-live="live ? 'polite' : 'off'"
      aria-relevant="additions text"
      tabindex="0"
      class="flex min-h-0 flex-1 flex-col overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:ring-inset"
    >
      <EmptyState
        v-if="empty"
        :title="emptyTitle"
        :description="emptyDescription"
        :icon="MessageSquare"
        :bordered="false"
        class="my-auto"
      >
        <template #actions>
          <slot name="empty" />
        </template>
      </EmptyState>

      <slot v-else />
    </div>

    <!-- Only offered once the user has actually scrolled away; otherwise it's a
         permanent button that does nothing. -->
    <button
      v-if="!stickToBottom && !empty"
      type="button"
      class="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-fg-subtle shadow-md outline-none transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/25"
      @click="scrollToBottom()"
    >
      <ArrowDown class="size-3.5" aria-hidden="true" />
      Jump to latest
    </button>
  </div>
</template>
