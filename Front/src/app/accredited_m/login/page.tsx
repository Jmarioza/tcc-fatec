'use client'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { LoginForm } from './components/LoginForm'
import { CompanyList } from './components/CompanyList'
import { useAuth } from '@/hooks/useAuth'
import { AuthenticateProps } from '@/services/authService'
import { AuthContainer } from '@/components/AuthContainer'
import LinkUI from '@mui/material/Link'

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0)
  const [userId, setUserId] = useState<number | undefined>(undefined)

  const { signIn } = useAuth()

  async function authenticate(user: AuthenticateProps) {
    try {
      const token = await signIn(user, 'MASTER_ACCREDITED')
      if (token?.user_id) {
        setUserId(token?.user_id)
        setActiveStep(1)
      }
    } catch (error) {
      throw new Error('Usuário e/ou senha inválidos')
    }
  }

  return (
    <AuthContainer title="Painel de Controle - Credenciado">
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Usuário e senha</StepLabel>
        </Step>
        <Step completed={false}>
          <StepLabel>Selecione empresa</StepLabel>
        </Step>
      </Stepper>
      <Box
        sx={{
          marginY: '2rem',
        }}
      >
        {activeStep === 0 && <LoginForm authenticate={authenticate} />}
        {activeStep === 1 && userId && <CompanyList userId={userId} />}
      </Box>
      <LinkUI variant="body2" href="/forgot_password">
        Esqueceu a senha?
      </LinkUI>
    </AuthContainer>
  )
}
