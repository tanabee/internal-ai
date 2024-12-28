import { httpsCallable } from '@/lib/functions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export default function Chat() {
  const handleClick = async () => {
    const result = await httpsCallable('mainFlow')(
      'Explain Firebase in under 100 words',
    )
    console.log(result)
  }

  return (
    <Box>
      <Button onClick={handleClick}>Chat</Button>
    </Box>
  )
}
