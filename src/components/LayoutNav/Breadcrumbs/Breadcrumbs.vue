<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { ChevronRight, MoreHorizontal } from '@lucide/vue'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem } from '.'

interface Props {
  items: BreadcrumbItem[]
  /**
   * Collapse the middle of long trails into a single "…" item once the trail
   * exceeds this many entries. The first and last items are always shown.
   * Set to `0`/`Infinity` to disable collapsing.
   */
  maxItems?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  maxItems: 4,
})

/** Expanding reveals the full trail in place, replacing the "…" item. */
const expanded = ref(false)

const isCollapsible = computed(() => props.maxItems > 0 && props.items.length > props.maxItems)

interface RenderEntry {
  key: string
  item?: BreadcrumbItem
  ellipsis?: true
}

const entries = computed<RenderEntry[]>(() => {
  if (!isCollapsible.value || expanded.value) {
    return props.items.map((item, i) => ({ key: String(i), item }))
  }

  // Always keep the first and a run of trailing items visible; collapse
  // whatever falls between them behind a single "…" entry.
  const tailCount = Math.max(props.maxItems - 2, 1)
  const tailStart = props.items.length - tailCount
  const hiddenCount = tailStart - 1

  const result: RenderEntry[] = [{ key: '0', item: props.items[0] }]
  if (hiddenCount > 0) result.push({ key: 'ellipsis', ellipsis: true })
  for (let i = tailStart; i < props.items.length; i++) {
    result.push({ key: String(i), item: props.items[i] })
  }
  return result
})

const visibleItemCount = computed(() => entries.value.filter((e) => e.item).length)
const hiddenCount = computed(() => props.items.length - visibleItemCount.value)
</script>

<template>
  <nav aria-label="Breadcrumb" :class="props.class">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm">
      <li v-for="(entry, i) in entries" :key="entry.key" class="flex items-center gap-1.5">
        <button
          v-if="entry.ellipsis"
          type="button"
          :aria-label="`Show ${hiddenCount} hidden breadcrumb${hiddenCount === 1 ? '' : 's'}`"
          :aria-expanded="expanded"
          class="inline-flex size-6 items-center justify-center rounded-sm text-fg-subtle transition-colors hover:bg-bg-subtle hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:outline-none"
          @click="expanded = true"
        >
          <MoreHorizontal class="size-4" aria-hidden="true" />
        </button>

        <template v-else-if="entry.item">
          <a
            v-if="entry.item.href && i < entries.length - 1"
            :href="entry.item.href"
            class="inline-flex items-center gap-1 text-fg-subtle transition-colors hover:text-brand"
          >
            <component
              :is="entry.item.icon"
              v-if="entry.item.icon"
              class="size-4"
              aria-hidden="true"
            />
            {{ entry.item.label }}
          </a>
          <span
            v-else
            :aria-current="i === entries.length - 1 ? 'page' : undefined"
            :class="
              cn(
                'inline-flex items-center gap-1',
                i === entries.length - 1 ? 'font-medium text-fg' : 'text-fg-subtle',
              )
            "
          >
            <component
              :is="entry.item.icon"
              v-if="entry.item.icon"
              class="size-4"
              aria-hidden="true"
            />
            {{ entry.item.label }}
          </span>
        </template>

        <ChevronRight
          v-if="i < entries.length - 1"
          class="size-4 text-fg-muted"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>
