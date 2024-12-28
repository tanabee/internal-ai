import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export default function Loading() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2000,
      }}
    >
      <CircularProgress />
    </Box>
  )
}
