<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import type { TabItem } from '.'

interface Props {
  tabs: TabItem[]
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const model = defineModel<string>()
const defaultValue = computed(() => props.tabs[0]?.value)
</script>

<template>
  <TabsRoot v-model="model" :default-value="defaultValue" :class="props.class">
    <TabsList class="flex items-center gap-1 border-b border-border">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :disabled="tab.disabled"
        class="relative -mb-px inline-flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-fg-subtle outline-none transition-colors hover:text-fg focus-visible:text-fg disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-brand data-[state=active]:text-brand"
      >
        <component :is="tab.icon" v-if="tab.icon" class="size-4" aria-hidden="true" />
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="pt-4 outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
    >
      <slot :name="tab.value">
        <slot name="panel" :value="tab.value" />
      </slot>
    </TabsContent>
  </TabsRoot>
</template>
