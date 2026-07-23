<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { inputGroupAddonVariants } from '.'

interface Props {
  /**
   * Controls ONLY the height/padding/font-size of the plain-text addons
   * (`leadingText`/`trailingText`). This does not resize slotted children —
   * give any slotted TextInput/Select/etc. the same `size` yourself so the
   * heights line up at the seams.
   */
  size?: 'sm' | 'md' | 'lg'
  /** Tints the plain-text addons' border red to flag a validation error. */
  invalid?: boolean
  /** Dims the plain-text addons to match a disabled group of controls. */
  disabled?: boolean
  /** Static text addon rendered before the slot content, e.g. `"https://"`. */
  leadingText?: string
  /** Static text addon rendered after the slot content, e.g. `".example.com"`. */
  trailingText?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  invalid: false,
  disabled: false,
  leadingText: undefined,
  trailingText: undefined,
  class: undefined,
})

/**
 * The join technique: no border of its own on the row — each child keeps its
 * own border, and the seams are hidden by overlapping them (`-ml-px`),
 * stripping the radius at internal edges, and raising the focused child
 * above its neighbors so its focus ring isn't clipped.
 */
const SEAM_JOIN_CLASSES =
  '[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*]:relative [&>*:focus-within]:z-10'
</script>

<template>
  <div :class="cn('flex w-full', SEAM_JOIN_CLASSES, props.class)">
    <span
      v-if="leadingText"
      :class="
        inputGroupAddonVariants({
          size: props.size,
          invalid: props.invalid,
          disabled: props.disabled,
        })
      "
    >
      {{ leadingText }}
    </span>
    <slot />
    <span
      v-if="trailingText"
      :class="
        inputGroupAddonVariants({
          size: props.size,
          invalid: props.invalid,
          disabled: props.disabled,
        })
      "
    >
      {{ trailingText }}
    </span>
  </div>
</template>
