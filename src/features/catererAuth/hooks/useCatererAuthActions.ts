import { catererAuthApi } from '@/api/modules/caterer-auth.api'
import type { CatererSetPasswordBody, CatererForgotPasswordBody } from '@/api/modules/caterer-auth.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { useApiQuery } from '@/api/hooks/useApi'
import { queryKeys } from '@/api/queryKeys'

/** `POST /caterer/auth/logout` — a client-side token discard server-side too (nothing to
 *  invalidate there); the caller clears local state regardless of this call's outcome. */
export function useCatererLogout() {
  return useApiMutation<unknown, void>({
    mutationFn: () => catererAuthApi.logout(),
  })
}

/** The Support Access Session banner's "End Session" — logs the matching `.end` audit entry. */
export function useCatererEndSupportSession() {
  return useApiMutation<unknown, void>({
    mutationFn: () => catererAuthApi.endSupportSession(),
  })
}

interface CheckInviteResult {
  valid: boolean
  kind?: 'invite' | 'reset'
  displayName?: string
}

/** Read-only — lets the Set Password page verify a token before rendering the form. */
export function useCheckCatererInviteToken(token: string, enabled: boolean) {
  return useApiQuery<CheckInviteResult>({
    queryKey: [...queryKeys.catererAuth.all, 'check-invite', token],
    queryFn: () => catererAuthApi.checkInviteToken(token) as Promise<CheckInviteResult>,
    enabled,
  })
}

export function useCatererSetPassword() {
  return useApiMutation<unknown, CatererSetPasswordBody>({
    mutationFn: (body) => catererAuthApi.setPassword(body),
  })
}

export function useCatererForgotPassword() {
  return useApiMutation<unknown, CatererForgotPasswordBody>({
    mutationFn: (body) => catererAuthApi.forgotPassword(body),
  })
}
