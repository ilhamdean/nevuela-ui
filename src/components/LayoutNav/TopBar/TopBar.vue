<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  /** Render as a sticky bar pinned to the top of its scroll container. */
  sticky?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  sticky: false,
})
</script>

<template>
  <div
    :class="
      cn(
        'flex h-14 items-center gap-3 border-b border-border bg-surface px-4',
        sticky && 'sticky top-0 z-30',
        props.class,
      )
    "
  >
    <!-- Left: menu toggle, logo, breadcrumbs -->
    <div class="flex items-center gap-2">
      <slot name="leading" />
    </div>

    <!-- Center: global search -->
    <div class="min-w-0 flex-1">
      <slot name="search" />
    </div>

    <!-- Right: quick actions (bell, help), primary action, then account -->
    <div class="flex items-center gap-1.5">
      <slot name="actions" />
    </div>
    <div class="flex items-center gap-2">
      <slot name="create" />
      <slot name="account" />
    </div>
  </div>
</template>
