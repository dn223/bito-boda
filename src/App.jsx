import { Navigate, Route, Routes } from 'react-router-dom'
import InvitationPage from './pages/InvitationPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rsvp/familia-navarrete" replace />} />
      <Route path="/rsvp/:token" element={<InvitationPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/rsvp/familia-navarrete" replace />} />
    </Routes>
  )
}
