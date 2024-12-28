import Box from '@mui/material/Box'
import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.default',
          width: 480,
          p: 6,
          borderRadius: 2,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
