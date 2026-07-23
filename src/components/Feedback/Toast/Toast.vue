<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { ToastAction, ToastClose, ToastDescription, ToastRoot, ToastTitle } from 'reka-ui'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Button } from '../../Forms/Button'
import { toastPositionSide, type ToastPosition, type ToastTone } from '.'

interface Props {
  tone?: ToastTone
  title: string
  description?: string
  /** Auto-dismiss delay in ms. Falls back to the hosting `ToastProvider`'s default (5000ms) when unset. */
  duration?: number
  /** Optional action button label. */
  actionLabel?: string
  /** Which edge this toast animates in from / swipes toward to dismiss. */
  position?: ToastPosition
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'info',
  position: 'bottom-right',
})

const emit = defineEmits<{ action: []; 'update:open': [value: boolean] }>()

/**
 * Open state (`v-model:open`). A `ToastRoot` must be hosted inside a
 * `ToastProvider` + `ToastViewport` to render and animate correctly — use
 * `Toaster`, which does this for you and renders one `Toast` per queued item.
 */
const open = defineModel<boolean>('open')

const icons: Record<ToastTone, Component> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
}
const iconColor: Record<ToastTone, string> = {
  info: 'text-status-info',
  success: 'text-status-active',
  warning: 'text-status-warning',
  error: 'text-status-error',
}
const icon = computed(() => icons[props.tone])

const slideInBySide: Record<'top' | 'bottom' | 'left' | 'right', string> = {
  top: 'data-[state=open]:slide-in-from-top-full',
  bottom: 'data-[state=open]:slide-in-from-bottom-full',
  left: 'data-[state=open]:slide-in-from-left-full',
  right: 'data-[state=open]:slide-in-from-right-full',
}
const slideInClass = computed(() => slideInBySide[toastPositionSide[props.position]])
</script>

<template>
  <ToastRoot
    v-model:open="open"
    :duration="duration"
    :class="
      cn(
        'pointer-events-auto flex w-80 items-start gap-3 rounded-md border border-border bg-surface p-4 shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-80 data-[swipe=end]:animate-out data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)]',
        slideInClass,
        props.class,
      )
    "
  >
    <component :is="icon" :class="['mt-0.5 size-5 shrink-0', iconColor[tone]]" aria-hidden="true" />

    <div class="min-w-0 flex-1">
      <ToastTitle class="text-sm font-semibold text-fg">{{ title }}</ToastTitle>
      <ToastDescription v-if="description" class="mt-0.5 text-sm text-fg-subtle">
        {{ description }}
      </ToastDescription>
      <ToastAction v-if="actionLabel" :alt-text="actionLabel" as-child>
        <Button variant="ghost" size="sm" class="mt-2 -ml-1.5" @click="emit('action')">
          {{ actionLabel }}
        </Button>
      </ToastAction>
    </div>

    <ToastClose
      class="-mt-1 -mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
      aria-label="Close"
    >
      <X class="size-4" aria-hidden="true" />
    </ToastClose>
  </ToastRoot>
</template>
