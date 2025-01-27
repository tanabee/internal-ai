import GoogleIcon from '@/assets/GoogleIcon'
import SendIcon from '@/assets/SendIcon'
import Button from '@/components/Button'
import ErrorDialog from '@/components/ErrorDialog'
import { sendSignInLinkToEmail, signInWithGoogle } from '@/lib/Auth'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export default function Login() {
  const [error, setError] = useState<Error | null>(null)
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const handleClick = async () => {
    await signInWithGoogle().catch((error) => setError(error))
  }

  const onSubmit = async (values: Record<string, any>) => {
    return sendSignInLinkToEmail(values.email)
  }

  return (
    <Stack spacing={5} sx={{ p: 6, borderRadius: 3, bgcolor: 'background.paper' }}>
      <Typography variant="h1">Sign in / Sign up</Typography>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
        <Stack spacing={2} alignItems="start">
          <Typography>Enter your email to receive sign in link.</Typography>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                size="small"
                fullWidth
                sx={{ flex: 1, py: '5px' }}
                placeholder="Enter your email"
                label="Email"
                type="email"
              />
            )}
          />
          <Button
            variant="contained"
            type="submit"
            loading={isSubmitting}
            sx={{ pl: '16px', pr: '12px', py: '9px', borderRadius: '8px', fontWeight: 'normal' }}
            size="small"
            startIcon={<SendIcon />}
          >
            Send Sign in Link
          </Button>
        </Stack>
      </form>
      <Stack spacing={2}>
        <Typography variant="caption" sx={{ mb: 2 }}>
          OR
        </Typography>
        <Box>
          <Button
            onClick={handleClick}
            color="inherit"
            sx={{
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.12), 0px 1px 12px rgba(0, 0, 0, 0.08)',
              background: '#fff',
              height: 54,
              width: 240,
              borderRadius: '8px',
              color: '#384047',
              '&:hover': {
                background: '#fafafa',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.12), 0px 1px 12px rgba(0, 0, 0, 0.08)',
              },
              '& .MuiButton-startIcon': { mr: 3 },
            }}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
        </Box>
      </Stack>
      {error && <ErrorDialog message={error.message} onClose={() => setError(null)} />}
    </Stack>
  )
}
