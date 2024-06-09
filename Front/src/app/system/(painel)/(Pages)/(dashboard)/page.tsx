'use client'
import { AccreditedChart } from '@/components/Dashboard/AccreditedChart'
import { BeneficiaryChart } from '@/components/Dashboard/BeneficiaryChart'
import { ProductGroupChart } from '@/components/Dashboard/ProductGroupChart'
import { TotalChart } from '@/components/Dashboard/TotalChart'
import { DashboardProvider } from '@/contexts/DashboardContext'

export default function Dashboard() {
  return (
    <DashboardProvider>
      <TotalChart />
      <AccreditedChart />
      <ProductGroupChart />
      <BeneficiaryChart />
    </DashboardProvider>
  )
}
