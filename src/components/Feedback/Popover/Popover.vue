<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

interface Props {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Content panel width (Tailwind class); defaults to a comfortable 18rem. */
  contentClass?: HTMLAttributes['class']
}

withDefaults(defineProps<Props>(), {
  side: 'bottom',
  align: 'center',
  sideOffset: 8,
})

/** Open state (`v-model:open`). */
const open = defineModel<boolean>('open')
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :class="
          cn(
            'z-50 w-72 rounded-md border border-border bg-surface p-4 text-sm text-fg shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            contentClass,
          )
        "
      >
        <slot />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
