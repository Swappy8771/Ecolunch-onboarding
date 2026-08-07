import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { mapContractToDetail, type ContractDetailDto } from '../mappers/contract.mapper'
import type { ContractDetailViewModel } from '../types/contract.types'

export interface ReadyContractVariables {
  cid: string
  /** Needed only for cache invalidation scoping — not sent to the backend. */
  catererId: string
}

/** Draft → Ready to Send (`POST /:cid/ready`). Send Wizard's optional review checkpoint; also reachable from the Detail Drawer for a draft contract. */
export function useReadyContract() {
  const queryClient = useQueryClient()

  return useApiMutation<ContractDetailViewModel, ReadyContractVariables>({
    mutationFn: async variables => mapContractToDetail((await contractsApi.ready(variables.cid)) as ContractDetailDto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(variables.cid) })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.byCaterer(variables.catererId) })
    },
  })
}
