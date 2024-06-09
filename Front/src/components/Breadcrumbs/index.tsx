import * as React from 'react'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

type CrumbProps = {
  href?: string
  description: string
}

interface Props {
  crumbs: CrumbProps[]
}

export function Breadcrumb({ crumbs }: Props) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {crumbs.map((item) =>
        item.href ? (
          <Link
            underline="hover"
            color="inherit"
            href={item.href}
            key={item.description}
          >
            {item.description}
          </Link>
        ) : (
          <Typography color="text.primary" key={item.description}>
            {item.description}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  )
}
