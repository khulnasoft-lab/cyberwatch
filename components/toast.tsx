"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
        toast.variant === "destructive" && "border-red-500 bg-red-50 dark:bg-red-900/10",
        toast.variant === "success" && "border-green-500 bg-green-50 dark:bg-green-900/10",
      )}
    >
      <div className="grid gap-1">
        {toast.title && (
          <div
            className={cn(
              "text-sm font-semibold",
              toast.variant === "destructive" && "text-red-900 dark:text-red-100",
              toast.variant === "success" && "text-green-900 dark:text-green-100",
            )}
          >
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div
            className={cn(
              "text-sm opacity-90",
              toast.variant === "destructive" && "text-red-800 dark:text-red-200",
              toast.variant === "success" && "text-green-800 dark:text-green-200",
            )}
          >
            {toast.description}
          </div>
        )}
      </div>
      {toast.action}
      <button
        className="absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        onClick={() => onClose(toast.id)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Toaster({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
