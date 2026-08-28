<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  /** Extra classes for the `#header` slot's wrapper. */
  headerClass?: HTMLAttributes['class']
  /** Extra classes for the body wrapper (the default slot). */
  contentClass?: HTMLAttributes['class']
  /** Extra classes for the `#footer` slot's wrapper. */
  footerClass?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div
    :class="cn('overflow-hidden rounded-xl border border-border bg-surface shadow-sm', props.class)"
  >
    <div
      v-if="$slots.header"
      :class="cn('flex items-start justify-between gap-4 border-b border-border p-5', headerClass)"
    >
      <slot name="header" />
    </div>

    <div :class="cn('p-5', contentClass)">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      :class="cn('flex items-center justify-end gap-2 border-t border-border p-4', footerClass)"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
