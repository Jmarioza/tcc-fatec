'use client'
import { ReactElement } from 'react'
import { ConfirmationModalProvider } from '@/contexts/ModalContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ptBR as ptBrDataGrid } from '@mui/x-data-grid'
import { ptBR } from '@mui/material/locale'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export function ContextProvider({ children }: { children: ReactElement }) {
  const defaultTheme = createTheme(
    {
      palette: {
        primary: {
          main: '#3289C8',
        },
      },
    },
    ptBR,
    ptBrDataGrid,
  )

  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastProvider>
        <ToastProvider>
          <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
        </ToastProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
