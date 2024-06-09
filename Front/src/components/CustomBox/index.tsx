import { ComponentProps, ReactNode } from 'react'
import * as S from './styles'
import { Button, Checkbox, FormControlLabel, Switch } from '@mui/material'
import {
  Add,
  EditAttributes,
  EditAttributesOutlined,
} from '@mui/icons-material'

interface Props extends ComponentProps<'div'> {
  title?: string
  children: ReactNode
  onAdd?: () => void
  onToggleStatus?: () => void
  checked?: boolean
  onToggleEdit?: () => void
  customHeader?: ReactNode
}

export function CustomBox({
  title,
  children,
  onAdd,
  onToggleStatus,
  checked,
  onToggleEdit,
  customHeader,
  ...rest
}: Props) {
  return (
    <S.Container {...rest}>
      {title && (
        <S.Header>
          {title}
          <S.CustomHeader>
            {customHeader && <div>{customHeader}</div>}
            {onToggleEdit && (
              <Checkbox
                onChange={onToggleEdit}
                icon={<EditAttributesOutlined />}
                checkedIcon={<EditAttributes />}
              />
            )}
            {onAdd && (
              <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
                Adicionar
              </Button>
            )}
            {(onToggleStatus || checked) && (
              <FormControlLabel
                label={checked ? 'Ativo' : 'Inativo'}
                labelPlacement="start"
                control={<Switch checked={checked} onChange={onToggleStatus} />}
              />
            )}
          </S.CustomHeader>
        </S.Header>
      )}
      <S.Content>{children}</S.Content>
    </S.Container>
  )
}
