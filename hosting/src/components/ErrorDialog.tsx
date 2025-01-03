import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

interface ErrorDialogProps {
  message: string
  onClose: () => void
}

export default function ErrorDialog({ message, onClose }: ErrorDialogProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  return (
    <Dialog open={open} TransitionProps={{ onExited: onClose }}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
