<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { badgeVariants, type BadgeVariants } from '.'

interface Props {
  /** Decorative color — purely categorical, carries no lifecycle/state meaning. */
  color?: BadgeVariants['color']
  size?: BadgeVariants['size']
  /** Optional leading icon. */
  icon?: Component
  /** Show a trailing remove ("x") button and emit `remove` on click. The badge
   * is stateless — the parent owns the list and removes the item itself. */
  removable?: boolean
  /** Text label. Alternatively use the default slot. */
  label?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  color: 'neutral',
  size: 'md',
  removable: false,
})

const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <span :class="cn(badgeVariants({ color, size }), props.class)">
    <component :is="icon" v-if="icon" class="size-3 shrink-0" aria-hidden="true" />
    <slot>{{ label }}</slot>
    <button
      v-if="removable"
      type="button"
      class="inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm hover:bg-current/15"
      :aria-label="label ? `Remove ${label}` : 'Remove'"
      @click.stop="emit('remove')"
    >
      <X class="size-3" />
    </button>
  </span>
</template>
