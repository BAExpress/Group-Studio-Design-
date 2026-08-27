import { useRef, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
  onUndo?: () => void
}

// Portado de showToast/dismissToast em RouteBalance.tsx (produção).
export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  function showToast(message: string, type: ToastType = 'info', onUndo?: () => void) {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, message, type, onUndo }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), onUndo ? 6000 : 3000)
  }

  function dismissToast(id: number, undo?: boolean) {
    setToasts((prev) => {
      if (undo) prev.find((t) => t.id === id)?.onUndo?.()
      return prev.filter((t) => t.id !== id)
    })
  }

  return { toasts, showToast, dismissToast }
}
