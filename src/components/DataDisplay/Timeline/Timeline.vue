<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { statusStyles } from '../StatusBadge'
import { Avatar } from '../Avatar'
import { Skeleton } from '../Skeleton'
import type { TimelineItem } from '.'

interface Props {
  items: TimelineItem[]
  /** Renders 3 skeleton rows instead of `items`. */
  loading?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>

<template>
  <ol :aria-busy="loading || undefined" :class="cn('flex flex-col', props.class)">
    <!-- Loading skeleton: 3 placeholder rows, connector line between all but the last. -->
    <template v-if="loading">
      <li
        v-for="n in 3"
        :key="`skeleton-${n}`"
        class="relative flex gap-3"
        :class="n !== 3 && 'pb-6'"
      >
        <Skeleton class="relative z-10 size-6 shrink-0 rounded-full" />
        <span
          v-if="n !== 3"
          class="absolute top-6 bottom-0 left-3 w-px bg-border"
          aria-hidden="true"
        />
        <div class="min-w-0 flex-1 space-y-2 pt-0.5">
          <Skeleton class="h-3.5 w-40" />
          <Skeleton class="h-3 w-56" />
          <Skeleton class="h-2.5 w-24" />
        </div>
      </li>
    </template>

    <!-- Real rows: connector line spans this row's dot to the next row's dot; the
         last item renders no line and no trailing gap. -->
    <template v-else>
      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="relative flex gap-3"
        :class="index !== items.length - 1 && 'pb-6'"
      >
        <span
          class="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full"
          :class="item.icon && statusStyles[item.status ?? 'info'].subtleBg"
        >
          <component
            :is="item.icon"
            v-if="item.icon"
            class="size-3.5"
            :class="statusStyles[item.status ?? 'info'].text"
            aria-hidden="true"
          />
          <span
            v-else
            class="size-2.5 rounded-full"
            :class="statusStyles[item.status ?? 'info'].dot"
            aria-hidden="true"
          />
        </span>

        <span
          v-if="index !== items.length - 1"
          class="absolute top-6 bottom-0 left-3 w-px bg-border"
          aria-hidden="true"
        />

        <div class="min-w-0 flex-1 pb-1">
          <p class="text-sm font-medium text-fg">{{ item.title }}</p>
          <p v-if="item.description" class="mt-0.5 text-sm text-fg-subtle">
            {{ item.description }}
          </p>
          <div class="mt-1.5 flex items-center gap-1.5">
            <template v-if="item.actor">
              <Avatar :name="item.actor.name" :src="item.actor.imageUrl" size="xs" />
              <span class="text-xs font-medium text-fg-subtle">{{ item.actor.name }}</span>
              <span class="text-fg-muted" aria-hidden="true">·</span>
            </template>
            <time class="text-xs text-fg-muted">{{ item.timestamp }}</time>
          </div>
        </div>
      </li>
    </template>
  </ol>
</template>
