<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { Check, ChevronDown, LoaderCircle, X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import {
  selectTriggerVariants,
  type SelectOption,
  type SelectOptionGroup,
  type SelectOptionsProp,
  type SelectVariants,
} from '.'

interface Props {
  /** Options to render — a flat list, or an array of `{ label, options }` groups. Omit and use the default slot for custom items. */
  options?: SelectOptionsProp
  placeholder?: string
  size?: SelectVariants['size']
  invalid?: boolean
  disabled?: boolean
  id?: string
  /** Allow selecting more than one option. Switches the model to `string[]`. */
  multiple?: boolean
  /** Add a text filter inside the popover to search options by label (case-insensitive). */
  searchable?: boolean
  /** Show a small "×" button in the trigger to reset the selection when a value is set. */
  clearable?: boolean
  /** Async-populated options: shows a spinner in the trigger and skeleton rows in the popover. */
  loading?: boolean
  /** Placeholder for the filter input when `searchable` is set. */
  searchPlaceholder?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  size: 'md',
  invalid: false,
  disabled: false,
  placeholder: 'Select…',
  multiple: false,
  searchable: false,
  clearable: false,
  loading: false,
  searchPlaceholder: 'Search…',
})

/** Selected value(s) — `string` normally, `string[]` when `multiple` is set. */
const model = defineModel<string | string[]>()

const CHIP_DISPLAY_LIMIT = 3

function isGroupedOptions(opts: SelectOptionsProp): opts is SelectOptionGroup[] {
  return opts.length > 0 && 'options' in opts[0]
}

/** Options normalized to a list of groups — ungrouped input becomes a single unlabeled group. */
const normalizedGroups = computed<{ label?: string; options: SelectOption[] }[]>(() => {
  if (!props.options.length) return []
  return isGroupedOptions(props.options) ? props.options : [{ options: props.options }]
})

const flatOptions = computed<SelectOption[]>(() =>
  normalizedGroups.value.flatMap((group) => group.options),
)

const selectedValues = computed<string[]>(() => {
  if (Array.isArray(model.value)) return model.value
  return model.value ? [model.value] : []
})

const selectedOptions = computed<SelectOption[]>(() =>
  selectedValues.value.map(
    (value) => flatOptions.value.find((opt) => opt.value === value) ?? { value, label: value },
  ),
)

const hasValue = computed(() => selectedValues.value.length > 0)
const showChipSummary = computed(() => selectedOptions.value.length > CHIP_DISPLAY_LIMIT)

const isDisabled = computed(() => props.disabled || props.loading)

/** Extra classes so the trigger can grow to a second line for wrapped multi-select chips. */
const multiSizeClass = computed(() => {
  if (!props.multiple) return ''
  return { sm: 'h-auto min-h-8 py-1', md: 'h-auto min-h-10 py-1.5', lg: 'h-auto min-h-12 py-2' }[
    props.size ?? 'md'
  ]
})

function clearSelection() {
  model.value = props.multiple ? [] : undefined
}

function removeValue(value: string) {
  if (!Array.isArray(model.value)) return
  model.value = model.value.filter((v) => v !== value)
}

function displayValue(value: unknown): string {
  return flatOptions.value.find((opt) => opt.value === value)?.label ?? ''
}

const itemClass =
  'relative flex cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-brand-subtle data-[highlighted]:text-brand data-[state=checked]:font-medium'
const groupLabelClass = 'px-2 py-1.5 text-2xs font-semibold tracking-wide text-fg-muted uppercase'
const chipClass =
  'inline-flex items-center gap-1 rounded-sm bg-brand-subtle py-0.5 pr-1 pl-1.5 text-xs font-medium text-brand'
</script>

<template>
  <!-- Searchable / combobox variant -->
  <ComboboxRoot
    v-if="searchable"
    v-model="model"
    :multiple="multiple"
    :disabled="isDisabled"
    :reset-model-value-on-clear="clearable"
  >
    <ComboboxAnchor
      :class="
        cn(
          selectTriggerVariants({ size, invalid }),
          multiSizeClass,
          'flex-wrap gap-1.5',
          props.class,
        )
      "
    >
      <template v-if="multiple">
        <span v-if="!hasValue" class="truncate text-fg-muted">{{ placeholder }}</span>
        <span v-else-if="showChipSummary" :class="chipClass"
          >{{ selectedOptions.length }} selected</span
        >
        <template v-else>
          <span v-for="opt in selectedOptions" :key="opt.value" :class="chipClass">
            {{ opt.label }}
            <button
              type="button"
              class="inline-flex size-4 items-center justify-center rounded-sm hover:bg-brand/15"
              :aria-label="`Remove ${opt.label}`"
              @click.stop="removeValue(opt.value)"
            >
              <X class="size-3" />
            </button>
          </span>
        </template>
      </template>

      <ComboboxInput
        :id="id"
        :placeholder="multiple ? (hasValue ? searchPlaceholder : placeholder) : placeholder"
        :display-value="multiple ? undefined : displayValue"
        :disabled="isDisabled"
        :aria-invalid="invalid || undefined"
        :aria-label="multiple ? searchPlaceholder : undefined"
        class="min-w-16 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-muted"
      />

      <button
        v-if="clearable && hasValue && !loading"
        type="button"
        class="inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-fg-muted hover:bg-bg-subtle hover:text-fg"
        aria-label="Clear selection"
        @click.stop="clearSelection"
      >
        <X class="size-4" />
      </button>

      <LoaderCircle
        v-if="loading"
        class="size-4 shrink-0 animate-spin text-fg-muted"
        aria-hidden="true"
      />
      <ComboboxTrigger
        v-else
        class="inline-flex size-5 shrink-0 items-center justify-center"
        aria-label="Toggle options"
      >
        <ChevronDown class="size-4 text-fg-muted" aria-hidden="true" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        position="popper"
        :side-offset="4"
        class="z-50 max-h-72 min-w-[var(--reka-combobox-trigger-width)] overflow-hidden rounded-md border border-border bg-surface text-fg shadow-md"
      >
        <ComboboxViewport class="p-1">
          <div v-if="loading" class="flex flex-col gap-1 p-1" aria-hidden="true">
            <div v-for="n in 3" :key="n" class="h-8 animate-pulse rounded-sm bg-bg-subtle" />
          </div>
          <template v-else>
            <ComboboxEmpty class="px-2 py-6 text-center text-sm text-fg-muted"
              >No results found.</ComboboxEmpty
            >
            <template v-for="(group, gi) in normalizedGroups" :key="group.label ?? gi">
              <ComboboxGroup v-if="group.label">
                <ComboboxLabel :class="groupLabelClass">{{ group.label }}</ComboboxLabel>
                <ComboboxItem
                  v-for="opt in group.options"
                  :key="opt.value"
                  :value="opt.value"
                  :text-value="opt.label"
                  :disabled="opt.disabled"
                  :class="itemClass"
                >
                  <ComboboxItemIndicator
                    class="absolute right-2 inline-flex items-center text-brand"
                  >
                    <Check class="size-4" />
                  </ComboboxItemIndicator>
                  {{ opt.label }}
                </ComboboxItem>
              </ComboboxGroup>
              <template v-else>
                <ComboboxItem
                  v-for="opt in group.options"
                  :key="opt.value"
                  :value="opt.value"
                  :text-value="opt.label"
                  :disabled="opt.disabled"
                  :class="itemClass"
                >
                  <ComboboxItemIndicator
                    class="absolute right-2 inline-flex items-center text-brand"
                  >
                    <Check class="size-4" />
                  </ComboboxItemIndicator>
                  {{ opt.label }}
                </ComboboxItem>
              </template>
            </template>
          </template>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>

  <!-- Default (non-searchable) variant -->
  <SelectRoot v-else v-model="model" :multiple="multiple" :disabled="isDisabled">
    <div class="relative">
      <SelectTrigger
        :id="id"
        :aria-invalid="invalid || undefined"
        :aria-busy="loading || undefined"
        :class="
          cn(
            selectTriggerVariants({ size, invalid }),
            multiSizeClass,
            clearable && hasValue && 'pr-14',
            props.class,
          )
        "
      >
        <SelectValue :placeholder="placeholder" class="min-w-0 flex-1 truncate text-left">
          <template v-if="multiple" #default>
            <span v-if="!hasValue" class="truncate">{{ placeholder }}</span>
            <span v-else-if="showChipSummary" :class="chipClass"
              >{{ selectedOptions.length }} selected</span
            >
            <span v-else class="flex flex-wrap items-center gap-1">
              <span v-for="opt in selectedOptions" :key="opt.value" :class="chipClass">{{
                opt.label
              }}</span>
            </span>
          </template>
        </SelectValue>
        <LoaderCircle
          v-if="loading"
          class="size-4 shrink-0 animate-spin text-fg-muted"
          aria-hidden="true"
        />
        <SelectIcon v-else as-child>
          <ChevronDown class="size-4 shrink-0 text-fg-muted" aria-hidden="true" />
        </SelectIcon>
      </SelectTrigger>

      <button
        v-if="clearable && hasValue && !isDisabled"
        type="button"
        class="absolute top-1/2 right-8 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-fg-muted hover:bg-bg-subtle hover:text-fg"
        aria-label="Clear selection"
        @click="clearSelection"
      >
        <X class="size-4" />
      </button>
    </div>

    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="4"
        class="z-50 max-h-72 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-border bg-surface text-fg shadow-md"
      >
        <SelectViewport class="p-1">
          <div v-if="loading" class="flex flex-col gap-1 p-1" aria-hidden="true">
            <div v-for="n in 3" :key="n" class="h-8 animate-pulse rounded-sm bg-bg-subtle" />
          </div>
          <slot v-else>
            <template v-for="(group, gi) in normalizedGroups" :key="group.label ?? gi">
              <SelectGroup v-if="group.label">
                <SelectLabel :class="groupLabelClass">{{ group.label }}</SelectLabel>
                <SelectItem
                  v-for="opt in group.options"
                  :key="opt.value"
                  :value="opt.value"
                  :disabled="opt.disabled"
                  :class="itemClass"
                >
                  <SelectItemText>{{ opt.label }}</SelectItemText>
                  <SelectItemIndicator class="absolute right-2 inline-flex items-center text-brand">
                    <Check class="size-4" />
                  </SelectItemIndicator>
                </SelectItem>
              </SelectGroup>
              <template v-else>
                <SelectItem
                  v-for="opt in group.options"
                  :key="opt.value"
                  :value="opt.value"
                  :disabled="opt.disabled"
                  :class="itemClass"
                >
                  <SelectItemText>{{ opt.label }}</SelectItemText>
                  <SelectItemIndicator class="absolute right-2 inline-flex items-center text-brand">
                    <Check class="size-4" />
                  </SelectItemIndicator>
                </SelectItem>
              </template>
            </template>
          </slot>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
