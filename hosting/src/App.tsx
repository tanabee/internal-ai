import AuthLayout from '@/components/AuthLayout'
import Layout from '@/components/Layout'
import Loading from '@/components/Loading'
import { useAuth } from '@/lib/Auth'
import Chat from '@/pages/Chat'
import Login from '@/pages/Login'
import { Navigate, Route, Routes } from 'react-router'

export default function App() {
  const { user, initialized } = useAuth()
  console.log({ user, initialized })

  if (!initialized) {
    return <Loading />
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="*" element={<Layout />}>
        <Route path="chat">
          <Route index element={<Chat />} />
          <Route path=":id" element={<Chat />} />
          <Route path="new" element={<Chat />} />
        </Route>
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Route>
    </Routes>
  )
}
