import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InvitationPage from './pages/InvitationPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/rsvp/:token" element={<InvitationPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}
