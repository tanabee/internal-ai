import { Navigate, Route, Routes } from 'react-router'

export default function App() {
  return (
    <Routes>
      <Route path="/chat">
        <Route index element={<>AAA</>} />
        <Route path=":id/*" element={<>BBB</>} />
        <Route path="new" element={<>CCC</>} />
      </Route>
      <Route path="*" element={<Navigate to="chat" replace />} />
    </Routes>
  )
}
