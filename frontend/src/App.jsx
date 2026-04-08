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
import FinancePage from './pages/dashboard/FinancePage'
import BoardExamPage from './pages/dashboard/BoardExamPage'
import JobTrackerPage    from './pages/dashboard/JobTrackerPage'
import SalaryBoardPage   from './pages/dashboard/SalaryBoardPage'

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
        {/* Landing page — ALWAYS accessible, never redirects */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes — redirect to dashboard if already logged in */}
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Onboarding — only if logged in but not onboarded */}
        <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/dashboard/roadmap" element={<PrivateRoute><RoadmapPage /></PrivateRoute>} />
        <Route path="/dashboard/gov" element={<PrivateRoute><GovPage /></PrivateRoute>} />
        <Route path="/dashboard/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/dashboard/jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
        <Route path="/dashboard/finance" element={<PrivateRoute><FinancePage /></PrivateRoute>} />
        <Route path="/dashboard/board" element={<PrivateRoute><BoardExamPage /></PrivateRoute>} />
        <Route path="/dashboard/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/dashboard/profile/edit" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
        <Route path="/dashboard/tracker"  element={<PrivateRoute><JobTrackerPage /></PrivateRoute>} />
        <Route path="/dashboard/salary"   element={<PrivateRoute><SalaryBoardPage /></PrivateRoute>} />
{/*         <Route path="/dashboard/reviews"  element={<PrivateRoute><CompanyReviewsPage /></PrivateRoute>} /> */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}