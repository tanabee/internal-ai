import type { ReactNode } from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles'

const grey = {
  300: '#B2BAC7',
  400: '#8894A8',
  500: '#F6F7F9',
  600: '#556174',
  800: '#212121',
  850: '#141414',
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9454F8',
    },
    background: {
      default: grey[850],
      paper: grey[800],
    },
    text: {
      primary: grey[500],
      secondary: grey[400],
    },
  },
  spacing: 8,
  typography: {
    h1: { fontSize: '32px', fontWeight: 700, color: '#fff' },
    h2: { fontSize: '20px', fontWeight: 500, color: grey[500] },
    body1: { fontSize: '14px', fontWeight: 400, color: grey[500] },
    button: {
      fontSize: '15px',
      fontWeight: 700,
      color: '#fff',
      textTransform: 'none',
    },
    caption: { fontSize: '12px', color: grey[400] },
  },
})

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
