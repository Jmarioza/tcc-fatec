import { ReactNode } from 'react'
import { View } from '@react-pdf/renderer'
import { styles } from './styles'

interface TableHeaderProps {
  children: ReactNode
}

export function TableHeader({ children }: TableHeaderProps) {
  return <View style={styles.header}>{children}</View>
}
