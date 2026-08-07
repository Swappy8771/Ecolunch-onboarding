/**
 * Admin portal auth slice — the real source of truth `src/auth/AuthProvider.tsx`
 * is a thin Context facade over. Reads from/writes to `shared/utils/storage.ts`'s
 * own `authToken` key — never the caterer portal's `catererAuthToken` key
 * (see `features/catererAuth/redux/catererAuthSlice.ts` for that counterpart).
 */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getStoredToken, setStoredToken, clearStoredToken } from '@shared/utils/storage'
import type { AuthUser } from '@/auth/auth.types'

interface AuthSliceState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthSliceState = {
  user: null,
  token: getStoredToken(),
  isAuthenticated: getStoredToken() !== null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
      setStoredToken(action.payload)
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      clearStoredToken()
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setLoading, setUser, setToken, setError, logout, clearError } = authSlice.actions
export default authSlice.reducer
