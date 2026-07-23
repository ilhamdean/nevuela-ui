<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
import { cn } from '@/lib/utils'
import { toastPositionSide, toastViewportVariants, type ToastPosition } from '.'
import { useToast } from './useToast'
import Toast from './Toast.vue'

interface Props {
  /** Which screen corner/edge the toast stack docks to. */
  position?: ToastPosition
  /** Default auto-dismiss delay in ms for toasts that don't set their own `duration`. */
  duration?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom-right',
  duration: 5000,
})

const { toasts } = useToast()

// Reka's swipe direction uses 'up'/'down' where our position side map uses
// 'top'/'bottom' (to match the `slide-in-from-{side}` animation utilities).
const swipeDirection = computed(() => {
  const side = toastPositionSide[props.position]
  return side === 'top' ? 'up' : side === 'bottom' ? 'down' : side
})
</script>

<template>
  <ToastProvider :duration="duration" :swipe-direction="swipeDirection">
    <Toast
      v-for="item in toasts"
      :key="item.id"
      v-model:open="item.open"
      :tone="item.tone"
      :title="item.title"
      :description="item.description"
      :duration="item.duration"
      :action-label="item.actionLabel"
      :position="position"
      @action="item.onAction?.()"
    />

    <ToastViewport :class="cn(toastViewportVariants({ position }), props.class)" />
  </ToastProvider>
</template>
