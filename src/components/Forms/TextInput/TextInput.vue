<script setup lang="ts">
import { computed, ref, useSlots, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { inputVariants, type InputVariants } from '.'

// Native attributes (id, name, placeholder, aria-describedby, autocomplete…)
// must land on the <input>, not the wrapper.
defineOptions({ inheritAttrs: false })

interface Props {
  size?: InputVariants['size']
  /** Marks the field invalid: red border + `aria-invalid`. Pair with a FormField error. */
  invalid?: boolean
  disabled?: boolean
  /** Native input type (`text`, `email`, `password`, `search`, `number`, …). */
  type?: string
  /** Placeholder text. */
  placeholder?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  invalid: false,
  disabled: false,
  type: 'text',
})

const model = defineModel<string | number>()

const slots = useSlots()
const hasLeading = computed(() => !!slots.leading)
const hasTrailing = computed(() => !!slots.trailing)

const inputRef = ref<HTMLInputElement>()
defineExpose({
  /** The underlying `<input>` element. */
  inputRef,
  /** Focus the input. */
  focus: () => inputRef.value?.focus(),
})
</script>

<template>
  <div class="relative w-full">
    <span
      v-if="hasLeading"
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-fg-muted [&_svg]:size-4"
    >
      <slot name="leading" />
    </span>

    <input
      ref="inputRef"
      v-model="model"
      v-bind="$attrs"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :class="
        cn(
          inputVariants({ size, invalid }),
          hasLeading && 'pl-9',
          hasTrailing && 'pr-9',
          props.class,
        )
      "
    />

    <span
      v-if="hasTrailing"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-fg-muted [&_svg]:size-4"
    >
      <slot name="trailing" />
    </span>
  </div>
</template>
