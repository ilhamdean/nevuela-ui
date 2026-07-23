<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Avatar, avatarVariants, type AvatarVariants } from '../Avatar'
import { Tooltip } from '../Tooltip'
import { avatarGroupItemVariants, type AvatarGroupItem } from '.'

interface Props {
  /** Members to render, most-significant first. */
  avatars: AvatarGroupItem[]
  /** Caps how many avatars render before the rest collapse into a "+N" indicator. Omit to
   * render every avatar. */
  max?: number
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'circle',
})

const visibleAvatars = computed(() =>
  props.max && props.max > 0 ? props.avatars.slice(0, props.max) : props.avatars,
)

const overflowAvatars = computed(() =>
  props.max && props.max > 0 ? props.avatars.slice(props.max) : [],
)

const overflowLabel = computed(() => `${overflowAvatars.value.length} more`)

const overflowTooltip = computed(() =>
  overflowAvatars.value.map((a, i) => a.name || `Member ${(props.max ?? 0) + i + 1}`).join(', '),
)
</script>

<template>
  <div :class="cn('flex items-center', props.class)">
    <span
      v-for="(avatar, i) in visibleAvatars"
      :key="avatar.name ?? i"
      :class="avatarGroupItemVariants({ size, shape })"
    >
      <Avatar
        :src="avatar.src"
        :alt="avatar.alt"
        :name="avatar.name"
        :status="avatar.status"
        :size="size"
        :shape="shape"
      />
    </span>

    <Tooltip v-if="overflowAvatars.length > 0" :content="overflowTooltip">
      <span
        tabindex="0"
        role="img"
        :aria-label="overflowLabel"
        :class="
          cn(
            avatarVariants({ size, shape }),
            avatarGroupItemVariants({ size, shape }),
            'cursor-default font-semibold',
          )
        "
      >
        +{{ overflowAvatars.length }}
      </span>
    </Tooltip>
  </div>
</template>
