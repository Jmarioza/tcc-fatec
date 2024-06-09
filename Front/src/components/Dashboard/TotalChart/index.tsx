import { HistogramChart } from './HistogramChart'
import { Cards } from './Cards'
import { GraphProvider } from '@/contexts/GraphContext'
import * as S from '../styles'

export function TotalChart() {
  return (
    <>
      <Cards />
      <S.Content>
        <GraphProvider title="Geral" hasField={false} hasTypeValue={false}>
          <HistogramChart />
        </GraphProvider>
      </S.Content>
    </>
  )
}
