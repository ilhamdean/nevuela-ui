<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { CopyableField } from '../CopyableField'
import { Skeleton } from '../Skeleton'
import type { DescriptionItem } from '.'

interface Props {
  items: DescriptionItem[]
  /** Grid column count at the `md:` breakpoint. Always 1 column below that. */
  columns?: 1 | 2 | 3
  /** Renders Skeleton placeholders in place of each term/value while data loads. */
  loading?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  columns: 2,
  loading: false,
})

/** Keys the per-item slot: "Public IP" -> "item-public-ip". */
function slug(term: string) {
  return term.toLowerCase().trim().replace(/\s+/g, '-')
}

function itemSlot(item: DescriptionItem) {
  return `item-${slug(item.term)}`
}

const gridClass = computed(() => {
  if (props.columns === 1) return 'grid-cols-1'
  if (props.columns === 3) return 'grid-cols-1 md:grid-cols-3'
  return 'grid-cols-1 md:grid-cols-2'
})

// `span: 2` always means "take the full row" — in a 2-column grid that's
// col-span-2; in a 3-column grid it's still col-span-2 (two of three), since
// `span` only ever has the two values 1 | 2. A 1-column grid is already full
// width, so no span class is needed there.
function spanClass(item: DescriptionItem) {
  return item.span === 2 && props.columns > 1 ? 'md:col-span-2' : ''
}

function displayValue(item: DescriptionItem) {
  return item.value ?? ''
}
</script>

<template>
  <dl :class="cn('grid gap-x-6 gap-y-4', gridClass, props.class)" :aria-busy="loading || undefined">
    <div
      v-for="(item, index) in items"
      :key="`${item.term}-${index}`"
      :class="cn('min-w-0', spanClass(item))"
    >
      <dt class="text-xs font-medium text-fg-subtle">
        <Skeleton v-if="loading" class="h-3 w-20" />
        <template v-else>{{ item.term }}</template>
      </dt>

      <dd class="mt-0.5 text-sm text-fg">
        <Skeleton v-if="loading" class="mt-0.5 h-4 w-32" />
        <slot v-else :name="itemSlot(item)" :item="item">
          <CopyableField v-if="item.copyable" :value="String(displayValue(item))" size="sm" />
          <span v-else>{{ displayValue(item) }}</span>
        </slot>
      </dd>
    </div>
  </dl>
</template>
