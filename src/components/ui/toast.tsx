import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const ToastProvider = React.Fragment
export const ToastViewport = () => null
export const ToastTitle = ({ children }: { children: React.ReactNode }) => <div className="font-semibold">{children}</div>
export const ToastDescription = ({ children }: { children: React.ReactNode }) => <div className="text-sm">{children}</div>
export const ToastClose = () => <button className="ml-auto"><X className="h-4 w-4" /></button>

export interface ToastProps {
  children?: React.ReactNode
  className?: string
}

export const Toast: React.FC<ToastProps> = ({ children, className }) => {
  return (
    <div className={cn("fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-sm bg-white", className)}>
      {children}
    </div>
  )
}