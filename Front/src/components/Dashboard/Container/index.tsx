import { ReactNode } from 'react'
import { CustomBox } from '@/components/CustomBox'
import { TextField } from '@mui/material'
import { DASHBOARD_FIELD } from '@/constants/dashboardField'
import { DASHBOARD_VIEW } from '@/constants/dashboardView'
import { View, Field, TypeValue } from '@/dtos/Dashboard'
import { DASHBOARD_TYPE_VALUE } from '@/constants/dashboardTypeValue'
import * as S from './styles'

interface ContainerProps {
  children: ReactNode
  title: string
  dateStart: string
  dateEnd: string
  view?: View
  field?: Field
  typeValue?: TypeValue
  onChangeView?: (view: View) => void
  onChangeField?: (field: Field) => void
  onChangeTypeValue?: (typeValue: TypeValue) => void
}

export function DashboardContainer({
  children,
  title,
  field,
  onChangeField,
  onChangeView,
  onChangeTypeValue,
  typeValue,
  view,
  dateEnd,
  dateStart,
}: ContainerProps) {
  return (
    <S.DashboardContainer>
      <CustomBox>
        <S.DashboardHeader>
          <S.DashboardTitleContainer>
            <S.DashboardTitle>{title}</S.DashboardTitle>
            <S.DashboardDate>
              {`de ${new Date(`${dateStart}T03:00Z`).toLocaleDateString(
                'pt-BR',
              )} até
              ${new Date(`${dateEnd}T03:00Z`).toLocaleDateString('pt-BR')}`}
            </S.DashboardDate>
          </S.DashboardTitleContainer>
          <S.DashboardActions>
            {typeValue && (
              <TextField
                InputLabelProps={{ shrink: true }}
                label="Formato de Valor"
                select
                SelectProps={{
                  native: true,
                }}
                size="small"
                fullWidth
                onChange={(event) =>
                  onChangeTypeValue &&
                  onChangeTypeValue(event.target.value as TypeValue)
                }
              >
                {DASHBOARD_TYPE_VALUE.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </TextField>
            )}
            {view && (
              <TextField
                InputLabelProps={{ shrink: true }}
                label="Tipo de Visualização"
                select
                SelectProps={{
                  native: true,
                }}
                size="small"
                fullWidth
                onChange={(event) =>
                  onChangeView && onChangeView(event.target.value as View)
                }
              >
                {DASHBOARD_VIEW.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </TextField>
            )}
            {field && (
              <TextField
                InputLabelProps={{ shrink: true }}
                label="Valor"
                select
                SelectProps={{
                  native: true,
                }}
                fullWidth
                size="small"
                value={field}
                onChange={(event) =>
                  onChangeField && onChangeField(event.target.value as Field)
                }
              >
                {DASHBOARD_FIELD.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </TextField>
            )}
          </S.DashboardActions>
        </S.DashboardHeader>
        {children}
      </CustomBox>
    </S.DashboardContainer>
  )
}
