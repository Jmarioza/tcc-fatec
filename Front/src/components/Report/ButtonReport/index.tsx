import { FileDownload } from '@mui/icons-material'
import { Button, CircularProgress } from '@mui/material'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ReactElement, useEffect, useState } from 'react'

interface ButtonReportProps {
  document: ReactElement
  fileName: string
}

export function ButtonReport({ document, fileName }: ButtonReportProps) {
  const [isClientMode, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClientMode && (
        <PDFDownloadLink document={document} fileName={fileName}>
          {({ loading }) =>
            loading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '1.5rem',
                  gap: '0.5rem',
                }}
              >
                <CircularProgress />
                Processando PDF
              </div>
            ) : (
              <Button startIcon={<FileDownload />} variant="outlined">
                PDF
              </Button>
            )
          }
        </PDFDownloadLink>
      )}
    </>
  )
}
