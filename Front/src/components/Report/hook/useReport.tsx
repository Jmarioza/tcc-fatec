import { TransactionDTO } from '@/dtos/Transaction'
import { TransactionAnalyticalReport } from '../Reports/TransactionAnalyticalReport'
import { TransactionConsolidatedReport } from '../Reports/TransactionConsolidatedReport'
import { usePDF } from '@react-pdf/renderer'
import { useEffect, useState } from 'react'

interface UseReportProps {
  transactions: TransactionDTO[]
  dateStart: string
  dateEnd: string
}
export function useReport(reportProps: UseReportProps) {
  const [isClient, setIsClient] = useState(false)
  const [consolidate, updateConsolidate] = usePDF()
  const [analytical, updateAnalytical] = usePDF()

  function exportAnalyticalPDF() {
    if (isClient) {
      updateAnalytical(<TransactionAnalyticalReport {...reportProps} />)
      if (analytical.blob instanceof Blob) {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(analytical.blob)
        link.download = 'analitico_de_transacoes.pdf'
        link.click()
      }
    }
  }

  function exportConsolidatedPDF() {
    if (isClient) {
      updateConsolidate(<TransactionConsolidatedReport {...reportProps} />)
      if (consolidate.blob instanceof Blob) {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(consolidate.blob)
        link.download = 'consolidado_de_transacoes.pdf'
        link.click()
      }
    }
  }

  const hasRender = reportProps.transactions.length
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (reportProps.transactions.length > 0) {
      updateConsolidate(<TransactionConsolidatedReport {...reportProps} />)
      updateAnalytical(<TransactionAnalyticalReport {...reportProps} />)
    }
  }, [hasRender])

  return {
    exportAnalyticalPDF,
    exportConsolidatedPDF,
  }
}
