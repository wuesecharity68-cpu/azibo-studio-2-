'use client'

import { useToast } from '@/lib/hooks/useToast'
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react'

export function ToastDisplay() {
  const { toasts, remove } = useToast()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-card border border-border rounded-lg p-4 shadow-lg flex items-start gap-3 animate-in slide-in-from-right-full"
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{toast.message}</p>
          </div>
          <button
            onClick={() => remove(toast.id)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
