<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { FormFieldControlBinding } from '.'

interface Props {
  label?: string
  /** Helper text shown below the control (hidden while an error is present). */
  hint?: string
  /** Error message. Sets the control invalid and takes over the description. */
  error?: string
  required?: boolean
  /** Explicit id for the control (auto-generated otherwise). */
  id?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const generatedId = useId()
const fieldId = computed(() => props.id ?? generatedId)
const hintId = computed(() => `${fieldId.value}-hint`)
const errorId = computed(() => `${fieldId.value}-error`)

const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint && !props.error) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length ? ids.join(' ') : undefined
})

/** Spread onto the control: `<TextInput v-bind="bind" />`. */
const bind = computed<FormFieldControlBinding>(() => ({
  id: fieldId.value,
  'aria-describedby': describedBy.value,
  invalid: !!props.error,
}))
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5', props.class)">
    <label v-if="label" :for="fieldId" class="text-sm font-semibold text-fg">
      {{ label
      }}<span v-if="required" class="ml-0.5 text-status-error-fg" aria-hidden="true">*</span>
    </label>

    <slot :id="fieldId" :bind="bind" />

    <p v-if="hint && !error" :id="hintId" class="text-xs text-fg-subtle">{{ hint }}</p>
    <p v-if="error" :id="errorId" role="alert" class="text-xs text-status-error-fg">{{ error }}</p>
  </div>
</template>
