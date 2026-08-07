import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useCatererAuth } from './CatererAuthProvider'

/** Same `VITE_SKIP_AUTH` dev escape hatch as the admin `ProtectedRoute` — one flag, both gates. */
const skipAuth = import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true'

export function CatererProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useCatererAuth()
  const location = useLocation()

  if (!isAuthenticated && !skipAuth) {
    return <Navigate to="/caterer/login" state={{ from: location.pathname }} replace />
  }

  return children
}
