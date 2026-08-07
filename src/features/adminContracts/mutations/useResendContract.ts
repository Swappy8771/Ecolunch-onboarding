import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { mapContractToDetail, type ContractDetailDto } from '../mappers/contract.mapper'
import type { ContractDetailViewModel } from '../types/contract.types'

/** Reminds the signer (`POST /:cid/resend`) — doesn't change contract status, only adds an audit entry, so invalidation stays narrower than the status-changing mutations. */
export function useResendContract() {
  const queryClient = useQueryClient()

  return useApiMutation<ContractDetailViewModel, string>({
    mutationFn: async (cid: string) => mapContractToDetail((await contractsApi.resend(cid)) as ContractDetailDto),
    onSuccess: (_data, cid) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(cid) })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.history(cid) })
    },
  })
}
