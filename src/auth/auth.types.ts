/**
 * Auth domain types. `AuthUser` is the single source of truth for the
 * shape of `state.auth.user` — `redux/slices/authSlice.ts` imports it
 * directly rather than duck-typing its own copy.
 */

export interface AuthUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextValue extends AuthState {
  login: (token: string, user: AuthUser) => void
  logout: () => void
}
