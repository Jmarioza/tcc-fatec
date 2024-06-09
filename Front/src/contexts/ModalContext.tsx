import React, { createContext, ReactNode, useState } from 'react'
import { DeleteConfirmationModal } from '@/components/ConfirmDeleteModal'

interface ConfirmationModalContextType {
  openModal: (onConfirm: () => void | Promise<void>) => void
  closeModal: () => void
}

export const ConfirmationModalContext = createContext<
  ConfirmationModalContextType | undefined
>(undefined)

interface ConfirmationModalProviderProps {
  children: ReactNode
}

export function ConfirmationModalProvider({
  children,
}: ConfirmationModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [onConfirmCallback, setOnConfirmCallback] = useState<
    (() => void) | null
  >(null)

  function openModal(onConfirm: () => void) {
    setIsOpen(true)
    setOnConfirmCallback(() => onConfirm)
  }

  function closeModal() {
    setIsOpen(false)
    setOnConfirmCallback(null)
  }

  function confirm() {
    if (onConfirmCallback) onConfirmCallback()
    closeModal()
  }

  return (
    <ConfirmationModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && (
        <DeleteConfirmationModal
          open={isOpen}
          onConfirm={confirm}
          onCancel={closeModal}
        />
      )}
    </ConfirmationModalContext.Provider>
  )
}
