<script setup lang="ts">
import { computed, useId, useSlots, type HTMLAttributes } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { LoaderCircle } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { switchThumbVariants, switchTrackVariants, type SwitchVariants } from '.'

interface Props {
  size?: SwitchVariants['size']
  disabled?: boolean
  /** Shows a spinner over the thumb, sets `aria-busy`, and blocks toggling. */
  loading?: boolean
  /** Marks the field invalid: status-error ring + `aria-invalid`. Pair with a FormField error. */
  invalid?: boolean
  /** Inline label text (or use the default slot). */
  label?: string
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  loading: false,
  invalid: false,
})

const model = defineModel<boolean>({ default: false })

const slots = useSlots()
const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const hasLabel = computed(() => !!slots.default || !!props.label)
const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <div class="inline-flex items-center gap-2.5">
    <SwitchRoot
      :id="controlId"
      v-model="model"
      :disabled="isDisabled"
      :aria-invalid="invalid || undefined"
      :aria-busy="loading || undefined"
      :class="cn(switchTrackVariants({ size, invalid }), props.class)"
    >
      <SwitchThumb :class="switchThumbVariants({ size })">
        <LoaderCircle
          v-if="loading"
          class="size-full animate-spin text-fg-muted"
          aria-hidden="true"
        />
      </SwitchThumb>
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
