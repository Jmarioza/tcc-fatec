'use client'
import { View, Text } from '@react-pdf/renderer'
import { styles } from './styles'
import { useAccreditor } from '@/hooks/useAccreditor'

interface ReportHeaderProps {
  title: string
  dateStart?: string
  dateEnd?: string
}

export function ReportHeader({ title, dateStart, dateEnd }: ReportHeaderProps) {
  const { accreditor } = useAccreditor()

  return (
    <View style={styles.container}>
      <View style={styles.accreditorContainer}>
        <Text>{accreditor?.company?.name || ''}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {dateStart && dateEnd && (
          <Text style={styles.period}>{`de ${dateStart} até ${dateEnd}`}</Text>
        )}
      </View>
      <View style={styles.dateContainer}></View>
    </View>
  )
}
