import { DashboardContext } from '@/contexts/DashboardContext'
import { useContext } from 'react'

export function useDashboard() {
  return useContext(DashboardContext)
}
