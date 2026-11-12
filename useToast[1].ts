'use client'

import { useEffect, useState } from 'react'
import { showToast, removeToast, subscribeToToasts, type Toast } from '../toast'

export function useToast() {
  const [toasts, setToasts] = useState<Record<string, Toast>>({})

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((prev) => {
        if (toast.message === '') {
          const newToasts = { ...prev }
          delete newToasts[toast.id]
          return newToasts
        }
        return { ...prev, [toast.id]: toast }
      })
    })

    return unsubscribe
  }, [])

  return {
    toasts: Object.values(toasts),
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
    remove: removeToast,
  }
}
