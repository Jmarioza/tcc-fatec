import { ReactNode } from 'react'
import { View } from '@react-pdf/renderer'
import { styles } from './styles'

interface TableFooterProps {
  children: ReactNode
}

export function TableFooter({ children }: TableFooterProps) {
  return <View style={styles.footer}>{children}</View>
}
