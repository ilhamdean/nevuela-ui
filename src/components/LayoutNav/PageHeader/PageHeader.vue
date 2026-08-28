<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  /** Supporting copy under the title (or use the `#description` slot). */
  description?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <header :class="cn('flex flex-col gap-4 border-b border-border pb-5', props.class)">
    <slot name="breadcrumbs" />

    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-3">
          <slot name="leading" />
          <h1 class="text-2xl font-bold text-fg">{{ title }}</h1>
          <slot name="badge" />
        </div>
        <p v-if="description || $slots.description" class="text-sm text-fg-subtle">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>

      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <slot />
  </header>
</template>
