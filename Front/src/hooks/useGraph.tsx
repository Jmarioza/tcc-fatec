import { useContext } from 'react'
import { GraphContext } from '@/contexts/GraphContext'

export function useGraph() {
  return useContext(GraphContext)
}
