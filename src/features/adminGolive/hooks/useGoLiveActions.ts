import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { goliveApi } from '@/api/modules/golive.api'
import { useApiMutation } from '@/api/hooks/useApi'

/**
 * The 6 action mutations behind the sticky action bar — validate, block,
 * unblock, activate, send reminder, send via EcoLoop. Every mutation
 * invalidates the whole `golive.all` namespace (not a bare
 * `invalidateQueries()`): any of these can change the table row, the
 * detail overview/summary, and (activate) the caterer's own status —
 * same invalidation-scope reasoning used throughout this session.
 */

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.golive.all })
}

export function useValidateGoLive() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (catererId: string) => goliveApi.validate(catererId),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface BlockGoLiveVariables {
  catererId: string
  reason: string
}

export function useBlockGoLive() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, BlockGoLiveVariables>({
    mutationFn: ({ catererId, reason }) => goliveApi.block(catererId, { reason }),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useUnblockGoLive() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (catererId: string) => goliveApi.unblock(catererId),
    onSuccess: () => invalidateAll(queryClient),
  })
}

/** Also invalidates `caterers.all` — activation flips `Caterer.status` to `'active'`, which the Caterers list/detail pages read. */
export function useActivateGoLive() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (catererId: string) => goliveApi.activate(catererId),
    onSuccess: () => {
      invalidateAll(queryClient)
      queryClient.invalidateQueries({ queryKey: queryKeys.caterers.all })
    },
  })
}

export interface SendGoLiveReminderVariables {
  catererId: string
  message?: string
}

export function useSendGoLiveReminder() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, SendGoLiveReminderVariables>({
    mutationFn: ({ catererId, message }) => goliveApi.sendReminder(catererId, { message }),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface SendGoLiveEcoLoopVariables {
  catererId: string
  message: string
}

export function useSendGoLiveEcoLoop() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, SendGoLiveEcoLoopVariables>({
    mutationFn: ({ catererId, message }) => goliveApi.sendViaEcoLoop(catererId, { message }),
    onSuccess: () => invalidateAll(queryClient),
  })
}
