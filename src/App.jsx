import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster, ToastBar, toast } from 'react-hot-toast'
import { RiCloseLine } from 'react-icons/ri'

// Store
import useThemeStore from './store/themeStore'
import useAuthStore from './store/authStore'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'

// Routes
import ProtectedRoute from './routes/ProtectedRoute'

// Auth Pages
import Login  from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// User Pages
import UserDashboard   from './pages/user/UserDashboard'
import ApplyLoan       from './pages/user/ApplyLoan'
import MyApplications  from './pages/user/MyApplications'
import UploadDocuments from './pages/user/UploadDocuments'
import StatusTracking  from './pages/user/StatusTracking'

// Admin Pages
import AdminDashboard    from './pages/admin/AdminDashboard'
import AdminApplications from './pages/admin/AdminApplications'
import AdminDocuments    from './pages/admin/AdminDocuments'
import AdminUsers        from './pages/admin/AdminUsers'
import AdminStats        from './pages/admin/AdminStats'

// Common Pages
import Profile     from './pages/common/Profile'
import LandingPage from './pages/common/LandingPage'

const App = () => {
  const { init, isDark } = useThemeStore()
  const { token, role }  = useAuthStore()

  useEffect(() => { init() }, [])

  return (
    <div className={isDark ? 'dark' : ''}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#162032' : '#fff',
            color: isDark ? '#e2e8f0' : '#334155',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            padding: '4px 12px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                <div className="flex-1 px-1">{message}</div>
                {t.type !== 'loading' && (
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className={`p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
                      isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <RiCloseLine size={16} />
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>

      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"  element={token ? <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace /> : <Signup />} />

          {/* User routes */}
          <Route element={
            <ProtectedRoute role="USER">
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard"        element={<UserDashboard />} />
            <Route path="/apply-loan"       element={<ApplyLoan />} />
            <Route path="/my-applications"  element={<MyApplications />} />
            <Route path="/upload-documents" element={<UploadDocuments />} />
            <Route path="/status"           element={<StatusTracking />} />
            <Route path="/profile"          element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route element={
            <ProtectedRoute role="ADMIN">
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard"    element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/documents"    element={<AdminDocuments />} />
            <Route path="/admin/users"        element={<AdminUsers />} />
            <Route path="/admin/stats"        element={<AdminStats />} />
            <Route path="/admin/profile"      element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="/" element={
            token
              ? <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />
              : <LandingPage />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
