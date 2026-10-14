import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InvitationPage from './pages/InvitationPage'
import DashboardPage from './pages/DashboardPage'

// El diseñador se carga aparte: la invitación de los invitados no lo descarga.
const DesignerPage = lazy(() => import('./pages/DesignerPage'))
const DemoPage = lazy(() => import('./pages/DemoPage'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rsvp/:token" element={<InvitationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/disenador" element={<DesignerPage />} />
        <Route path="/disenador/vista" element={<DemoPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  )
}
