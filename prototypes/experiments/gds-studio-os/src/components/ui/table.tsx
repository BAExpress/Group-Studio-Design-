import type * as React from 'react'

import { cn } from '@/lib/utils'

function TableScroll({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('overflow-x-auto', className)} {...props} />
}

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <table
      className={cn('w-full border-collapse font-mono text-[11.5px]', className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'border-b border-outline px-2.5 py-2 text-left text-[10px] uppercase tracking-wide text-on-surface-variant',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      className={cn('border-b border-outline-variant px-2.5 py-2 tabular-nums', className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return <tr className={cn('hover:bg-surface-variant', className)} {...props} />
}

export { TableScroll, Table, TableHead, TableCell, TableRow }
