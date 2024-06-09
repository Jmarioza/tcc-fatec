import { ConfirmationModalContext } from '@/contexts/ModalContext'
import { useContext } from 'react'

export function useConfirmationModal() {
  const context = useContext(ConfirmationModalContext)
  if (!context) {
    throw new Error(
      'useConfirmationModal deve ser usado dentro de um ConfirmationModalProvider',
    )
  }
  return context
}
