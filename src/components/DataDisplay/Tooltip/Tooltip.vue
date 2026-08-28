<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'

interface Props {
  /** Tooltip text (or use the `#content` slot for rich content). */
  content?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  /** Delay before showing, in ms. */
  delay?: number
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  side: 'top',
  sideOffset: 6,
  delay: 300,
  disabled: false,
})
</script>

<template>
  <TooltipProvider :delay-duration="delay" :disable-hoverable-content="true">
    <TooltipRoot :disabled="disabled">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :side-offset="sideOffset"
          class="z-50 max-w-xs rounded-md bg-fg px-2.5 py-1.5 text-xs font-medium text-surface shadow-md data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0"
        >
          <slot name="content">{{ content }}</slot>
          <TooltipArrow class="fill-fg" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
