import Avatar from '@mui/material/Avatar'

export default function UserAvatar({ user, sx }: Record<string, any>) {
  return (
    <Avatar
      src={user.photoURL}
      sx={{
        bgcolor: 'grey.300',
        width: 32,
        height: 32,
        fontSize: 12,
        fontWeight: 700,
        ...sx,
      }}
    >
      {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
    </Avatar>
  )
}
