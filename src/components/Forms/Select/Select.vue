<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { Check, ChevronDown } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { selectTriggerVariants, type SelectOption, type SelectVariants } from '.'

interface Props {
  /** Options to render. Omit and use the default slot for custom `SelectItem`s. */
  options?: SelectOption[]
  placeholder?: string
  size?: SelectVariants['size']
  invalid?: boolean
  disabled?: boolean
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  size: 'md',
  invalid: false,
  disabled: false,
  placeholder: 'Select…',
})

const model = defineModel<string>()
</script>

<template>
  <SelectRoot v-model="model" :disabled="disabled">
    <SelectTrigger
      :id="id"
      :aria-invalid="invalid || undefined"
      :class="cn(selectTriggerVariants({ size, invalid }), props.class)"
    >
      <SelectValue :placeholder="placeholder" />
      <SelectIcon as-child>
        <ChevronDown class="size-4 shrink-0 text-fg-muted" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="4"
        class="z-50 max-h-72 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-border bg-surface text-fg shadow-md"
      >
        <SelectViewport class="p-1">
          <slot>
            <SelectItem
              v-for="opt in options"
              :key="opt.value"
              :value="opt.value"
              :disabled="opt.disabled"
              class="relative flex cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-brand-subtle data-[highlighted]:text-brand data-[state=checked]:font-medium"
            >
              <SelectItemText>{{ opt.label }}</SelectItemText>
              <SelectItemIndicator class="absolute right-2 inline-flex items-center text-brand">
                <Check class="size-4" />
              </SelectItemIndicator>
            </SelectItem>
          </slot>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
