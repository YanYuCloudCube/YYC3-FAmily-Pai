"use client"

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface NotificationToastProps {
  message: string
  type?: "info" | "success" | "error" | "warning"
  duration?: number
  onClose: () => void
}

export function NotificationToast({ message, type = "info", duration = 3000, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // 等待动画完成后关闭
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  }

  const backgrounds = {
    info: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-amber-50 border-amber-200",
  }

  return (
    <div
      className={cn(
        "flex items-center p-4 rounded-lg shadow-md border transition-all duration-300 max-w-md",
        backgrounds[type],
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
      )}
    >
      <div className="flex-shrink-0 mr-3">{icons[type]}</div>
      <div className="flex-1 mr-2">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}