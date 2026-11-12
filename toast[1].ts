// AZIBO STUDIO toast notification utility.

export type ToastType =
  | 'success'
  | 'error'
  | 'info'
  | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

type ToastListener = (toast: Toast) => void

let toastListeners: ToastListener[] = []

export const showToast = (
  message: string,
  type: ToastType = 'info',
  duration = 3000
): string => {
  const id =
    `${Date.now()}-${crypto.randomUUID()}`

  const toast: Toast = {
    id,
    message,
    type,
    duration,
  }

  toastListeners.forEach((listener) => {
    listener(toast)
  })

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  return id
}

export const removeToast = (id: string): void => {
  toastListeners.forEach((listener) => {
    listener({
      id,
      message: '',
      type: 'info',
      duration: 0,
    })
  })
}

export const subscribeToToasts = (
  listener: ToastListener
): (() => void) => {
  toastListeners.push(listener)

  return () => {
    toastListeners = toastListeners.filter(
      (item) => item !== listener
    )
  }
}