import { useAuth } from '@/lib/Auth'
import { updateDoc, useDocs } from '@/lib/firestore'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function UserList() {
  const { items } = useDocs('users')
  const { user } = useAuth()

  const handleChangeRole = async (userId: string, role: string) => {
    await updateDoc(`users/${userId}`, { role })
  }

  return (
    <Box sx={{ py: 2, px: 3 }}>
      <Stack direction="row" alignItems="center" sx={{ px: 3, height: 40 }}>
        <Typography color="textSecondary" variant="body2" sx={{ width: 280 }}>
          ID
        </Typography>
        <Typography color="textSecondary" variant="body2" sx={{ flex: 1 }}>
          Email
        </Typography>
        <Typography color="textSecondary" variant="body2" sx={{ width: 160 }}>
          Role
        </Typography>
      </Stack>
      <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 0.5 }}>
        {items.map((item: Record<string, any>, index: number) => (
          <ListItem
            key={index}
            sx={{ background: '#070707', height: 72, px: 3, borderRadius: '16px' }}
          >
            <Typography sx={{ width: 270 }} variant="body2" noWrap>
              {item.id}
            </Typography>
            <Typography sx={{ flex: 1 }} variant="body2" noWrap>
              {item.email}
            </Typography>
            <Select
              sx={{ width: 160 }}
              size="small"
              value={item.role}
              onChange={(e) => handleChangeRole(item.id, e.target.value)}
              disabled={item.id === user?.id}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
