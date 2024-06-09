import { ReactNode } from 'react'
import { Box, BoxProps } from '@mui/material'

interface Props extends BoxProps {
  children: ReactNode
}

export function AuthBox({ children, ...rest }: Props) {
  return (
    <Box
      sx={{
        marginTop: 8,
        gap: '2rem',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}
