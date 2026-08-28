<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from 'reka-ui'
import { ChevronUp, ChevronDown } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { numberInputVariants, type NumberInputVariants } from '.'

// Native attributes (aria-describedby, name, autocomplete…) must land on the
// inner <input>, not the NumberFieldRoot wrapper.
defineOptions({ inheritAttrs: false })

interface Props {
  /** Smallest value allowed. Disables the decrement stepper once reached. */
  min?: number
  /** Largest value allowed. Disables the increment stepper once reached. */
  max?: number
  /** Amount the value changes per increment/decrement "tick". */
  step?: number
  size?: NumberInputVariants['size']
  /** Marks the field invalid: red border + `aria-invalid`. Pair with a FormField error. */
  invalid?: boolean
  disabled?: boolean
  /** Placeholder text shown when empty. */
  placeholder?: string
  id?: string
  /** Formatting for the displayed value (also constrains what's typeable), e.g. `{ style: 'unit', unit: 'gigabyte' }`. */
  formatOptions?: Intl.NumberFormatOptions
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  size: 'md',
  invalid: false,
  disabled: false,
})

const model = defineModel<number | undefined>()

const inputPaddingClass = computed(
  () => ({ sm: 'px-2.5', md: 'px-3', lg: 'px-3.5' })[props.size ?? 'md'],
)

const inputRef = ref<InstanceType<typeof NumberFieldInput>>()
defineExpose({
  /** The underlying native `<input>` element. */
  inputRef: computed(() => inputRef.value?.$el as HTMLInputElement | undefined),
  /** Focus the input. */
  focus: () => (inputRef.value?.$el as HTMLInputElement | undefined)?.focus(),
})
</script>

<template>
  <NumberFieldRoot
    :id="id"
    :model-value="model"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :format-options="formatOptions"
    :class="cn(numberInputVariants({ size, invalid }), props.class)"
    @update:model-value="model = $event"
  >
    <NumberFieldInput
      ref="inputRef"
      v-bind="$attrs"
      :placeholder="placeholder"
      :aria-invalid="invalid || undefined"
      :class="
        cn(
          'w-full min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-muted',
          inputPaddingClass,
        )
      "
    />

    <div class="flex flex-col border-l border-border">
      <NumberFieldIncrement
        aria-label="Increment"
        class="flex flex-1 items-center justify-center border-b border-border px-2 text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-3.5"
      >
        <ChevronUp aria-hidden="true" />
      </NumberFieldIncrement>
      <NumberFieldDecrement
        aria-label="Decrement"
        class="flex flex-1 items-center justify-center px-2 text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-3.5"
      >
        <ChevronDown aria-hidden="true" />
      </NumberFieldDecrement>
    </div>
  </NumberFieldRoot>
</template>
