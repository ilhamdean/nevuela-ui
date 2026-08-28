<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { textareaVariants, type TextareaVariants } from '.'

defineOptions({ inheritAttrs: false })

interface Props {
  invalid?: boolean
  disabled?: boolean
  /** Resize behaviour. */
  resize?: TextareaVariants['resize']
  rows?: number
  placeholder?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  invalid: false,
  disabled: false,
  resize: 'vertical',
  rows: 4,
})

const model = defineModel<string>()

const textareaRef = ref<HTMLTextAreaElement>()
defineExpose({
  textareaRef,
  focus: () => textareaRef.value?.focus(),
})
</script>

<template>
  <textarea
    ref="textareaRef"
    v-model="model"
    v-bind="$attrs"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :aria-invalid="invalid || undefined"
    :class="cn(textareaVariants({ invalid, resize }), props.class)"
  />
</template>
