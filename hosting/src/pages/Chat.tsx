import Button from '@/components/Button'
import UserAvatar from '@/components/UserAvatar'
import { useAuth } from '@/lib/Auth'
import { addDoc, generateId, orderBy, setDoc, useDocs } from '@/lib/firestore'
import SendIcon from '@mui/icons-material/SendOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Markdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router'

type Message = {
  message: {
    role: string
    content: { text: string }[]
  }
  createdAt: string
  error?: string
}

export default function Chat() {
  const [messageCount, setMessageCount] = useState(0)
  const { user } = useAuth()
  const { threadId } = useParams()
  const navigate = useNavigate()
  const { items: messages } = useDocs(
    `users/${user?.id}/threads/${threadId}/messages`,
    orderBy('createdAt', 'asc'),
  )
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm()
  const text = watch('text') || ''

  useEffect(() => {
    if (messages.length - messageCount === 1) {
      const chatBottom = document.getElementById('chat-bottom')
      chatBottom?.scrollIntoView({ behavior: 'smooth' })
    }
    setMessageCount(messages.length)
  }, [messages, messageCount])

  const onSubmit = async (values: Record<string, any>) => {
    setValue('text', '')
    const newMessage = { role: 'user', content: [{ text: values.text }] }
    const newThreadId = threadId ?? generateId(`users/${user?.id}/threads`)
    if (!threadId) {
      await setDoc(`users/${user?.id}/threads/${newThreadId}`, {
        title: null,
        createdBy: user?.id,
        favorite: false,
      })
    }

    await addDoc(`users/${user?.id}/threads/${newThreadId}/messages`, { message: newMessage })

    if (!threadId) {
      navigate(`/chat/${newThreadId}`)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault()
      if (text.length > 0) {
        handleSubmit(onSubmit)()
      }
    }
  }

  return (
    <Box
      sx={{
        height: (theme) => `calc(100dvh - ${theme.mixins.toolbar.minHeight}px)`,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        py: 2,
        px: 2,
      }}
    >
      <Stack
        sx={{
          flex: 1,
          width: '100%',
          mb: 2,
          overflowY: 'auto',
          position: 'relative',
          px: 1,
        }}
        gap={2}
      >
        {messages.map((item: Message, index: number) => {
          if (item.message.role === 'user') {
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
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: '24px',
                    bgcolor: 'grey.700',
                    maxWidth: '70%',
                  }}
                >
                  {item.message.content[0].text.split('\n').map((line, index) => (
                    <Box key={index}>
                      <Typography
                        sx={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                        component="span"
                      >
                        {line}
                      </Typography>
                      <br />
                    </Box>
                  ))}
                </Box>
                <UserAvatar user={user} sx={{ mt: 1 }} />
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
                <Box
                  sx={{
                    width: '100%',
                    mt: '-3px',
                    '& p, & pre': {
                      my: 1,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                    },
                    '& code': {
                      fontFamily: 'sans-serif',
                    },
                  }}
                >
                  {item.message.content[0].text ? (
                    <Markdown className="markdown">{item.message.content[0].text}</Markdown>
                  ) : item.error ? (
                    <Typography
                      sx={{
                        padding: 1.5,
                        borderRadius: '8px',
                        border: '1px solid #E53935',
                        backgroundColor: '#451616',
                      }}
                    >
                      An error occurred. Please try again later.
                      <br />
                      If the problem persists, contact the administrator.
                    </Typography>
                  ) : (
                    <Box>
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                    </Box>
                  )}
                </Box>
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
          pl: 3,
          pr: 2,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
          <Stack direction="row" alignItems="end" gap={2}>
            <Controller
              name="text"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
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
              )}
            />
            <Button
              disabled={text.length === 0}
              loading={isSubmitting}
              startIcon={<SendIcon sx={{ color: 'grey.700', height: 16, width: 16 }} />}
              variant="contained"
              sx={{ pl: '16px', pr: '12px', py: '9px', borderRadius: '8px', fontWeight: 'normal' }}
              size="small"
            >
              Send
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
