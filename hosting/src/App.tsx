import Layout from '@/components/Layout'
import { Navigate, Route, Routes } from 'react-router'

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Layout />}>
        <Route path="chat">
          <Route index element={<>root</>} />
          <Route path=":id" element={<>id</>} />
          <Route path="new" element={<>new</>} />
        </Route>
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Route>
    </Routes>
  )
}
