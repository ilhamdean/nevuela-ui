<script setup lang="ts">
import { type Component, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  /** Supporting copy (or use the default slot). */
  description?: string
  /** Icon component (e.g. a Lucide icon). Overridable via the `#icon` slot. */
  icon?: Component
  /** Render inside a dashed bordered panel. */
  bordered?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  bordered: true,
})
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        bordered && 'rounded-xl border border-dashed border-border bg-surface',
        props.class,
      )
    "
  >
    <div
      v-if="icon || $slots.icon"
      class="flex size-12 items-center justify-center rounded-full bg-bg-subtle text-fg-muted"
    >
      <slot name="icon">
        <component :is="icon" v-if="icon" class="size-6" aria-hidden="true" />
      </slot>
    </div>

    <div class="space-y-1">
      <h3 class="text-base font-semibold text-fg">{{ title }}</h3>
      <p v-if="description || $slots.default" class="mx-auto max-w-sm text-sm text-fg-subtle">
        <slot>{{ description }}</slot>
      </p>
    </div>

    <div v-if="$slots.actions" class="mt-1 flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
