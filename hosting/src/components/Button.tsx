import MuiButton, { type ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

export default function Button({
  type = 'submit',
  loading,
  children,
  ...props
}: {
  type?: ButtonProps['type']
  loading?: boolean
  children: React.ReactNode
} & ButtonProps) {
  return (
    <MuiButton type={type} {...props}>
      {children}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={20} />
        </div>
      )}
    </MuiButton>
  )
}
