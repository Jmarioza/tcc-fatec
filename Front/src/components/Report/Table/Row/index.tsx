import { ReactNode } from 'react'
import { View } from '@react-pdf/renderer'
import { styles } from './styles'

interface TableRowProps {
  children: ReactNode
  color?: boolean
}

export function TableRow({ children, color = false }: TableRowProps) {
  return (
    <View
      style={{
        ...styles.row,
        backgroundColor: color ? '#cce6ff' : '#FFF',
      }}
    >
      {children}
    </View>
  )
}
