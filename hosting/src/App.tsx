import Layout from '@/components/Layout'
import { Navigate, Route, Routes } from 'react-router'

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Layout />}>
        <Route path="chat">
          <Route index element={<>AAA</>} />
          <Route path=":id/*" element={<>BBB</>} />
          <Route path="new" element={<>CCC</>} />
        </Route>
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Route>
    </Routes>
  )
}
