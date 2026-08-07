# Caterer Portal Authentication — API Integration

**Status:** ✅ Integrated — 2026-08-01 · **Backend:** `/api/caterer/auth/*` (6 endpoints, already real,
just never called from the frontend before this pass) · **Frontend:** `src/client/auth/pages/*`,
`src/auth/caterer/*`, `src/features/catererAuth/*` (all new)

### What are we building?
A real login flow for the Caterer Portal — login, set-password (invite-claim + reset), forgot-password
— and route guarding for `/client/*`, mirroring the admin login integration done earlier this session.

### Why is it needed?
`caterer-profile.api.ts` (built in the previous pass, see `CatererProfile.md`) reads a caterer token
from `catererStorage.ts`, but nothing populated that token — there was no Caterer Portal login page at
all, and `/client/*` had zero route guarding. The Caterer Profile page was functionally unusable end to
end without this.

### Current state (before this pass)
The backend (`backend/src/modules/auth/caterer/`) was already fully real: login, logout, `/me`,
check-invite, set-password, forgot-password, all tenant-scoped and signed with a separate
`CATERER_JWT_SECRET`. `backend/development/caterer/models/auth/NOTES.md` had a stale "not yet
implemented" status line left over from its pre-implementation blueprint stage — corrected as part of
this pass (see that file's new §9). The frontend had nothing: no login page, no token storage, no route
guard on `/client/*`.

### What was built (frontend)
- `src/shared/utils/catererStorage.ts` (already existed from the Profile pass) — the `catererAuthToken`
  storage key this flow populates.
- `src/api/modules/caterer-auth.api.ts` — login/logout/me/checkInviteToken/setPassword/forgotPassword.
- `src/features/catererAuth/{mappers,hooks,redux}/` — `useCatererLogin`, `useCatererLogout`,
  `useCheckCatererInviteToken`, `useCatererSetPassword`, `useCatererForgotPassword`, and
  `catererAuthSlice.ts` (its own Redux slice, in its own feature folder — same "separate structure"
  convention as `features/catererProfile/redux/`, not merged into the flat `redux/slices/` admin
  directory).
- `src/auth/caterer/` — `CatererAuthProvider`/`useCatererAuth`/`CatererProtectedRoute`, structurally
  identical to the admin `src/auth/` but a genuinely separate context/provider/storage — the two never
  share state.
- 3 new pages: `CatererLoginPage`, `CatererSetPasswordPage`, `CatererForgotPasswordPage` under
  `src/client/auth/pages/`.
- `App.tsx`: mounted `CatererAuthProvider` alongside the admin `AuthProvider`; `/client/*` now wrapped in
  `CatererProtectedRoute` (previously unguarded); added `/caterer/login`, `/caterer/set-password`,
  `/caterer/forgot-password`. The existing `VITE_SKIP_AUTH` dev flag now gates both portals' guards.
- `ClientHeader.tsx` — real logged-in caterer name/role/initials + a working logout button, replacing
  the hardcoded "CG" placeholder that was there before.

### Bug found and fixed while wiring this up
`api/client/http.ts`'s 401 handler had exactly one registrable slot (`setUnauthorizedHandler`, wired to
the admin session). Since the admin and caterer APIs share one `httpClient`, an expired caterer token
would have fired the *admin's* logout handler — logging the admin out of an unrelated session (and the
reverse, had the admin session 401'd first). Fixed with a `domain: 'admin' | 'caterer'` parameter on
`handleUnauthorized()`, two independent handler slots, and a new `authDomain` request option (default
`'admin'`) that every caterer-scoped API call now passes explicitly.

### Known, disclosed limitation
No email-delivery integration exists for invite/reset tokens (`caterer-auth.service.ts`'s own
pre-existing `TODO(email integration pending)` comments, unchanged by this pass) — an admin inviting a
caterer still has to share the raw invite link manually. Same limitation already disclosed on the admin
side by `InviteCatererUserModal.tsx`.

### Verification
`tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) clean on every changed file.
One pre-existing, already-tolerated lint pattern (`react-refresh/only-export-components` on
`CatererAuthProvider.tsx`, exporting both the component and `useCatererAuth`) matches the same
convention already accepted on the admin `AuthProvider.tsx`/`ThemeContext.tsx`/`LangContext.tsx` — not a
new issue.

### Acceptance Criteria
- [x] Caterer can log in with real credentials and reach `/client/*`.
- [x] `/client/*` redirects to `/caterer/login` when not authenticated.
- [x] Invite-claim and password-reset both work through the same Set Password page.
- [x] Forgot-password sends a request to the real endpoint (generic response either way, matching the
      backend's own anti-enumeration design).
- [x] Logout works and clears only the caterer session, never the admin one.
- [x] Caterer Profile (`/client/profil`) now actually receives a valid token and can be used end to end.
