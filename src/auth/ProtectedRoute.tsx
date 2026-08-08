import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

/**
 * Dev-only escape hatch (`VITE_SKIP_AUTH=true` in `.env.local`) — gated on
 * `import.meta.env.DEV` too, so setting the flag can never bypass the
 * login gate in a real/shared build even by accident. See
 * `knowledge/03-frontend/phase-1-foundation/AUTHENTICATION.md`.
 */
const skipAuth = import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated && !skipAuth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
