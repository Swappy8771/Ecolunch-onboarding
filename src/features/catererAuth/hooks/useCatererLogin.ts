import { catererAuthApi, type CatererLoginBody } from '@/api/modules/caterer-auth.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { toCatererLoginResult, type CatererLoginResponse } from '../mappers/catererAuth.mapper'
import type { CatererAuthUser } from '@/auth/caterer/catererAuth.types'

export interface CatererLoginResult {
  token: string
  user: CatererAuthUser
}

/** Only maps the response — the caller decides when to call `useCatererAuth().login(token, user)`,
 *  same convention as the admin `useLogin()` hook. */
export function useCatererLogin() {
  return useApiMutation<CatererLoginResult, CatererLoginBody>({
    mutationFn: async (body) => toCatererLoginResult((await catererAuthApi.login(body)) as CatererLoginResponse),
  })
}
