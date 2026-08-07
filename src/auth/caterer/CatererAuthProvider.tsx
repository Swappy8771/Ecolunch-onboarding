/**
 * Caterer Portal auth context — a thin facade over `catererAuthSlice`
 * (Redux), mirroring `src/auth/AuthProvider.tsx`'s admin equivalent
 * exactly in structure. Kept as a separate provider (not a shared one with
 * a `portal` flag) because the two identity systems are genuinely
 * independent: different JWT secret, different token storage key
 * (`catererAuthToken` vs `authToken`), different user shape.
 *
 * Mounted in `App.tsx` alongside (not instead of) the admin `AuthProvider`
 * — both can be active in the same app instance, since they never share
 * state or storage.
 */
import { createContext, useContext, useCallback, useEffect, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/redux/store'
import { setToken, setUser, setSupportSession as setSupportSessionAction, logout as logoutAction } from '@/features/catererAuth/redux/catererAuthSlice'
import { setCatererUnauthorizedHandler } from '@/api/client/auth'
import { useCatererLogout } from '@/features/catererAuth/hooks/useCatererAuthActions'
import type { CatererAuthContextValue, CatererAuthUser, SupportSessionInfo } from './catererAuth.types'

const CatererAuthContext = createContext<CatererAuthContextValue | null>(null)

export function CatererAuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, isAuthenticated, isLoading, supportSession } = useSelector((state: RootState) => state.catererAuth)
  const { mutateAsync: callLogout } = useCatererLogout()

  const login = useCallback(
    (nextToken: string, nextUser: CatererAuthUser) => {
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

  const setSupportSession = useCallback(
    (session: SupportSessionInfo | null) => {
      dispatch(setSupportSessionAction(session))
    },
    [dispatch],
  )

  useEffect(() => {
    setCatererUnauthorizedHandler(logout)
  }, [logout])

  const value: CatererAuthContextValue = { user, token, isAuthenticated, isLoading, supportSession, login, logout, setSupportSession }

  return <CatererAuthContext.Provider value={value}>{children}</CatererAuthContext.Provider>
}

export function useCatererAuth(): CatererAuthContextValue {
  const ctx = useContext(CatererAuthContext)
  if (!ctx) throw new Error('useCatererAuth must be used inside CatererAuthProvider')
  return ctx
}
