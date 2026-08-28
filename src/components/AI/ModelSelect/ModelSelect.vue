<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import {
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
import { Check, ChevronDown, Sparkles } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Badge } from '../../DataDisplay/Badge'
import { modelSelectTriggerVariants, type ModelOption, type ModelSelectVariants } from '.'

interface Props {
  models: ModelOption[]
  /** Group the list under provider headings. Ignored for models with no `provider`. */
  groupByProvider?: boolean
  /** Show context window / price metadata on each row. */
  showMeta?: boolean
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  size?: ModelSelectVariants['size']
  /** Associates the trigger with a `FormField` label. */
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  groupByProvider: true,
  showMeta: true,
  placeholder: 'Select a model',
  disabled: false,
  invalid: false,
  size: 'md',
  id: undefined,
})

/** Selected model id. */
const model = defineModel<string>()

const selected = computed(() => props.models.find((m) => m.value === model.value))

/** "200000" reads as noise in a dropdown row; "200K" is the number people actually compare. */
function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 ? 1 : 0)}M`
  if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}K`
  return String(tokens)
}

/** Groups in first-seen order, so the caller's ordering is the one shown. */
const groups = computed(() => {
  if (!props.groupByProvider) return [{ provider: undefined, models: props.models }]
  const byProvider = new Map<string | undefined, ModelOption[]>()
  for (const m of props.models) {
    const key = m.provider
    const bucket = byProvider.get(key)
    if (bucket) bucket.push(m)
    else byProvider.set(key, [m])
  }
  return [...byProvider].map(([provider, models]) => ({ provider, models }))
})

const itemClass = cn(
  'relative flex w-full cursor-pointer items-start gap-2 rounded-sm py-2 pr-9 pl-2 text-sm text-fg outline-none select-none',
  'data-[highlighted]:bg-bg-subtle data-[state=checked]:bg-brand-subtle',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
)
</script>

<template>
  <SelectRoot v-model="model" :disabled="disabled">
    <SelectTrigger
      :id="id"
      :aria-invalid="invalid || undefined"
      :class="cn(modelSelectTriggerVariants({ size, invalid }), props.class)"
    >
      <Sparkles class="size-4 shrink-0 text-brand-fg" aria-hidden="true" />
      <SelectValue :placeholder="placeholder" class="min-w-0 flex-1 truncate text-left">
        <span class="flex min-w-0 items-center gap-2">
          <span class="truncate font-medium">{{ selected?.label }}</span>
          <span v-if="selected?.provider" class="shrink-0 text-xs text-fg-muted">{{
            selected.provider
          }}</span>
        </span>
      </SelectValue>
      <SelectIcon as-child>
        <ChevronDown class="size-4 shrink-0 text-fg-muted" aria-hidden="true" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="4"
        class="z-50 max-h-96 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-border bg-surface text-fg shadow-md"
      >
        <SelectViewport class="p-1">
          <SelectGroup v-for="(group, gi) in groups" :key="group.provider ?? gi">
            <SelectLabel
              v-if="group.provider"
              class="px-2 pt-2 pb-1 text-2xs font-semibold tracking-wider text-fg-muted uppercase"
              >{{ group.provider }}</SelectLabel
            >

            <SelectItem
              v-for="m in group.models"
              :key="m.value"
              :value="m.value"
              :disabled="m.disabled"
              :class="itemClass"
            >
              <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                <span class="flex min-w-0 items-center gap-2">
                  <SelectItemText>
                    <span class="truncate font-medium">{{ m.label }}</span>
                  </SelectItemText>
                  <Badge v-if="m.tag" color="brand" size="sm">{{ m.tag }}</Badge>
                </span>

                <span v-if="m.description" class="text-xs text-fg-muted">{{ m.description }}</span>

                <span
                  v-if="showMeta && (m.contextWindow || m.price)"
                  class="flex flex-wrap items-center gap-x-3 text-2xs text-fg-muted"
                >
                  <span v-if="m.contextWindow" class="tabular-nums"
                    >{{ formatContext(m.contextWindow) }} context</span
                  >
                  <span v-if="m.price">{{ m.price }}</span>
                </span>
              </span>

              <SelectItemIndicator class="absolute top-2.5 right-2 inline-flex text-brand-fg">
                <Check class="size-4" aria-hidden="true" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
