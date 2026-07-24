<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { LoaderCircle, Search, X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import type { SearchFilter } from '.'

interface Props {
  /** Active filter chips rendered inside the field. */
  filters?: SearchFilter[]
  placeholder?: string
  disabled?: boolean
  /** Shows a spinner in place of the search icon, for async search-as-you-type. */
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  placeholder: 'Search by resource name or public IP…',
  disabled: false,
  loading: false,
  size: 'md',
})

const emit = defineEmits<{
  /** A filter chip's remove button was clicked. */
  'remove-filter': [id: string]
  /** The clear (×) button was clicked. */
  clear: []
}>()

const model = defineModel<string>({ default: '' })

const inputRef = ref<HTMLInputElement>()
defineExpose({ inputRef, focus: () => inputRef.value?.focus() })

const showClear = computed(() => !!model.value || props.filters.length > 0)
const sizeClass = computed(
  () => ({ sm: 'min-h-8 text-sm', md: 'min-h-10 text-sm', lg: 'min-h-12 text-base' })[props.size],
)

function clearAll() {
  model.value = ''
  emit('clear')
}
</script>

<template>
  <div
    role="search"
    :aria-busy="loading || undefined"
    :class="
      cn(
        'flex w-full flex-wrap items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1 text-fg transition-[border-color,box-shadow] focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25',
        disabled && 'cursor-not-allowed bg-bg opacity-60',
        sizeClass,
        props.class,
      )
    "
  >
    <LoaderCircle
      v-if="loading"
      class="size-4 shrink-0 animate-spin text-fg-muted"
      aria-hidden="true"
    />
    <Search v-else class="size-4 shrink-0 text-fg-muted" aria-hidden="true" />

    <span
      v-for="f in filters"
      :key="f.id"
      class="inline-flex items-center gap-1 rounded-sm bg-brand-subtle py-0.5 pr-1 pl-2 text-xs font-medium text-brand-fg"
    >
      {{ f.label }}
      <button
        type="button"
        class="inline-flex size-4 items-center justify-center rounded-sm hover:bg-brand/15"
        :aria-label="`Remove filter: ${f.label}`"
        @click="emit('remove-filter', f.id)"
      >
        <X class="size-3" />
      </button>
    </span>

    <input
      ref="inputRef"
      v-model="model"
      type="search"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="placeholder"
      class="min-w-24 flex-1 bg-transparent py-1 outline-none placeholder:text-fg-muted [&::-webkit-search-cancel-button]:appearance-none"
    />

    <button
      v-if="showClear"
      type="button"
      class="inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-fg-muted hover:bg-bg-subtle hover:text-fg"
      aria-label="Clear search"
      @click="clearAll"
    >
      <X class="size-4" />
    </button>
  </div>
</template>
