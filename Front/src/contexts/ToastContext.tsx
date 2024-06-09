import React, { createContext, ReactNode, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
type ToastContextType = {
  error: (message: string) => void
  success: (message: string) => void
  info: (message: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
)

type ToastProviderProps = {
  children: ReactNode
}

type typeMessage = 'info' | 'error' | 'success'

export function ToastProvider({ children }: ToastProviderProps) {
  const [message, setMessage] = useState('')
  const [typeMessage, setMessageTye] = useState<typeMessage | undefined>(
    undefined,
  )

  function error(message: string) {
    setMessageTye('error')
    setMessage(message)
  }

  function success(message: string) {
    setMessageTye('success')
    setMessage(message)
  }

  function info(message: string) {
    setMessageTye('info')
    setMessage(message)
  }

  const contextValue: ToastContextType = {
    error,
    success,
    info,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      >
        <Alert severity={typeMessage} variant="filled">
          {message}
        </Alert>
      </Snackbar>
      {children}
    </ToastContext.Provider>
  )
}
