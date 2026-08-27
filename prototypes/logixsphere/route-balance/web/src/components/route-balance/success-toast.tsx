import { Check, X } from 'lucide-react'

export function SuccessToast({
  message,
  onDismiss,
}: {
  message: string | null
  onDismiss: () => void
}) {
  if (!message) return null

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-sm border border-primary bg-primary-container px-3 py-2 font-mono text-[11px] font-bold text-on-primary-container shadow-md">
      <Check className="size-4" />
      {message}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onDismiss}
        className="ml-1 text-on-primary-container/70 hover:text-on-primary-container"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
