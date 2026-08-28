<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { RadioCardOption } from '.'

interface Props {
  options?: RadioCardOption[]
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  /** Accessible label for the group. */
  ariaLabel?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  orientation: 'vertical',
  disabled: false,
})

const model = defineModel<string>()
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :class="
      cn(
        'grid gap-3',
        orientation === 'horizontal' ? 'auto-cols-fr grid-flow-col' : 'grid-cols-1',
        props.class,
      )
    "
  >
    <RadioGroupItem
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      :disabled="opt.disabled"
      class="group relative flex items-start gap-3 rounded-lg border-2 border-border bg-surface p-4 text-left outline-none transition-[border-color,background-color,box-shadow] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-brand data-[state=checked]:bg-brand-subtle"
    >
      <span
        class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface transition-colors group-data-[state=checked]:border-brand"
      >
        <RadioGroupIndicator class="size-2 rounded-full bg-brand" />
      </span>

      <span class="flex-1">
        <span class="flex items-center gap-2">
          <span class="text-sm font-semibold text-fg">{{ opt.title }}</span>
          <span
            v-if="opt.badge"
            class="rounded-full bg-brand-subtle px-1.5 py-0.5 text-2xs font-semibold tracking-wide text-brand-fg uppercase"
          >
            {{ opt.badge }}
          </span>
        </span>
        <span v-if="opt.description" class="mt-0.5 block text-xs text-fg-subtle">
          {{ opt.description }}
        </span>
      </span>
    </RadioGroupItem>
  </RadioGroupRoot>
</template>
