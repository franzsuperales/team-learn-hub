'use client'

import * as React from 'react'
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, useToast as useToastPrimitive } from '@radix-ui/react-toast'

const ToastContext = React.createContext(null)

export const ToastProviderWrapper = ({ children }) => {
  const toast = useToastPrimitive()
  return (
    <ToastContext.Provider value={toast}>
      <ToastProvider>
        {children}
        <ToastViewport className="fixed bottom-0 right-0 p-4 z-[100]" />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a <ToastProviderWrapper>')
  }
  return context
}
