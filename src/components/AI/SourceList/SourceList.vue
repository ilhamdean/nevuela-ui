<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { ExternalLink, FileText } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { sourceListVariants, type Source, type SourceListVariants } from '.'

interface Props {
  sources: Source[]
  /** Heading above the list. Set to `''` to render the list on its own. */
  label?: string
  variant?: SourceListVariants['variant']
  /** Show the retrieval score for sources that carry one. */
  showRelevance?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Sources',
  variant: 'list',
  showRelevance: false,
})

const emit = defineEmits<{
  /** A source was activated. Fires for non-link sources too, so a host app can open its own viewer. */
  select: [source: Source, index: number]
}>()

/** Only `http(s)` becomes a real link — a `file:`/`javascript:` URL from a retrieval pipeline shouldn't be clickable. */
function safeHref(url?: string): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : undefined
  } catch {
    return undefined
  }
}

/** Host without `www.`, as a readable origin label. */
function hostLabel(url?: string): string | undefined {
  const href = safeHref(url)
  if (!href) return undefined
  return new URL(href).hostname.replace(/^www\./, '')
}

const items = computed(() =>
  props.sources.map((source, index) => ({
    source,
    index,
    key: source.id ?? `${index}-${source.title}`,
    href: safeHref(source.url),
    origin: source.source ?? hostLabel(source.url),
    relevance:
      source.relevance === undefined ? undefined : `${Math.round(source.relevance * 100)}%`,
  })),
)

const markerClass =
  'inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-brand-subtle text-2xs font-semibold text-brand-fg tabular-nums'
</script>

<template>
  <section :class="cn('flex flex-col gap-2', props.class)">
    <h3 v-if="label" class="text-xs font-semibold tracking-wide text-fg-muted uppercase">
      {{ label }}
    </h3>

    <ol :class="sourceListVariants({ variant })">
      <li v-for="item in items" :key="item.key" :class="variant === 'list' ? 'min-w-0' : ''">
        <!-- One element carries the whole citation, link or not, so the number,
             title and origin are announced together rather than as fragments. -->
        <component
          :is="item.href ? 'a' : 'button'"
          :href="item.href"
          :type="item.href ? undefined : 'button'"
          :target="item.href ? '_blank' : undefined"
          :rel="item.href ? 'noopener noreferrer' : undefined"
          :class="
            cn(
              'group flex w-full items-start gap-2 rounded-md border border-border bg-surface text-left outline-none transition-colors',
              'hover:border-border-strong hover:bg-bg-subtle focus-visible:ring-2 focus-visible:ring-brand/25',
              variant === 'list' ? 'p-3' : 'items-center gap-1.5 px-2 py-1',
            )
          "
          @click="emit('select', item.source, item.index)"
        >
          <span :class="markerClass" aria-hidden="true">{{ item.index + 1 }}</span>

          <span class="flex min-w-0 flex-1 flex-col gap-1">
            <span class="flex items-center gap-1.5">
              <span
                :class="
                  cn(
                    'min-w-0 truncate font-medium text-fg group-hover:text-brand-fg',
                    variant === 'list' ? 'text-sm' : 'text-xs',
                  )
                "
                >{{ item.source.title }}</span
              >
              <ExternalLink
                v-if="item.href"
                class="size-3 shrink-0 text-fg-muted"
                aria-hidden="true"
              />
              <FileText v-else class="size-3 shrink-0 text-fg-muted" aria-hidden="true" />
            </span>

            <span
              v-if="variant === 'list' && item.source.snippet"
              class="line-clamp-2 text-xs text-fg-subtle"
              >{{ item.source.snippet }}</span
            >

            <span
              v-if="variant === 'list' && (item.origin || (showRelevance && item.relevance))"
              class="flex items-center gap-2 text-2xs text-fg-muted"
            >
              <span v-if="item.origin" class="truncate">{{ item.origin }}</span>
              <span v-if="showRelevance && item.relevance" class="tabular-nums"
                >{{ item.relevance }} match</span
              >
            </span>
          </span>

          <!-- Citation number as text for assistive tech, since the visible one is decorative. -->
          <span class="sr-only">Source {{ item.index + 1 }}</span>
        </component>
      </li>
    </ol>
  </section>
</template>
