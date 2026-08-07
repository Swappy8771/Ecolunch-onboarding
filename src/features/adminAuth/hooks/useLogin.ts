import { authApi, type LoginRequest } from '@/api/modules/auth.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { toLoginResult } from '../mappers/auth.mapper'
import type { AuthUser } from '@/auth/auth.types'

export interface LoginResult {
  token: string
  user: AuthUser
}

/**
 * Only maps the response — does not touch Redux/`useAuth()` itself, so the
 * calling component decides when `login(token, user)` fires (kept explicit
 * rather than baked into the hook, mirroring how every other mutation hook
 * in this app leaves cache/state side effects to the caller's `onSuccess`).
 */
export function useLogin() {
  return useApiMutation<LoginResult, LoginRequest>({
    mutationFn: async (body) => toLoginResult(await authApi.login(body)),
  })
}
