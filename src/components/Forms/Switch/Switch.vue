<script setup lang="ts">
import { computed, useId, useSlots, type HTMLAttributes } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { cn } from '@/lib/utils'
import { switchThumbVariants, switchTrackVariants, type SwitchVariants } from '.'

interface Props {
  size?: SwitchVariants['size']
  disabled?: boolean
  /** Inline label text (or use the default slot). */
  label?: string
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
})

const model = defineModel<boolean>({ default: false })

const slots = useSlots()
const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const hasLabel = computed(() => !!slots.default || !!props.label)
</script>

<template>
  <div class="inline-flex items-center gap-2.5">
    <SwitchRoot
      :id="controlId"
      v-model="model"
      :disabled="disabled"
      :class="cn(switchTrackVariants({ size }), props.class)"
    >
      <SwitchThumb :class="switchThumbVariants({ size })" />
    </SwitchRoot>

    <label
      v-if="hasLabel"
      :for="controlId"
      class="cursor-pointer text-sm text-fg select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
    >
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>
