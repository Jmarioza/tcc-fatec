'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { ChangePassword } from './components/ChangePassword'
import { RequestPassword } from './components/RequestPassword'
import { Stepper, Step, StepLabel } from '@mui/material'
import { AuthContainer } from '@/components/AuthContainer'

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState<string>('')
  const [activeStep, setActiveStep] = useState<number>(0)

  const toast = useToast()
  const { back } = useRouter()

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  function handleMenu() {
    toast.success('Senha Redefinida Com Sucesso.')
    back()
  }

  return (
    <AuthContainer title="Painel de Controle - Recuperação de Senha">
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Solicitação de Senha</StepLabel>
        </Step>
        <Step>
          <StepLabel>Redefinição de Senha</StepLabel>
        </Step>
      </Stepper>
      {activeStep === 0 && (
        <RequestPassword
          nextStep={handleNext}
          getEmail={(emailRequested) => setEmail(emailRequested)}
        />
      )}
      {activeStep === 1 && (
        <ChangePassword email={email} nextStep={handleMenu} />
      )}
    </AuthContainer>
  )
}
