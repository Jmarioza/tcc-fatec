import { ReactNode } from 'react'
import { Text, TextProps, View } from '@react-pdf/renderer'
import { styles } from './styles'

interface TableCellProps extends TextProps {
  children: ReactNode
  isFooter?: boolean
}

export function TableCell({
  children,
  isFooter = false,
  style,
}: TableCellProps) {
  return (
    <View
      style={{
        ...styles.cell,
        ...style,
        ...(isFooter && styles.isFooter),
      }}
    >
      <Text>{children}</Text>
    </View>
  )
}
