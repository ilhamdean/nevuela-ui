<script setup lang="ts">
import { computed, useId, useSlots, type HTMLAttributes } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { Check, Minus } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { checkboxVariants, type CheckboxVariants } from '.'

type CheckedState = boolean | 'indeterminate'

interface Props {
  size?: CheckboxVariants['size']
  disabled?: boolean
  /** Marks the field invalid: status-error ring + `aria-invalid`. Pair with a FormField error. */
  invalid?: boolean
  /** Inline label text (or use the default slot). */
  label?: string
  /** Explicit id (auto-generated otherwise) for label association. */
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  invalid: false,
})

const model = defineModel<CheckedState>({ default: false })

const slots = useSlots()
const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const hasLabel = computed(() => !!slots.default || !!props.label)
const iconSize = computed(() => (props.size === 'sm' ? 'size-3' : 'size-3.5'))
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <CheckboxRoot
      :id="controlId"
      v-model="model"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :class="cn(checkboxVariants({ size, invalid }), props.class)"
    >
      <CheckboxIndicator class="flex items-center justify-center text-current">
        <Minus v-if="model === 'indeterminate'" :class="iconSize" aria-hidden="true" />
        <Check v-else :class="iconSize" aria-hidden="true" />
      </CheckboxIndicator>
    </CheckboxRoot>

    <label
      v-if="hasLabel"
      :for="controlId"
      class="cursor-pointer text-sm text-fg select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
    >
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>
