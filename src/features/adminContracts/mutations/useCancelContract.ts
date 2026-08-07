import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { mapContractToDetail, type ContractDetailDto } from '../mappers/contract.mapper'
import type { ContractDetailViewModel } from '../types/contract.types'

export interface CancelContractVariables {
  cid: string
  /** Needed only for cache invalidation scoping — not sent to the backend. */
  catererId: string
}

/** Cancel (`POST /:cid/cancel`) — a signed contract cannot be canceled; the backend's own 409 message renders verbatim on that failure. */
export function useCancelContract() {
  const queryClient = useQueryClient()

  return useApiMutation<ContractDetailViewModel, CancelContractVariables>({
    mutationFn: async variables => mapContractToDetail((await contractsApi.cancel(variables.cid)) as ContractDetailDto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(variables.cid) })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.byCaterer(variables.catererId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.summary(variables.catererId) })
    },
  })
}
