<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { User } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { avatarVariants, type AvatarVariants } from '.'

interface Props {
  src?: string
  /** Alt text for the image (defaults to `name`). */
  alt?: string
  /** Used to derive initials for the fallback. */
  name?: string
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
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
</script>

<template>
  <AvatarRoot :class="cn(avatarVariants({ size, shape }), props.class)">
    <AvatarImage v-if="src" :src="src" :alt="alt ?? name" class="size-full object-cover" />
    <AvatarFallback :delay-ms="src ? 200 : 0" class="flex size-full items-center justify-center">
      <slot name="fallback">
        <span v-if="initials">{{ initials }}</span>
        <User v-else class="size-1/2" aria-hidden="true" />
      </slot>
    </AvatarFallback>
  </AvatarRoot>
</template>
