import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

/**
 * Wraps any route that requires authentication.
 * - If no token → redirect to /login
 * - If role provided and doesn't match → redirect to the appropriate home
 */
const ProtectedRoute = ({ children, role }) => {
  const { token, role: userRole } = useAuthStore()

  if (!token) return <Navigate to="/login" replace />

  if (role && userRole !== role) {
    return (
      <Navigate
        to={userRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute
