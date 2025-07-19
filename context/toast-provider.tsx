"use client"

import Toast from "@/components/ui/toast"
import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
//import Toast from "@components/ui/toast"

type ToastType = "success" | "error" | "info"

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<{
    visible: boolean
    message: string
    type: ToastType
    duration: number
  }>({
    visible: false,
    message: "",
    type: "info",
    duration: 3000,
  })

  const showToast = (message: string, type: ToastType = "info", duration = 3000) => {
    setToast({
      visible: true,
      message,
      type,
      duration,
    })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={hideToast} />
      )}
    </ToastContext.Provider>
  )
}

