import { useState } from 'react'
import { MoreVert } from '@mui/icons-material'
import { IconButton, MenuItem, Menu as MenuMaterial } from '@mui/material'

interface Props {
  onClick: () => void
}

export function Menu({ onClick }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  function handleClickMenu() {
    onClick()
    handleClose()
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <MenuMaterial anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClickMenu}>Ver detalhes</MenuItem>
      </MenuMaterial>
    </>
  )
}
