<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import type { AlertTone } from '../Alert'
import { bannerVariants } from '.'

interface Props {
  tone?: AlertTone
  /** Optional — banners are often a single line, so this is not required. */
  title?: string
  /** Body text (or use the default slot). */
  description?: string
  dismissible?: boolean
  /** Override the tone icon, or pass `null` to hide it. */
  icon?: Component | null
  /** Pin the banner to the top of its scroll container (`sticky top-0 z-40`). */
  sticky?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'info',
  dismissible: false,
  sticky: false,
})

const emit = defineEmits<{ dismiss: [] }>()

const defaultIcons: Record<AlertTone, Component> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
}
const iconComponent = computed(() =>
  props.icon === null ? null : (props.icon ?? defaultIcons[props.tone]),
)
const iconColor: Record<AlertTone, string> = {
  info: 'text-status-info',
  success: 'text-status-active',
  warning: 'text-status-warning',
  error: 'text-status-error',
}
// Error/warning are assertive; info/success are polite.
const role = computed(() =>
  props.tone === 'error' || props.tone === 'warning' ? 'alert' : 'status',
)
</script>

<template>
  <div :role="role" :class="cn(bannerVariants({ tone, sticky }), props.class)">
    <component
      :is="iconComponent"
      v-if="iconComponent"
      :class="cn('size-5 shrink-0', iconColor[tone])"
      aria-hidden="true"
    />

    <div class="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
      <p v-if="title" class="font-semibold text-fg">{{ title }}</p>
      <div v-if="description || $slots.default" class="text-fg-subtle">
        <slot>{{ description }}</slot>
      </div>
    </div>

    <div v-if="$slots.actions" class="flex shrink-0 items-center">
      <slot name="actions" />
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <X class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
