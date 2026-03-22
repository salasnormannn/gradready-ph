import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import LandingPage from './pages/landing/LandingPage'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import OnboardingPage from './pages/onboarding/OnboardingPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import RoadmapPage from './pages/dashboard/RoadmapPage'
import GovPage from './pages/dashboard/GovPage'
import ChatPage from './pages/dashboard/ChatPage'
import JobsPage from './pages/dashboard/JobsPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import EditProfilePage from './pages/dashboard/EditProfilePage'

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

function OnboardingRoute({ children }) {
  const { token, isOnboarded } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (isOnboarded) return <Navigate to="/dashboard" replace />
  return children
}

function PublicRoute({ children }) {
  const { token, isOnboarded } = useAuthStore()
  if (token) return <Navigate to={isOnboarded ? '/dashboard' : '/onboarding'} replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />

        {/* Dashboard nested routes */}
        <Route path="/dashboard/profile/edit" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/dashboard/roadmap" element={<PrivateRoute><RoadmapPage /></PrivateRoute>} />
        <Route path="/dashboard/gov" element={<PrivateRoute><GovPage /></PrivateRoute>} />
        <Route path="/dashboard/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/dashboard/jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
        <Route path="/dashboard/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}