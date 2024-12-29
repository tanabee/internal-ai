import { Form, SubmitButton, TextField } from '@/components/Form'
import { useAuth } from '@/lib/Auth'
import { httpsCallable } from '@/lib/functions'
import SendIcon from '@mui/icons-material/SendOutlined'
import { Avatar, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Chat() {
  const { user } = useAuth()
  const form = useForm()
  const [messages, setMessages] = useState<Record<string, any>[]>([])

  useEffect(() => {
    const chatBottom = document.getElementById('chat-bottom')
    chatBottom?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (values: Record<string, any>) => {
    form.setValue('text', '')
    const newMessage = { role: 'user', content: [{ text: values.text }] }
    const newMessages = [...messages, newMessage]
    setMessages(newMessages)
    return await httpsCallable('mainFlow')(newMessages).then((res) =>
      setMessages(res.data as Record<string, any>[]),
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault()
      form.handleSubmit(handleSubmit)()
    }
  }

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        p: 2,
      }}
    >
      <Stack
        sx={{
          flex: 1,
          width: '100%',
          mb: 2,
          overflowY: 'auto',
          position: 'relative',
        }}
        gap={2}
      >
        {messages.map((message, index) => {
          if (message.role === 'user') {
            return (
              <Stack
                key={index}
                direction="row"
                gap={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Typography
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: '24px',
                    bgcolor: 'grey.700',
                    maxWidth: '70%',
                  }}
                >
                  {message.content[0].text}
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: 'grey.300',
                    width: 32,
                    height: 32,
                    fontSize: 12,
                    fontWeight: 700,
                    mt: 1,
                  }}
                  src={user?.photoURL ?? ''}
                >
                  {user?.displayName?.charAt(0)}
                </Avatar>
              </Stack>
            )
          } else {
            return (
              <Stack
                key={index}
                direction="row"
                gap={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  maxWidth: '70%',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'grey.300',
                    width: 32,
                    height: 32,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  AI
                </Avatar>
                <Typography sx={{ mt: 0.5 }}>
                  {message.content[0].text}
                </Typography>
              </Stack>
            )
          }
        })}
        <Box id="chat-bottom" />
      </Stack>
      <Box
        sx={{
          width: '100%',
          bgcolor: 'grey.800',
          borderRadius: 6,
          py: 2,
          px: 4,
        }}
      >
        <Form form={form} onSubmit={handleSubmit}>
          <Stack direction="row" alignItems="end" gap={2}>
            <TextField
              name="text"
              variant="standard"
              multiline
              sx={{ flex: 1, py: '5px' }}
              placeholder="Ask a question"
              slotProps={{
                input: {
                  disableUnderline: true,
                  onKeyDown: handleKeyDown,
                },
              }}
            />
            <SubmitButton
              startIcon={<SendIcon sx={{ color: 'grey.700' }} />}
              variant="contained"
            >
              Send
            </SubmitButton>
          </Stack>
        </Form>
      </Box>
    </Box>
  )
}
