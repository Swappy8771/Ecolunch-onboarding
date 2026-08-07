import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { mapSendInputToRequestBody, mapContractToDetail, type ContractDetailDto } from '../mappers/contract.mapper'
import type { SendContractInput, ContractDetailViewModel } from '../types/contract.types'

export interface SendContractVariables extends SendContractInput {
  /** Needed only for cache invalidation scoping — not sent to the backend. */
  catererId: string
}

/** Draft/Ready to Send → Sent (`POST /:cid/send`) — dispatches via Dropbox Sign server-side. On a 409 (invalid transition) or a dispatch failure, the backend's own message renders verbatim (see Phase 4B's Error Handling design). */
export function useSendContract() {
  const queryClient = useQueryClient()

  return useApiMutation<ContractDetailViewModel, SendContractVariables>({
    mutationFn: async variables =>
      mapContractToDetail((await contractsApi.send(variables.cid, mapSendInputToRequestBody(variables))) as ContractDetailDto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(variables.cid) })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.byCaterer(variables.catererId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.summary(variables.catererId) })
    },
  })
}
