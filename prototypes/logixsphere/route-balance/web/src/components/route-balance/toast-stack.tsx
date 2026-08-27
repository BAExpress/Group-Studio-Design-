import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ToastItem } from '@/hooks/use-toasts'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}
const COLORS = {
  success: 'text-primary',
  error: 'text-error',
  info: 'text-secondary',
  warning: 'text-tertiary',
}

export function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number, undo?: boolean) => void }) {
  return createPortal(
    <div className="fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.type]
        return (
          <div
            key={t.id}
            role="status"
            className="flex items-center gap-2.5 rounded-sm border border-outline-variant bg-on-background px-3.5 py-2.5 text-xs text-background shadow-lg"
          >
            <Icon className={cn('size-4 shrink-0', COLORS[t.type])} />
            <span>{t.message}</span>
            {t.onUndo && (
              <button
                type="button"
                onClick={() => onDismiss(t.id, true)}
                className="ml-1 rounded-sm border border-background/40 px-2 py-0.5 font-semibold uppercase tracking-wide hover:bg-background/10"
              >
                Undo
              </button>
            )}
            <button type="button" onClick={() => onDismiss(t.id)} aria-label="Fechar" className="ml-1 opacity-70 hover:opacity-100">
              ×
            </button>
          </div>
        )
      })}
    </div>,
    document.body,
  )
}
