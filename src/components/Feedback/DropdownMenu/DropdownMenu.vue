<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem as RekaDropdownMenuItem,
  DropdownMenuLabel as RekaDropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator as RekaDropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import type { DropdownEntry, DropdownMenuItem } from '.'

interface Props {
  items: DropdownEntry[]
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}

withDefaults(defineProps<Props>(), {
  align: 'end',
  side: 'bottom',
  sideOffset: 6,
})

const emit = defineEmits<{ select: [item: DropdownMenuItem] }>()

function isSeparator(e: DropdownEntry): e is { type: 'separator' } {
  return e.type === 'separator'
}
function isLabel(e: DropdownEntry): e is { type: 'label'; label: string } {
  return e.type === 'label'
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :align="align"
        :side="side"
        :side-offset="sideOffset"
        class="z-50 min-w-48 rounded-md border border-border bg-surface p-1 text-fg shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
      >
        <template v-for="(entry, i) in items" :key="i">
          <RekaDropdownMenuSeparator v-if="isSeparator(entry)" class="my-1 h-px bg-border" />

          <RekaDropdownMenuLabel
            v-else-if="isLabel(entry)"
            class="px-2 py-1.5 text-2xs font-semibold tracking-wide text-fg-muted uppercase"
          >
            {{ entry.label }}
          </RekaDropdownMenuLabel>

          <RekaDropdownMenuItem
            v-else
            :disabled="entry.disabled"
            :class="
              cn(
                'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                entry.danger
                  ? 'text-status-error data-[highlighted]:bg-status-error-subtle'
                  : 'data-[highlighted]:bg-bg-subtle data-[highlighted]:text-fg',
              )
            "
            @select="emit('select', entry)"
          >
            <component
              :is="entry.icon"
              v-if="entry.icon"
              class="size-4 shrink-0"
              aria-hidden="true"
            />
            <span class="flex-1">{{ entry.label }}</span>
            <span v-if="entry.shortcut" class="text-xs text-fg-muted">{{ entry.shortcut }}</span>
          </RekaDropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
