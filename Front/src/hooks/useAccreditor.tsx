import { AccreditorContext } from '@/contexts/AccreditorContext'
import { useContext } from 'react'

export function useAccreditor() {
  return useContext(AccreditorContext)
}
