import { createContext, ReactNode, useState } from 'react'
import { Field, View } from '@/dtos/Dashboard'
import { DashboardContainer } from '@/components/Dashboard/Container'
import { useDashboard } from '@/hooks/useDashboard'

interface GraphProviderProps {
  children: ReactNode
  title: string
  hasField?: boolean
  hasView?: boolean
  hasTypeValue?: boolean
}

interface GraphContextProps {
  field: Field
  view: View
}

export const GraphContext = createContext<GraphContextProps>(
  {} as GraphContextProps,
)

export function GraphProvider({
  children,
  title,
  hasField = true,
  hasView = true,
}: GraphProviderProps) {
  const [field, setField] = useState<Field>('totalValue')
  const [view, setView] = useState<View>('accumulated')

  const { filters } = useDashboard()

  function handleChangeField(field: Field) {
    setField(field)
  }

  function handleChangeView(view: View) {
    setView(view)
  }

  const contextValue: GraphContextProps = {
    field,
    view,
  }
  return (
    <GraphContext.Provider value={contextValue}>
      <DashboardContainer
        title={title}
        field={hasField ? field : undefined}
        view={hasView ? view : undefined}
        onChangeField={handleChangeField}
        onChangeView={handleChangeView}
        dateStart={filters.dateStart}
        dateEnd={filters.dateEnd}
      >
        {children}
      </DashboardContainer>
    </GraphContext.Provider>
  )
}
