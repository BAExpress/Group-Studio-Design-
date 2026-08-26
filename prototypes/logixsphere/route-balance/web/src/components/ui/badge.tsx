import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider',
  {
    variants: {
      variant: {
        neutral: 'bg-surface-variant text-on-surface-variant',
        pending: 'bg-tertiary-container text-on-tertiary-container',
        validated: 'bg-primary-container text-on-primary-container',
        error: 'bg-error-container text-on-error-container',
        info: 'bg-secondary-container text-on-secondary-container',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

export { Badge, badgeVariants }
