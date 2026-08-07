/**
 * Caterer Profile's own Redux slice — kept in this feature's folder
 * (`features/catererProfile/redux/`) rather than the flat
 * `src/redux/slices/` directory every other slice lives in, so this
 * feature's state stays self-contained instead of mixed in with unrelated
 * slices (auth/dashboard/ui).
 *
 * Scope is deliberately narrow: which section is currently in edit mode.
 * That's genuine client-only UI state (not server data — the profile
 * fields themselves live in the TanStack Query cache via
 * `useCatererProfile`/`useCatererProfileOverview`, per this app's
 * established Redux-for-client-state/Query-for-server-state split), and
 * it's cross-cutting enough to be worth centralizing: only one section's
 * edit form should be open at a time, and closing it needs to happen from
 * both the form itself (Cancel/Save) and the page (e.g. navigating away).
 */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ProfileSectionKey } from '../types/catererProfile.types'

interface CatererProfileState {
  editingSection: ProfileSectionKey | null
}

const initialState: CatererProfileState = {
  editingSection: null,
}

const catererProfileSlice = createSlice({
  name: 'catererProfile',
  initialState,
  reducers: {
    startEditingSection: (state, action: PayloadAction<ProfileSectionKey>) => {
      state.editingSection = action.payload
    },
    stopEditingSection: (state) => {
      state.editingSection = null
    },
  },
})

export const { startEditingSection, stopEditingSection } = catererProfileSlice.actions
export default catererProfileSlice.reducer
