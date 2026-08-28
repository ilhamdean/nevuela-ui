<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { ChevronDown } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Separator } from '../../DataDisplay/Separator'

interface Props {
  /** Section heading — one visual step up from a `FormField` label. */
  title: string
  /** Supporting copy shown under the title. */
  description?: string
  /** Render as an accordion-style disclosure the user can collapse. */
  collapsible?: boolean
  /**
   * Initial open state when `collapsible` and the consumer isn't controlling
   * `v-model:open` themselves. Ignored otherwise.
   */
  defaultOpen?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  collapsible: false,
  defaultOpen: true,
})

// No `default` here on purpose: when the consumer doesn't bind `v-model:open`,
// this stays `undefined` so Reka's CollapsibleRoot falls back to `defaultOpen`
// for the initial render (its own `open` prop is "passive" only while
// undefined — see CollapsibleRoot's `useVModel(..., { passive: open === undefined })`).
// Giving this a static default here would always win over `defaultOpen` and
// make `default-open="false"` a no-op.
const open = defineModel<boolean>('open')
</script>

<template>
  <CollapsibleRoot
    v-if="collapsible"
    v-model:open="open"
    :default-open="defaultOpen"
    as="section"
    :class="cn('flex flex-col gap-4', props.class)"
  >
    <h3 class="text-base font-semibold text-fg">
      <CollapsibleTrigger
        class="group flex w-full items-start justify-between gap-3 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
      >
        <span class="flex flex-col gap-1">
          <span>{{ title }}</span>
          <span v-if="description" class="text-sm font-normal text-fg-subtle">{{
            description
          }}</span>
        </span>
        <ChevronDown
          class="mt-0.5 size-5 shrink-0 text-fg-muted transition-transform duration-150 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </CollapsibleTrigger>
    </h3>

    <Separator />

    <CollapsibleContent
      class="overflow-hidden transition-[height] duration-200 ease-out data-[state=closed]:h-0 data-[state=open]:h-[var(--reka-collapsible-content-height)]"
    >
      <div class="flex flex-col gap-5 pt-0.5">
        <slot />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>

  <section v-else :class="cn('flex flex-col gap-4', props.class)">
    <div class="flex flex-col gap-1">
      <h3 class="text-base font-semibold text-fg">{{ title }}</h3>
      <p v-if="description" class="text-sm text-fg-subtle">{{ description }}</p>
    </div>

    <Separator />

    <div class="flex flex-col gap-5">
      <slot />
    </div>
  </section>
</template>
