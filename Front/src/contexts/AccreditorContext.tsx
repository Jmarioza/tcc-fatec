import { useToast } from '@/hooks/useToast'
import { Accreditor, accreditorService } from '@/services/accreditorService'
import { createContext, ReactNode, useEffect, useState } from 'react'

interface AccreditorContextType {
  accreditors: Accreditor[]
  getAccreditor: () => Accreditor
  setAccreditor: (accreditorId: number) => void
  accreditor: Accreditor
}

export const AccreditorContext = createContext<AccreditorContextType>(
  {} as AccreditorContextType,
)

type ToastProviderProps = {
  children: ReactNode
}

export function AccreditorProvider({ children }: ToastProviderProps) {
  const [accreditors, setAccreditors] = useState<Accreditor[]>([])
  const [accreditorSelected, setAccreditorSelected] = useState<Accreditor>(
    {} as Accreditor,
  )

  const toast = useToast()

  function setAccreditor(accreditorId: number) {
    const foundAccreditor = accreditors.find((item) => item.id === accreditorId)
    if (!foundAccreditor) {
      throw new Error('Credenciadora não encontrada.')
    }
    setAccreditorSelected(foundAccreditor)
    sessionStorage.setItem('AccreditorId', String(foundAccreditor.id))
  }

  function getAccreditor() {
    return accreditorSelected
  }

  const contextValue: AccreditorContextType = {
    accreditors,
    setAccreditor,
    getAccreditor,
    accreditor: accreditorSelected,
  }

  async function fetchAccreditors() {
    try {
      const accreditorsResponse = await accreditorService.getByAuth()
      if (!accreditorsResponse) {
        throw new Error('Não foi possível encontrar credenciadoras.')
      }
      setAccreditors(accreditorsResponse)
      const storageAccreditorId = sessionStorage.getItem('AccreditorId')
      if (storageAccreditorId) {
        const accreditor = accreditorsResponse.find(
          (item) => item.id === Number(storageAccreditorId),
        )
        if (accreditor) {
          setAccreditorSelected(accreditor)
          return
        }
      }
      setAccreditorSelected(accreditorsResponse[0])
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    fetchAccreditors()
  }, [])

  return (
    <AccreditorContext.Provider value={contextValue}>
      {children}
    </AccreditorContext.Provider>
  )
}
