import { cva, type VariantProps } from 'class-variance-authority'

export { default as KbdShortcut } from './KbdShortcut.vue'

/** Individual key-cap sizing. Kept tiny — this sits inline next to other text. */
export const kbdShortcutKeyVariants = cva(
  'inline-flex items-center justify-center rounded-sm border border-border bg-bg-subtle font-mono text-fg-subtle shadow-sm',
  {
    variants: {
      size: {
        sm: 'h-4 px-1 text-2xs',
        md: 'h-5 px-1.5 text-xs',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
)

export type KbdShortcutVariants = VariantProps<typeof kbdShortcutKeyVariants>
