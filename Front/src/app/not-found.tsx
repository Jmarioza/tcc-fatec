import Link from 'next/link'
import { Button, Typography, Container } from '@mui/material'

export default function NotFoundPage() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h1" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Página não encontrada
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        A página que você está procurando pode ter sido removida ou não existe.
      </Typography>
      <Link href="/">
        <Button variant="contained" color="primary">
          Voltar para a página inicial
        </Button>
      </Link>
    </Container>
  )
}
