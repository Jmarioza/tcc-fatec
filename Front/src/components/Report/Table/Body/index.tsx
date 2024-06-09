import { ReactNode } from 'react'
import { View } from '@react-pdf/renderer'

interface TableBodyProps {
  children: ReactNode
}

export function TableBody({ children }: TableBodyProps) {
  return <View>{children}</View>
}
