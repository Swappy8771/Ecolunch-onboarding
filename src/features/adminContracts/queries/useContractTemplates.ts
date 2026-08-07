import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { mapList } from '@/api/mappers/types'
import { mapContractTemplateToViewModel, type ContractTemplateDto } from '../mappers/contract.mapper'
import type { ContractTemplateViewModel } from '../types/contract.types'

/** Hand-authored — matches `contractsService.templates()`'s real `{ data }` shape. */
interface ContractTemplateListResponseDto {
  data: ContractTemplateDto[]
}

async function fetchContractTemplates(): Promise<ContractTemplateViewModel[]> {
  const response = (await contractsApi.templates()) as ContractTemplateListResponseDto
  return mapList(response.data, mapContractTemplateToViewModel)
}

/** The fixed 7-template catalogue — Send Wizard's Step 1. No args, takes zero params on the backend; a long `staleTime` is appropriate since this rarely changes. */
export function useContractTemplates() {
  return useApiQuery({
    queryKey: queryKeys.contracts.templates,
    queryFn: fetchContractTemplates,
    staleTime: 5 * 60 * 1000,
  })
}
