<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, useId, type HTMLAttributes } from 'vue'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Button } from '../../Forms/Button'
import { Checkbox } from '../../Forms/Checkbox'
import { EmptyState } from '../EmptyState'
import type { DataTableColumn, DataTableSort } from '.'

type Key = string | number

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn<T>[]
    rows: T[]
    /** Row identity: a property key or a function returning a unique id. */
    rowKey: (keyof T & string) | ((row: T) => Key)
    selectable?: boolean
    loading?: boolean
    /** Number of skeleton rows to show while loading. */
    loadingRows?: number
    emptyText?: string
    /** Skip built-in client-side sorting (the parent sorts `rows` itself). */
    manualSort?: boolean
    /** Reserve a trailing column for the `#row-actions` slot. */
    hasRowActions?: boolean
    /**
     * Rows per page. Omit to disable pagination entirely (default, unchanged
     * behavior). When set, footer pagination controls render.
     */
    pageSize?: number
    /**
     * Total row count across all pages. Provide this for **server-side**
     * pagination, where `rows` is already just the current page's slice —
     * the table renders controls from `total`/`pageSize`/`page` and emits
     * `update:page` for the parent to refetch. Omit for **client-side**
     * pagination, where `rows` holds the full dataset and the table slices
     * it internally.
     */
    total?: number
    /** Options for the rows-per-page selector. */
    pageSizeOptions?: number[]
    class?: HTMLAttributes['class']
  }>(),
  {
    selectable: false,
    loading: false,
    loadingRows: 5,
    emptyText: 'No data to display.',
    manualSort: false,
    hasRowActions: false,
    pageSizeOptions: () => [10, 25, 50, 100],
  },
)

const emit = defineEmits<{
  /** Fired when the user picks a different page size from the footer selector. */
  pageSizeChange: [size: number]
}>()

const sort = defineModel<DataTableSort | null>('sort', { default: null })
const selected = defineModel<Key[]>('selected', { default: () => [] })
/** Current page, 1-indexed. */
const page = defineModel<number>('page', { default: 1 })

function keyOf(row: T): Key {
  return typeof props.rowKey === 'function' ? props.rowKey(row) : (row[props.rowKey] as Key)
}

const sortedRows = computed(() => {
  if (props.manualSort || !sort.value) return props.rows
  const { key, direction } = sort.value
  const dir = direction === 'asc' ? 1 : -1
  return [...props.rows].sort((a, b) => {
    const av = a[key as keyof T]
    const bv = b[key as keyof T]
    if (av == null) return 1
    if (bv == null) return -1
    if (av < bv) return -dir
    if (av > bv) return dir
    return 0
  })
})

function toggleSort(col: DataTableColumn<T>) {
  if (!col.sortable) return
  const key = String(col.key)
  sort.value =
    sort.value?.key === key
      ? { key, direction: sort.value.direction === 'asc' ? 'desc' : 'asc' }
      : { key, direction: 'asc' }
}

function ariaSort(col: DataTableColumn<T>): 'ascending' | 'descending' | 'none' | undefined {
  if (!col.sortable) return undefined
  if (sort.value?.key !== String(col.key)) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

// Pagination — enabled purely by presence of `pageSize`. `total` distinguishes
// server-side (rows already sliced) from client-side (slice `rows` here).
const paginationEnabled = computed(() => typeof props.pageSize === 'number' && props.pageSize > 0)
const isServerPaginated = computed(() => props.total != null)
const totalItems = computed(() =>
  isServerPaginated.value ? (props.total ?? 0) : props.rows.length,
)
const totalPages = computed(() =>
  paginationEnabled.value ? Math.max(1, Math.ceil(totalItems.value / (props.pageSize ?? 1))) : 1,
)
const currentPage = computed(() =>
  paginationEnabled.value ? Math.min(Math.max(page.value, 1), totalPages.value) : 1,
)
const startRow = computed(() =>
  totalItems.value === 0 ? 0 : (currentPage.value - 1) * (props.pageSize ?? 0) + 1,
)
const endRow = computed(() => Math.min(currentPage.value * (props.pageSize ?? 0), totalItems.value))
const canGoPrev = computed(() => paginationEnabled.value && currentPage.value > 1)
const canGoNext = computed(() => paginationEnabled.value && currentPage.value < totalPages.value)

const pagedRows = computed(() => {
  if (!paginationEnabled.value || isServerPaginated.value) return sortedRows.value
  const start = (currentPage.value - 1) * (props.pageSize ?? 0)
  return sortedRows.value.slice(start, start + (props.pageSize ?? 0))
})

function goToPage(target: number) {
  if (!paginationEnabled.value) return
  const clamped = Math.min(Math.max(target, 1), totalPages.value)
  if (clamped !== page.value) page.value = clamped
}
function prevPage() {
  goToPage(currentPage.value - 1)
}
function nextPage() {
  goToPage(currentPage.value + 1)
}
function onPageSizeChange(event: Event) {
  const size = Number((event.target as HTMLSelectElement).value)
  emit('pageSizeChange', size)
  if (page.value !== 1) page.value = 1
}

const pageSizeId = useId()

const allKeys = computed(() => pagedRows.value.map(keyOf))
const selectAllState = computed<boolean | 'indeterminate'>(() => {
  if (selected.value.length === 0) return false
  const set = new Set(selected.value)
  return allKeys.value.every((k) => set.has(k)) ? true : 'indeterminate'
})
function toggleAll(v: boolean | 'indeterminate') {
  selected.value = v === true ? [...allKeys.value] : []
}
function isSelected(row: T) {
  return selected.value.includes(keyOf(row))
}
function toggleRow(row: T, v: boolean | 'indeterminate') {
  const k = keyOf(row)
  selected.value =
    v === true ? [...new Set([...selected.value, k])] : selected.value.filter((x) => x !== k)
}

const alignClass = (a?: string) =>
  a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left'
const totalCols = computed(
  () => props.columns.length + (props.selectable ? 1 : 0) + (props.hasRowActions ? 1 : 0),
)
</script>

<template>
  <div :class="cn('overflow-x-auto rounded-xl border border-border bg-surface', props.class)">
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b border-border">
          <th v-if="selectable" scope="col" class="w-10 px-3 py-2.5">
            <Checkbox
              :model-value="selectAllState"
              aria-label="Select all rows"
              @update:model-value="toggleAll"
            />
          </th>
          <th
            v-for="col in columns"
            :key="String(col.key)"
            scope="col"
            :aria-sort="ariaSort(col)"
            :style="col.width ? { width: col.width } : undefined"
            :class="
              cn(
                'px-3 py-2.5 text-xs font-semibold text-fg-subtle',
                alignClass(col.align),
                col.class,
              )
            "
          >
            <slot :name="`header-${String(col.key)}`" :column="col">
              <button
                v-if="col.sortable"
                type="button"
                class="group inline-flex items-center gap-1 hover:text-fg"
                @click="toggleSort(col)"
              >
                {{ col.label }}
                <ArrowUp v-if="ariaSort(col) === 'ascending'" class="size-3.5" aria-hidden="true" />
                <ArrowDown
                  v-else-if="ariaSort(col) === 'descending'"
                  class="size-3.5"
                  aria-hidden="true"
                />
                <ChevronsUpDown
                  v-else
                  class="size-3.5 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
              <span v-else>{{ col.label }}</span>
            </slot>
          </th>
          <th v-if="hasRowActions" scope="col" class="w-12 px-3 py-2.5">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- Loading skeleton -->
        <template v-if="loading">
          <tr
            v-for="i in loadingRows"
            :key="`skeleton-${i}`"
            class="border-b border-border last:border-0"
          >
            <td v-if="selectable" class="px-3 py-3">
              <div class="size-5 animate-pulse rounded-sm bg-bg-subtle" />
            </td>
            <td v-for="col in columns" :key="String(col.key)" class="px-3 py-3">
              <div
                class="h-4 animate-pulse rounded bg-bg-subtle"
                :style="{ width: `${40 + ((i * 37 + String(col.key).length * 13) % 50)}%` }"
              />
            </td>
            <td v-if="hasRowActions" class="px-3 py-3">
              <div class="ml-auto size-5 animate-pulse rounded-sm bg-bg-subtle" />
            </td>
          </tr>
        </template>

        <!-- Empty -->
        <tr v-else-if="pagedRows.length === 0">
          <td :colspan="totalCols" class="p-0">
            <slot name="empty">
              <EmptyState :title="emptyText" :bordered="false" />
            </slot>
          </td>
        </tr>

        <!-- Rows -->
        <template v-else>
          <tr
            v-for="row in pagedRows"
            :key="keyOf(row)"
            :data-selected="isSelected(row) || undefined"
            class="border-b border-border transition-colors last:border-0 hover:bg-bg-subtle/60 data-[selected]:bg-brand-subtle/50"
          >
            <td v-if="selectable" class="px-3 py-3">
              <Checkbox
                :model-value="isSelected(row)"
                aria-label="Select row"
                @update:model-value="(v) => toggleRow(row, v)"
              />
            </td>
            <td
              v-for="col in columns"
              :key="String(col.key)"
              :class="cn('px-3 py-3 text-fg', alignClass(col.align), col.class)"
            >
              <slot :name="`cell-${String(col.key)}`" :row="row" :value="row[col.key as keyof T]">
                {{ row[col.key as keyof T] }}
              </slot>
            </td>
            <td v-if="hasRowActions" class="px-3 py-3 text-right">
              <slot name="row-actions" :row="row" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div
      v-if="paginationEnabled"
      class="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2.5 text-sm text-fg-subtle"
    >
      <div class="flex items-center gap-2">
        <label :for="pageSizeId" class="text-xs">Rows per page</label>
        <select
          :id="pageSizeId"
          class="h-8 rounded-sm border border-border bg-surface px-2 text-sm text-fg outline-none transition-[color,border-color,box-shadow] duration-150 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25"
          :value="pageSize"
          @change="onPageSizeChange"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>

      <div class="flex items-center gap-3">
        <span aria-live="polite">
          Page {{ currentPage }} of {{ totalPages }}
          <span class="hidden text-fg-muted sm:inline"
            >&middot; {{ startRow }}&ndash;{{ endRow }} of {{ totalItems }}</span
          >
        </span>
        <div class="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            icon-only
            aria-label="Previous page"
            :disabled="!canGoPrev"
            @click="prevPage"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon-only
            aria-label="Next page"
            :disabled="!canGoNext"
            @click="nextPage"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
