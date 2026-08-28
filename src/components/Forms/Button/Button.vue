<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps, useForwardExpose } from 'reka-ui'
import { LoaderCircle } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from '.'

interface Props extends PrimitiveProps {
  /** Visual style. */
  variant?: ButtonVariants['variant']
  /** Control height / density. */
  size?: ButtonVariants['size']
  /** Square, padding-free button sized for a single icon. Requires `aria-label`. */
  iconOnly?: boolean
  /** Show a spinner, set `aria-busy`, and block interaction. */
  loading?: boolean
  /** Native disabled (also implied by `loading`). */
  disabled?: boolean
  /** Native button type. Ignored when rendered `as` a non-button element. */
  type?: 'button' | 'submit' | 'reset'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'primary',
  size: 'md',
  iconOnly: false,
  loading: false,
  disabled: false,
  type: 'button',
})

// Forwards the rendered root element to the parent (template ref / $el).
useForwardExpose()

const isNativeButton = computed(() => props.as === 'button' && !props.asChild)
const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :type="isNativeButton ? type : undefined"
    :disabled="isNativeButton && isDisabled ? true : undefined"
    :aria-disabled="!isNativeButton && isDisabled ? true : undefined"
    :aria-busy="loading || undefined"
    :data-loading="loading ? '' : undefined"
    :class="cn(buttonVariants({ variant, size, iconOnly }), props.class)"
  >
    <LoaderCircle v-if="loading" class="size-4 animate-spin" aria-hidden="true" />
    <slot v-if="!loading" name="leading" />
    <slot v-if="!(loading && iconOnly)" />
    <slot v-if="!loading" name="trailing" />
  </Primitive>
</template>
