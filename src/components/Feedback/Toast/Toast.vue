<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/vue'
import { Button } from '../../Forms/Button'
import type { ToastTone } from '.'

interface Props {
  tone?: ToastTone
  title: string
  description?: string
  /** Auto-dismiss delay in ms. */
  duration?: number
  /** Optional action button label. */
  actionLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'info',
  duration: 5000,
})

const emit = defineEmits<{ action: []; 'update:open': [value: boolean] }>()

/** Open state (`v-model:open`). */
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
</script>

<template>
  <ToastProvider swipe-direction="right">
    <ToastRoot
      v-model:open="open"
      :duration="duration"
      class="pointer-events-auto flex w-80 items-start gap-3 rounded-md border border-border bg-surface p-4 shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-right-full data-[swipe=end]:animate-out data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)]"
    >
      <component
        :is="icon"
        :class="['mt-0.5 size-5 shrink-0', iconColor[tone]]"
        aria-hidden="true"
      />

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

    <ToastViewport
      class="fixed right-0 bottom-0 z-[100] m-0 flex w-96 max-w-full list-none flex-col gap-2 p-4 outline-none"
    />
  </ToastProvider>
</template>
