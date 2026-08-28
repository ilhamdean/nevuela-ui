<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui'
import { X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { tagInputVariants, type TagInputVariants } from '.'

// Native attributes (name, aria-describedby, autocomplete…) must land on the
// inner <input>, not the TagsInputRoot wrapper.
defineOptions({ inheritAttrs: false })

interface Props {
  placeholder?: string
  disabled?: boolean
  /** Marks the field invalid: red border + `aria-invalid`. Pair with a FormField error. */
  invalid?: boolean
  /** Maximum number of tags allowed. Once reached, the text input is disabled. */
  max?: number
  size?: TagInputVariants['size']
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  invalid: false,
  disabled: false,
  placeholder: 'Add value…',
})

/** Committed tag values — arbitrary user-typed strings, not drawn from a fixed option list. */
const model = defineModel<string[]>({ default: () => [] })

const hasReachedMax = computed(
  () => typeof props.max === 'number' && model.value.length >= props.max,
)
const isInputDisabled = computed(() => props.disabled || hasReachedMax.value)

const chipClass =
  'inline-flex items-center gap-1 rounded-sm bg-brand-subtle py-0.5 pr-1 pl-1.5 text-xs font-medium text-brand-fg'

const inputRef = ref<InstanceType<typeof TagsInputInput>>()
defineExpose({
  /** The underlying native `<input>` element. */
  inputRef: computed(() => inputRef.value?.$el as HTMLInputElement | undefined),
  /** Focus the input. */
  focus: () => (inputRef.value?.$el as HTMLInputElement | undefined)?.focus(),
})
</script>

<template>
  <TagsInputRoot
    :id="id"
    v-model="model"
    :disabled="disabled"
    :max="max"
    add-on-paste
    add-on-tab
    :class="cn(tagInputVariants({ size, invalid }), props.class)"
  >
    <TagsInputItem v-for="tag in model" :key="tag" :value="tag" :class="chipClass">
      <TagsInputItemText />
      <TagsInputItemDelete
        class="inline-flex size-4 items-center justify-center rounded-sm hover:bg-brand/15"
        :aria-label="`Remove ${tag}`"
      >
        <X class="size-3" />
      </TagsInputItemDelete>
    </TagsInputItem>

    <TagsInputInput
      ref="inputRef"
      v-bind="$attrs"
      :placeholder="placeholder"
      :disabled="isInputDisabled"
      :aria-invalid="invalid || undefined"
      class="min-w-16 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted disabled:cursor-not-allowed"
    />
  </TagsInputRoot>
</template>
