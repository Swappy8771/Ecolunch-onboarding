/**
 * Auth context — a thin facade over the existing `authSlice` (Redux),
 * not a second parallel state store. Per `knowledge/03-frontend/ARCHITECTURE.md`'s
 * state-management decision, Redux stays the source of truth for
 * genuine client state (auth included); this Context exists only to give
 * components a clean `useAuth()` API instead of importing
 * `useSelector`/`useDispatch` + the slice's action creators directly
 * everywhere, and to register the HTTP client's 401 handler once, at
 * mount, without `src/api/` depending on React/Redux.
 *
 * Mounted in `App.tsx`, inside `BrowserRouter` (so its own `logout()` call
 * from the 401 handler has router context), wrapping the whole route tree.
 *
 * NOTE (2026-08-08): `/admin/*` is NOT currently guarded. `ProtectedRoute`
 * was removed from `App.tsx` so the frontend can be demoed standalone with
 * no backend to authenticate against; the component still exists, unused.
 * Restore it before any real deployment — see `App.tsx`'s route-tree comment.
 */
import { createContext, useContext, useCallback, useEffect, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/redux/store'
import { setToken, setUser, logout as logoutAction } from '@/redux/slices/authSlice'
import { setUnauthorizedHandler } from '../api/client/auth'
import { useLogout } from '@/features/adminAuth/hooks/useLogout'
import type { AuthContextValue, AuthUser } from './auth.types'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)
  const { mutateAsync: callLogout } = useLogout()

  const login = useCallback(
    (nextToken: string, nextUser: AuthUser) => {
      dispatch(setToken(nextToken))
      dispatch(setUser(nextUser))
    },
    [dispatch],
  )

  // Best-effort — the token is discarded client-side regardless of whether
  // this call succeeds (no server-side session to invalidate), so its
  // result is never surfaced to the caller. Must fire (and settle) before
  // clearing local state: the request reads the token synchronously at
  // call time, so clearing it first would send the logout request with no
  // Authorization header at all.
  const logout = useCallback(() => {
    const clearLocalState = () => dispatch(logoutAction())
    if (isAuthenticated) callLogout().catch(() => {}).finally(clearLocalState)
    else clearLocalState()
  }, [dispatch, callLogout, isAuthenticated])

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  const value: AuthContextValue = { user, token, isAuthenticated, isLoading, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
