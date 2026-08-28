<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { User } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Skeleton } from '../Skeleton'
import {
  avatarStatusDotVariants,
  avatarStatusStyles,
  avatarVariants,
  type AvatarStatus,
  type AvatarVariants,
} from '.'

interface Props {
  src?: string
  /** Alt text for the image (defaults to `name`). */
  alt?: string
  /** Used to derive initials for the fallback. */
  name?: string
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
  /** Presence status shown as a corner dot. Omit for no dot. */
  status?: AvatarStatus
  /** Shows a skeleton circle instead of the image/fallback. */
  loading?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'circle',
})

const initials = computed(() => {
  if (!props.name) return ''
  return props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})

const statusStyle = computed(() => (props.status ? avatarStatusStyles[props.status] : undefined))
</script>

<template>
  <span
    v-if="loading"
    role="img"
    :aria-label="name ? `Loading ${name}` : 'Loading avatar'"
    :class="cn(avatarVariants({ size, shape }), props.class)"
  >
    <Skeleton class="size-full rounded-[inherit]" />
  </span>

  <!--
    Wrapped in a plain `relative` span (rather than putting the dot inside
    AvatarRoot) so the corner dot isn't clipped by AvatarRoot's own
    `overflow-hidden` (needed to mask the image/fallback into the shape).
  -->
  <span v-else class="relative inline-flex shrink-0">
    <AvatarRoot :class="cn(avatarVariants({ size, shape }), props.class)">
      <AvatarImage v-if="src" :src="src" :alt="alt ?? name" class="size-full object-cover" />
      <AvatarFallback :delay-ms="src ? 200 : 0" class="flex size-full items-center justify-center">
        <slot name="fallback">
          <span v-if="initials">{{ initials }}</span>
          <User v-else class="size-1/2" aria-hidden="true" />
        </slot>
      </AvatarFallback>
    </AvatarRoot>

    <span
      v-if="statusStyle"
      :class="cn(avatarStatusDotVariants({ size }), statusStyle.dot)"
      aria-hidden="true"
    />
    <span v-if="statusStyle" class="sr-only">{{ statusStyle.label }}</span>
  </span>
</template>
