<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { alertVariants, type AlertTone } from '.'

interface Props {
  tone?: AlertTone
  title?: string
  /** Body text (or use the default slot). */
  description?: string
  dismissible?: boolean
  /** Override the tone icon, or pass `null` to hide it. */
  icon?: Component | null
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'info',
  dismissible: false,
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
  info: 'text-status-info-fg',
  success: 'text-status-active-fg',
  warning: 'text-status-warning-fg',
  error: 'text-status-error-fg',
}
// Error/warning are assertive; info/success are polite.
const role = computed(() =>
  props.tone === 'error' || props.tone === 'warning' ? 'alert' : 'status',
)
</script>

<template>
  <div :role="role" :class="cn(alertVariants({ tone }), props.class)">
    <component
      :is="iconComponent"
      v-if="iconComponent"
      :class="cn('mt-0.5 size-5 shrink-0', iconColor[tone])"
      aria-hidden="true"
    />

    <div class="min-w-0 flex-1">
      <p v-if="title" class="font-semibold text-fg">{{ title }}</p>
      <div v-if="description || $slots.default" :class="cn('text-fg-subtle', title && 'mt-0.5')">
        <slot>{{ description }}</slot>
      </div>
      <div v-if="$slots.actions" class="mt-3 flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="-mt-1 -mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <X class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
