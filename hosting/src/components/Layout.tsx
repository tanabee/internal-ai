import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'

import Logo from '@/assets/Logo.tsx'
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
  const uid = user?.uid || ''
  const { items } = useDocs(`users/${uid}/threads`, orderBy('updatedAt', 'desc'))
  const thread = items.find((item: Thread) => item.id === threadId) as Thread | undefined

  useEffect(() => {
    if (threadId) {
      getDoc(`users/${uid}/threads/${threadId}`).catch(() => navigate('/chat/new'))
    }
  }, [threadId, navigate, uid])

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
        }}
      >
        <Logo />
      </Box>
      <List>
        <ListItem>
          <ListItemButton
            sx={{ height: 56, borderRadius: 2 }}
            onClick={() => navigate('/chat')}
            disabled={!threadId}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New chat" />
          </ListItemButton>
        </ListItem>
        {items.map((item: Thread) => (
          <ListItem key={item.id}>
            <ListItemButton sx={{ borderRadius: 2 }} onClick={() => navigate(`/chat/${item.id}`)}>
              <ListItemText primary={item.title || 'New chat'} />
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
        <Toolbar sx={{ px: 1, bgcolor: 'background.default' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h2" noWrap component="div" sx={{ pl: 1, flex: 1 }}>
            {thread?.title || 'New Chat'}
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar
              sx={{
                bgcolor: 'grey.300',
                width: 32,
                height: 32,
                fontSize: 12,
                fontWeight: 700,
              }}
              src={user?.photoURL ?? ''}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>
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
          height: '100vh',
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
