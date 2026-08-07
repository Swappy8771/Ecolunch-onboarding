import { queryKeys } from '@/api/queryKeys'
import { caterersApi, type InviteCatererUserBody } from '@/api/modules/caterers.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { useQueryClient } from '@tanstack/react-query'

export interface InviteCatererUserVariables extends InviteCatererUserBody {
  catererId: string
}

/** Matches `caterer-auth.service.ts#createInvitedCatererUser()`'s real response shape. */
export interface InviteCatererUserResult {
  id: string
  catererId: string
  email: string
  firstName: string | null
  lastName: string | null
  role: 'caterer_admin' | 'caterer_staff'
  status: 'invited' | 'active' | 'inactive' | 'suspended'
  /**
   * The real set-password link. Returned directly in the response because
   * real email delivery isn't wired up yet (`src/integrations/email` is a
   * stub) — until it is, this is what lets the admin actually get the link
   * to the caterer.
   */
  inviteUrl: string
}

/**
 * Wired to the "Invite User" workspace action — previously there was no UI
 * anywhere calling `POST /:id/invite`, and the old `caterersApi.invite(id)`
 * signature sent no body at all against a backend that requires `email`.
 */
export function useInviteCatererUser() {
  const queryClient = useQueryClient()

  return useApiMutation<InviteCatererUserResult, InviteCatererUserVariables>({
    mutationFn: async ({ catererId, ...body }) =>
      (await caterersApi.invite(catererId, body)) as InviteCatererUserResult,
    onSuccess: (_data, { catererId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.caterers.detail(catererId) })
    },
  })
}
