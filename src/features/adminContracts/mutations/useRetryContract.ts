import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { mapContractToDetail, type ContractDetailDto } from '../mappers/contract.mapper'
import type { ContractDetailViewModel } from '../types/contract.types'

export interface RetryContractVariables {
  cid: string
  /** Needed only for cache invalidation scoping — not sent to the backend. */
  catererId: string
}

/**
 * Error → Sent (`POST /:cid/retry`) — re-dispatches the same contract via
 * Dropbox Sign, reusing the send path server-side. This is a distinct,
 * deliberate business action from network-level retry (mutations keep
 * TanStack Query's default `retry: 0` — see Phase 4B's Mutation Design).
 */
export function useRetryContract() {
  const queryClient = useQueryClient()

  return useApiMutation<ContractDetailViewModel, RetryContractVariables>({
    mutationFn: async variables => mapContractToDetail((await contractsApi.retry(variables.cid)) as ContractDetailDto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(variables.cid) })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.byCaterer(variables.catererId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.summary(variables.catererId) })
    },
  })
}
