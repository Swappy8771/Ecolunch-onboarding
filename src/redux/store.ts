import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
// Feature-scoped slices, kept in their own folders rather than `./slices/` —
// see `features/catererProfile/redux/catererProfileSlice.ts`'s header comment.
// No dashboard/UI slice exists — only genuine client state shared across
// components lives here (admin auth, caterer auth, caterer profile).
import catererProfileReducer from '@/features/catererProfile/redux/catererProfileSlice'
import catererAuthReducer from '@/features/catererAuth/redux/catererAuthSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catererProfile: catererProfileReducer,
    catererAuth: catererAuthReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
