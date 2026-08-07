import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { mapCreateDraftInputToRequestBody, mapContractToDetail, type ContractDetailDto } from '../mappers/contract.mapper'
import type { CreateDraftContractInput, ContractDetailViewModel } from '../types/contract.types'

/** Send Wizard Step 2 — creates a draft with merge fields built entirely server-side; the client sends only `type`/optional signatory override/`linkedModules`. Returns the created draft as a `ContractDetailViewModel` — Step 3 reads its `mergeFields` directly, no separate fetch needed. */
export function useCreateDraftContract() {
  const queryClient = useQueryClient()

  return useApiMutation<ContractDetailViewModel, CreateDraftContractInput>({
    mutationFn: async input => {
      const response = (await contractsApi.createDraft(
        input.catererId,
        mapCreateDraftInputToRequestBody(input),
      )) as ContractDetailDto
      return mapContractToDetail(response)
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.byCaterer(input.catererId) })
    },
  })
}
