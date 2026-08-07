# Authentication

**Status:** ✅ Implemented · **Updated:** 2026-08-01

---

## What exists today

Real, wired admin login — `src/auth/pages/LoginPage.tsx` (new) posts to
the backend's real `POST /auth/login` via `src/api/modules/auth.api.ts`
(new) and `src/features/auth/hooks/useLogin.ts` (new mutation hook).
`AuthProvider` (`src/auth/AuthProvider.tsx`) is now mounted in
`App.tsx`, inside `BrowserRouter`; `/admin/*` is wrapped in
`ProtectedRoute`, `/login` is not. `authSlice.ts` no longer touches
`localStorage` directly — it routes through `shared/utils/storage.ts`'s
`getStoredToken`/`setStoredToken`/`clearStoredToken`, closing a
duplicated-logic bug flagged during this pass. `AuthUser` (`auth.types.ts`)
now matches the backend's real login response shape (`{id, email,
firstName, lastName}`) instead of an invented `{name, role}` shape that
didn't exist server-side — there is no `role` field anywhere, matching the
backend's single-admin-user-type model.

## Login Flow (implemented)

```
LoginPage (src/auth/pages/LoginPage.tsx)
  → form submit → useLogin() → POST /auth/login { email, password }
  → on 200: LoginPage calls useAuth().login(token, user)
      → dispatch authSlice.setToken(token) + setUser(user)
  → redirect to the original destination (ProtectedRoute's `state.from`)
    or /admin/dashboard
  → on 401/403: inline error banner (ApiError.message), authSlice untouched
```

## Logout Flow (implemented)

```
Logout button (AdminHeader.tsx, desktop + mobile)
  → useAuth().logout() → dispatch authSlice.logout()
    (clears storage.ts's stored token + Redux state)
  → ProtectedRoute redirects to /login on the next render
```

Also triggered automatically by the shared HTTP client on any 401 (see
`API_LAYER.md`) via `setUnauthorizedHandler(logout)`, registered once in
`AuthProvider`'s mount effect.

## Token Lifecycle

- Obtained at login, stored via `shared/utils/storage.ts` (`authToken` key)
  and in Redux state for the current session.
- Attached to every request by the shared HTTP client (see
  `API_LAYER.md`); `skipAuth: true` is used only for `POST /auth/login`.
- Cleared on logout or on a 401.
- **No expiry/refresh handling** — unchanged, see "Future refresh-token
  support" below.

## Protected Routes

`src/auth/ProtectedRoute.tsx` wraps `/admin` in `App.tsx`, reading
`useAuth().isAuthenticated` and redirecting to `/login` (passing
`state: {from: location.pathname}`) if false. `/client/*` is intentionally
**not** guarded by this — the Caterer Portal has its own separate
`/caterer/auth/*` backend auth system, out of scope for this pass.

## 401 Handling

Global, in the shared HTTP client (see `API_LAYER.md`) — unchanged from
the original design, now actually wired: `AuthProvider` calls
`setUnauthorizedHandler(logout)` on mount.

## Role Handling

**Not applicable.** The backend has no RBAC — a single admin user type, no
role checks anywhere (per `BACKEND-DECISIONS-AND-QUESTIONS.md` D9). The
frontend's `AuthUser` type has no `role` field, matching this.

## Future Refresh-Token Support

**Still explicitly deferred, not designed here.** Neither `authSlice` nor
the backend's real auth module has any refresh-token concept today. If
session length becomes a problem in practice, this is the point to
revisit — not something to build speculatively now.
