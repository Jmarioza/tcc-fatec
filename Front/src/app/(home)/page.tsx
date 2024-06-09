'use client'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as S from './styles'
import { AuthContainer } from '@/components/AuthContainer'
import {
  Badge,
  Computer,
  Gavel,
  LunchDining,
  School,
} from '@mui/icons-material'

export default function HomePage() {
  const { push } = useRouter()

  return (
    <AuthContainer title="Painel de Controle">
      <S.Content>
        <Button
          startIcon={<Gavel />}
          className="md"
          variant="contained"
          onClick={() => push('/accreditor')}
        >
          Clientes
        </Button>
        <Button
          startIcon={<Badge />}
          className="md"
          variant="contained"
          onClick={() => push('/accredited')}
        >
          Pets
        </Button>
        <Button
          startIcon={<School />}
          className="md"
          variant="contained"
          onClick={() => push('/accreditor_l')}
        >
          Funcionarios
        </Button>
        <Button
          startIcon={<LunchDining />}
          className="md"
          variant="contained"
          onClick={() => push('/accredited_m')}
        >
          Atendimentos
        </Button>
        <Button
          startIcon={<Computer />}
          className="md"
          variant="contained"
          onClick={() => push('/system')}
        >
          Sistema
        </Button>
      </S.Content>
    </AuthContainer>
  )
}
