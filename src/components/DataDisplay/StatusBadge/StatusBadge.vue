<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { statusBadgeVariants, statusStyles, type StatusBadgeVariants, type StatusKind } from '.'

interface Props {
  /** Semantic status — drives the color. */
  status?: StatusKind
  /** `dot` = colored dot + neutral text; `subtle` = tinted pill. */
  variant?: StatusBadgeVariants['variant']
  size?: StatusBadgeVariants['size']
  /** Text label. Alternatively use the default slot. */
  label?: string
  /** Show the leading status dot. */
  dot?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  status: 'active',
  variant: 'dot',
  size: 'md',
  dot: true,
})

const styles = computed(() => statusStyles[props.status])
const dotSize = computed(() => (props.size === 'sm' ? 'size-1.5' : 'size-2'))
</script>

<template>
  <span
    :data-status="status"
    :class="
      cn(
        statusBadgeVariants({ variant, size }),
        variant === 'subtle' && [styles.subtleBg, styles.text],
        props.class,
      )
    "
  >
    <span v-if="dot" :class="cn('shrink-0 rounded-full', dotSize, styles.dot)" aria-hidden="true" />
    <slot>{{ label }}</slot>
  </span>
</template>
