import { AppBar, AppBarProps } from '@mui/material'
import { styled as styledMUI } from '@mui/material/styles'
import styled from '@emotion/styled'

interface Props extends AppBarProps {
  open: boolean
}

const drawerWidth = 240

export const UserContainer = styled.div`
  background-color: #fbfbfb;
  border-radius: 0.25rem;
  color: #5f5f61;
  padding: 0.5rem;
  gap: 0.5rem;
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`
export const UserContent = styled.div`
  display: flex;
  flex-direction: column;
`
export const Username = styled.span``
export const UserType = styled.span``
export const Company = styled.span`
  font-weight: bold;
`

export const Container = styledMUI(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<Props>(({ theme, open }) => ({
  position: 'absolute',
  background: '#3289C8',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export const AccreditorLine = styled.div`
  position: relative;
  width: 100vw;
  height: 4px;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1976d3;
`

export const AccreditorContent = styled.div`
  padding: 0.5rem;
  background: #1976d3;
`
