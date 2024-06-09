import { useAccreditor } from '@/hooks/useAccreditor'
import * as S from './styles'
import { TextField } from '@mui/material'

export function AccreditorSelect() {
  const { accreditor, accreditors, setAccreditor } = useAccreditor()

  function handleChangeAccreditor(accreditorId: number) {
    setAccreditor(accreditorId)
  }
  return (
    <S.Container>
      <TextField
        InputLabelProps={{ shrink: true }}
        label="Credenciadora"
        select
        SelectProps={{
          native: true,
        }}
        onChange={(e) => handleChangeAccreditor(Number(e.target.value))}
        size="small"
        value={accreditor?.id}
        sx={{ gridColumn: 'span 2 ' }}
      >
        {accreditors.map((item) => (
          <option key={item.id} value={item.id}>
            {item.company?.name}
          </option>
        ))}
      </TextField>
    </S.Container>
  )
}
