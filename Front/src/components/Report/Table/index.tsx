import { ReactNode } from 'react'
import { View } from '@react-pdf/renderer'
import { styles } from './styles'

interface TableProps {
  children: ReactNode
}

export function Table({ children }: TableProps) {
  return <View style={styles.table}>{children}</View>
}
