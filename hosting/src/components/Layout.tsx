import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}
