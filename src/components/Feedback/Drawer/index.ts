import { cva, type VariantProps } from 'class-variance-authority'

export { default as Drawer } from './Drawer.vue'

export const drawerContentVariants = cva(
  'fixed z-50 flex h-full max-w-[92vw] flex-col border-border bg-surface shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
  {
    variants: {
      side: {
        right:
          'inset-y-0 right-0 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        left: 'inset-y-0 left-0 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
      },
      size: {
        sm: 'w-80',
        md: 'w-[28rem]',
        lg: 'w-[36rem]',
      },
    },
    defaultVariants: { side: 'right', size: 'md' },
  },
)

export type DrawerVariants = VariantProps<typeof drawerContentVariants>
