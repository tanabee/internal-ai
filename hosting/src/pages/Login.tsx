import GoogleIcon from '@/assets/GoogleIcon'
import SendIcon from '@/assets/SendIcon'
import SubmitButton from '@/components/Button'
import ErrorDialog from '@/components/ErrorDialog'
import { sendSignInLinkToEmail, signInWithGoogle } from '@/lib/Auth'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export default function Login() {
  const [error, setError] = useState<Error | null>(null)
  const [isSent, setIsSent] = useState(false)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm()

  const handleClick = async () => {
    await signInWithGoogle().catch((error) => setError(error))
  }

  const onSubmit = async (values: Record<string, any>) => {
    await sendSignInLinkToEmail(values.email).then(() => {
      setValue('email', '')
      setIsSent(true)
    })
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
              required: 'Please enter your email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
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
                error={Boolean(errors.email)}
                helperText={errors.email?.message as string}
              />
            )}
          />
          <SubmitButton
            variant="contained"
            disabled={isSubmitting}
            loading={isSubmitting}
            sx={{ pl: '16px', pr: '12px', py: '9px', borderRadius: '8px', fontWeight: 'normal' }}
            size="small"
            startIcon={<SendIcon />}
          >
            Send Sign in Link
          </SubmitButton>
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
      {isSent && <SuccessDialog onClose={() => setIsSent(false)} />}
    </Stack>
  )
}

function SuccessDialog({ onClose }: Record<string, any>) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  return (
    <Dialog
      open={open}
      TransitionProps={{ onExited: onClose }}
      sx={{ '& .MuiDialog-paper': { background: '#212121', borderRadius: '24px', p: 6 } }}
    >
      <Typography variant="h1" sx={{ mb: 5 }}>
        Please check your mailbox
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        We have sent a login link to the email address you provided.
        <br />
        Please open the email and click the link to complete the login process.
        <br />
        If you do not receive the email after some time, please check your spam folder.
      </Typography>
      <Typography variant="caption">
        Opening the link in the same browser will log you in directly.
      </Typography>
      <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Dialog>
  )
}
