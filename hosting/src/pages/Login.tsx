import GoogleIcon from '@/assets/GoogleIcon'
import { signInWithGoogle } from '@/lib/Auth'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

export default function Login() {
  const [error, setError] = useState<Error | null>(null)

  const handleClick = async () => {
    await signInWithGoogle().catch((error) => setError(error))
  }

  return (
    <Stack
      spacing={5}
      sx={{ p: 6, borderRadius: 3, bgcolor: 'background.paper' }}
    >
      <Typography variant="h1">Login</Typography>
      <Box>
        <Button
          onClick={handleClick}
          color="inherit"
          sx={{
            boxShadow:
              '0px 1px 2px rgba(0, 0, 0, 0.12), 0px 1px 12px rgba(0, 0, 0, 0.08)',
            background: '#fff',
            height: 54,
            width: 240,
            borderRadius: '8px',
            color: '#384047',
            '&:hover': {
              background: '#fafafa',
              boxShadow:
                '0px 1px 2px rgba(0, 0, 0, 0.12), 0px 1px 12px rgba(0, 0, 0, 0.08)',
            },
            '& .MuiButton-startIcon': { mr: 3 },
          }}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
      </Box>
      {error && <Typography variant="body1">{error.message}</Typography>}
    </Stack>
  )
}
