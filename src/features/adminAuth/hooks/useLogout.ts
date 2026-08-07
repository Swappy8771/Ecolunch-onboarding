import { authApi } from '@/api/modules/auth.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** `POST /auth/logout` — a client-side token discard server-side too (nothing to
 *  invalidate there); the caller clears local state regardless of this call's outcome. */
export function useLogout() {
  return useApiMutation<unknown, void>({
    mutationFn: () => authApi.logout(),
  })
}
