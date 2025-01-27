import AdminLayout from '@/components/AdminLayout'
import AuthLayout from '@/components/AuthLayout'
import Layout from '@/components/Layout'
import Loading from '@/components/Loading'
import { useAuth } from '@/lib/Auth'
import Chat from '@/pages/Chat'
import FinishSignUp from '@/pages/FinishSignUp'
import Login from '@/pages/Login'
import UserList from '@/pages/admin/UserList'
import { Navigate, Route, Routes } from 'react-router'

export default function App() {
  const { user, initialized } = useAuth()

  if (!initialized) {
    return <Loading />
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="finishSignUp" element={<FinishSignUp />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="*">
        <Route path="chat" element={<Layout />}>
          <Route path=":threadId" element={<Chat />} />
          <Route path="new" element={<Chat />} />
          <Route path="*" element={<Navigate to="./new" replace />} />
        </Route>
        {user?.role === 'admin' && (
          <Route path="admin" element={<AdminLayout />}>
            <Route path="users" element={<UserList />} />
            <Route path="*" element={<Navigate to="./users" replace />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/chat/new" replace />} />
      </Route>
    </Routes>
  )
}
