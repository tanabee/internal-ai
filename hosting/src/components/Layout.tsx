import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'

import Logo from '@/assets/Logo.tsx'
import UserAvatar from '@/components/UserAvatar'
import type { Thread } from '@/entities/thread'
import { signOut, useAuth } from '@/lib/Auth'
import { getDoc, orderBy, useDocs } from '@/lib/firestore'
const drawerWidth = 320

export default function ResponsiveDrawer() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { threadId } = useParams()
  const { user } = useAuth()
  const { items } = useDocs(`users/${user?.id}/threads`, orderBy('updatedAt', 'desc'))
  const thread = items.find((item: Thread) => item.id === threadId) as Thread | undefined

  useEffect(() => {
    if (threadId) {
      // Redirect to /chat/new if thread doesn't exist
      getDoc(`users/${user?.id}/threads/${threadId}`).catch(() => navigate('/chat/new'))
    }
  }, [threadId, navigate, user?.id])

  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  const drawer = (
    <div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          height: 64,
          mb: 4,
          '& a': { height: 40 },
        }}
      >
        <a href="/chat/new">
          <Logo />
        </a>
      </Box>

      <Box sx={{ height: 56, pt: 1, pl: 1.5 }}>
        <Button
          startIcon={<AddIcon sx={{ height: 16, width: 16 }} />}
          variant="text"
          onClick={() => {
            navigate('/chat/new')
            setMobileOpen(false)
          }}
          sx={{ py: 1, pl: 1.5, pr: 2, fontSize: 14, fontWeight: 'normal', borderRadius: 100 }}
          disabled={!threadId}
        >
          New chat
        </Button>
      </Box>

      <List>
        {items.map((item: Thread) => (
          <ListItem key={item.id} sx={{ px: 1, py: 0.5 }}>
            <ListItemButton
              sx={{ borderRadius: 100, height: 48 }}
              onClick={() => {
                navigate(`/chat/${item.id}`)
                setMobileOpen(false)
              }}
              selected={item.id === threadId}
            >
              <Typography sx={{ fontSize: 12 }}>{item.title || 'New chat'}</Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ bgcolor: 'background.default' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography noWrap component="div" sx={{ flex: 1 }}>
            {thread?.title || 'New chat'}
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <UserAvatar user={user} />
          </IconButton>
          <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            marginThreshold={1}
            sx={{ '.MuiPaper-root': { border: 1, borderColor: 'grey.700' } }}
          >
            <List>
              {user?.role === 'admin' && (
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate('/admin')}>
                    <ListItemText primary="Admin" />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton onClick={() => signOut()}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
