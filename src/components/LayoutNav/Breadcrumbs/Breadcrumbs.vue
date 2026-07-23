<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { ChevronRight } from '@lucide/vue'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem } from '.'

interface Props {
  items: BreadcrumbItem[]
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const isLast = (i: number) => i === props.items.length - 1
</script>

<template>
  <nav aria-label="Breadcrumb" :class="props.class">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm">
      <li v-for="(item, i) in items" :key="i" class="flex items-center gap-1.5">
        <a
          v-if="item.href && !isLast(i)"
          :href="item.href"
          class="inline-flex items-center gap-1 text-fg-subtle transition-colors hover:text-brand"
        >
          <component :is="item.icon" v-if="item.icon" class="size-4" aria-hidden="true" />
          {{ item.label }}
        </a>
        <span
          v-else
          :aria-current="isLast(i) ? 'page' : undefined"
          :class="
            cn(
              'inline-flex items-center gap-1',
              isLast(i) ? 'font-medium text-fg' : 'text-fg-subtle',
            )
          "
        >
          <component :is="item.icon" v-if="item.icon" class="size-4" aria-hidden="true" />
          {{ item.label }}
        </span>

        <ChevronRight v-if="!isLast(i)" class="size-4 text-fg-muted" aria-hidden="true" />
      </li>
    </ol>
  </nav>
</template>
