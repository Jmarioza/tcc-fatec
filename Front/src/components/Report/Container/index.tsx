'use client'
import { ReactNode } from 'react'
import { Page, Document, PageProps } from '@react-pdf/renderer'
import { styles } from './styles'

interface ReportContainer extends PageProps {
  children: ReactNode
}

export function ReportContainer({ children, ...rest }: ReportContainer) {
  return (
    <Document pageMode="fullScreen" pageLayout="oneColumn">
      <Page size="A4" style={styles.container} {...rest}>
        {children}
      </Page>
    </Document>
  )
}
