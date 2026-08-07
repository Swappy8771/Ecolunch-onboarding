/**
 * Caterer Portal auth domain types — mirrors `src/auth/auth.types.ts`'s shape
 * for the admin side, but kept in its own `caterer/` subfolder rather than
 * merged into it: the two identity systems use different JWT secrets,
 * different backend models (`CatererUser` vs `User`), and this
 * `CatererAuthUser` shape (`catererId`/`role`/`status`) has no equivalent on
 * the admin side at all.
 */

export interface CatererAuthUser {
  id: string
  catererId: string
  email: string
  firstName: string | null
  lastName: string | null
  role: 'caterer_admin' | 'caterer_staff'
  status: 'invited' | 'active' | 'inactive' | 'suspended'
}

/** Present only while `token` was minted by an admin's "Open Support Access Session" action — never for a normal caterer login. */
export interface SupportSessionInfo {
  sessionId: string
  catererId: string
  expiresAt: string
}

export interface CatererAuthState {
  user: CatererAuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  supportSession: SupportSessionInfo | null
}

export interface CatererAuthContextValue extends CatererAuthState {
  login: (token: string, user: CatererAuthUser) => void
  logout: () => void
  /** Called once, right after `login()`, by the Support Access Session entry page — never by a normal login. */
  setSupportSession: (session: SupportSessionInfo | null) => void
}
