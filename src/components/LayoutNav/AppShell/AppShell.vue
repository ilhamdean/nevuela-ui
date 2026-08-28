<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  /** Constrain the content column width; `false` lets it fill. */
  maxWidth?: string | false
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: '80rem',
})

/** Collapsed state of the sidebar rail (`v-model:collapsed`). */
const collapsed = defineModel<boolean>('collapsed', { default: false })

const toggleSidebar = () => (collapsed.value = !collapsed.value)
</script>

<template>
  <div :class="cn('flex h-dvh w-full overflow-hidden bg-bg text-fg', props.class)">
    <aside
      :class="
        cn(
          'shrink-0 overflow-y-auto border-r border-border bg-surface transition-[width] duration-200',
          collapsed ? 'w-16' : 'w-60',
        )
      "
    >
      <slot name="sidebar" :collapsed="collapsed" />
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <slot name="topbar" :collapsed="collapsed" :toggle-sidebar="toggleSidebar" />

      <main class="flex-1 overflow-y-auto">
        <div class="mx-auto w-full p-6" :style="maxWidth ? { maxWidth } : undefined">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
