import { Backdrop, CircularProgress } from '@mui/material'

interface LoadingProps {
  isLoading: boolean
}

export function Loading({ isLoading }: LoadingProps) {
  return (
    <Backdrop open={isLoading}>
      <CircularProgress />
    </Backdrop>
  )
}
