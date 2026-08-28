<script setup lang="ts">
import { useId, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { promptSuggestionVariants, type PromptSuggestion, type PromptSuggestionVariants } from '.'

interface Props {
  suggestions: PromptSuggestion[]
  /** Heading above the group. Set to `''` to render the suggestions bare. */
  label?: string
  variant?: PromptSuggestionVariants['variant']
  /** Grid columns for `variant: 'card'` at the `sm` breakpoint and up. */
  columns?: 1 | 2 | 3
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Try asking',
  variant: 'chip',
  columns: 2,
})

const emit = defineEmits<{
  /** A suggestion was picked. The string is `suggestion.prompt ?? suggestion.label` — what to send. */
  select: [prompt: string, suggestion: PromptSuggestion]
}>()

// Names the list for assistive tech without depending on the heading being visible.
const labelId = useId()

const columnClass: Record<NonNullable<Props['columns']>, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
}
</script>

<template>
  <section
    :aria-labelledby="label ? labelId : undefined"
    :class="cn('flex flex-col gap-2', props.class)"
  >
    <h3
      v-if="label"
      :id="labelId"
      class="text-xs font-semibold tracking-wide text-fg-muted uppercase"
    >
      {{ label }}
    </h3>

    <div
      :class="
        variant === 'card'
          ? cn('grid grid-cols-1 gap-2', columnClass[columns])
          : 'flex flex-wrap gap-2'
      "
    >
      <button
        v-for="(suggestion, i) in suggestions"
        :key="`${i}-${suggestion.label}`"
        type="button"
        :disabled="suggestion.disabled"
        :class="promptSuggestionVariants({ variant })"
        @click="emit('select', suggestion.prompt ?? suggestion.label, suggestion)"
      >
        <span class="flex w-full items-center gap-2">
          <component
            :is="suggestion.icon"
            v-if="suggestion.icon"
            class="size-4 shrink-0 text-fg-muted group-hover:text-brand-fg"
            aria-hidden="true"
          />
          <span class="min-w-0 flex-1 font-medium">{{ suggestion.label }}</span>
        </span>
        <span v-if="variant === 'card' && suggestion.description" class="text-xs text-fg-muted">{{
          suggestion.description
        }}</span>
      </button>
    </div>
  </section>
</template>
