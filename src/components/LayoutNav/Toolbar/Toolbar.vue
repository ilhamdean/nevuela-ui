<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { X } from '@lucide/vue'
import { cn } from '@/lib/utils'

interface Props {
  /**
   * Number of currently-selected rows in the resource list this toolbar sits
   * above. When greater than `0` (and a `bulk-actions` slot is supplied), a
   * contextual bulk-actions row appears below the main toolbar.
   */
  selectedCount?: number
  /**
   * Pin the toolbar to the top of its scroll container
   * (`sticky top-0 z-10 bg-surface`) — a lower z-index than `Banner`/`Modal`
   * since this is a local, in-flow sticky element rather than a page overlay.
   */
  sticky?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  selectedCount: 0,
  sticky: false,
})

const emit = defineEmits<{
  /** The bulk-actions row's "Clear" button was clicked. */
  'clear-selection': []
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-2', sticky && 'sticky top-0 z-10 bg-surface', props.class)">
    <div class="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <slot />
      <div class="flex-1" />
      <slot name="actions" />
    </div>

    <div
      v-if="selectedCount > 0 && $slots['bulk-actions']"
      role="status"
      class="flex items-center gap-3 rounded-xl bg-brand-subtle p-3"
    >
      <p class="shrink-0 text-sm font-medium text-brand">{{ selectedCount }} selected</p>
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <slot name="bulk-actions" />
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:outline-none"
        @click="emit('clear-selection')"
      >
        <X class="size-4" aria-hidden="true" />
        Clear
      </button>
    </div>
  </div>
</template>
