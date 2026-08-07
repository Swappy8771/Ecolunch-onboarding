/**
 * Caterer Portal auth slice — kept in this feature's folder
 * (`features/catererAuth/redux/`), same "separate structure" convention as
 * `features/catererProfile/redux/catererProfileSlice.ts`, rather than the
 * flat `src/redux/slices/` directory the admin `authSlice` lives in. Reads
 * from/writes to `shared/utils/catererStorage.ts`'s own `catererAuthToken`
 * key — never the admin `authSlice`'s `authToken` key.
 */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getStoredCatererToken, setStoredCatererToken, clearStoredCatererToken } from '@shared/utils/catererStorage'
import type { CatererAuthUser, SupportSessionInfo } from '@/auth/caterer/catererAuth.types'

interface CatererAuthSliceState {
  user: CatererAuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  supportSession: SupportSessionInfo | null
}

const initialState: CatererAuthSliceState = {
  user: null,
  token: getStoredCatererToken(),
  isAuthenticated: getStoredCatererToken() !== null,
  isLoading: false,
  error: null,
  supportSession: null,
}

const catererAuthSlice = createSlice({
  name: 'catererAuth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setUser: (state, action: PayloadAction<CatererAuthUser>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
      setStoredCatererToken(action.payload)
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      state.supportSession = null
      clearStoredCatererToken()
    },
    clearError: (state) => {
      state.error = null
    },
    setSupportSession: (state, action: PayloadAction<SupportSessionInfo | null>) => {
      state.supportSession = action.payload
    },
  },
})

export const { setLoading, setUser, setToken, setError, logout, clearError, setSupportSession } = catererAuthSlice.actions
export default catererAuthSlice.reducer
