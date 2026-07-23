<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { X } from '@lucide/vue'
import { modalContentVariants, type ModalVariants } from '.'

interface Props {
  title: string
  description?: string
  size?: ModalVariants['size']
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

/** Open state (`v-model:open`). */
const open = defineModel<boolean>('open')
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-fg/40 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogContent :class="modalContentVariants({ size })">
        <div class="flex items-start justify-between gap-4 border-b border-border p-5">
          <div class="min-w-0">
            <DialogTitle class="text-lg font-semibold text-fg">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="mt-1 text-sm text-fg-subtle">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose
            class="-mt-1 -mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:outline-none"
            aria-label="Close"
          >
            <X class="size-4" aria-hidden="true" />
          </DialogClose>
        </div>

        <div class="overflow-y-auto p-5 text-sm text-fg">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="flex items-center justify-end gap-2 border-t border-border p-4"
        >
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
