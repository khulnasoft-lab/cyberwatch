"use client"

import { useState, useCallback } from "react"
import type { Toast } from "../components/toast"

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    const newToast: Toast = { id, title, description, variant }

    setToasts((prev) => [...prev, newToast])

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return {
    toasts,
    toast,
    dismiss,
  }
}
