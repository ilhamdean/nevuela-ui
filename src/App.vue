<script setup lang="ts">
// Minimal dev harness. The real surface of this library is Storybook
// (`pnpm storybook`); this entry only exists for quick local smoke checks.
import { Button } from '@/components/Forms/Button'
</script>

<template>
  <main class="grid min-h-dvh place-items-center gap-4 p-10">
    <div class="flex flex-col items-center gap-3">
      <h1 class="text-2xl font-semibold">Nevuela UI</h1>
      <p class="text-muted-foreground text-sm">
        An original design system for data-dense applications. Run <code>pnpm storybook</code> for
        the full library.
      </p>
      <Button>Primary action</Button>
    </div>
  </main>
</template>
