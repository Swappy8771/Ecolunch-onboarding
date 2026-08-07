import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapList } from '@/api/mappers/types'
import { mapContractToListItem, type ContractDto } from '../mappers/contract.mapper'
import type { ContractListFilters, ContractListItemViewModel } from '../types/contract.types'

/** Hand-authored, not generated — matches `contractsService.list()`'s real `{ data, total }` shape. */
interface ContractListResponseDto {
  data: ContractDto[]
  total: number
}

export interface ContractListResult {
  items: ContractListItemViewModel[]
  total: number
}

async function fetchContracts(filters: ContractListFilters): Promise<ContractListResult> {
  const response = (await contractsApi.list({
    caterer: filters.caterer || undefined,
    status: filters.status,
    type: filters.type,
  })) as ContractListResponseDto

  return {
    items: mapList(response.data, mapContractToListItem),
    total: response.total,
  }
}

/** The Contract Table's data source — `GET /admin/contracts`, filtered by caterer/status/type. No `search` param: deferred server-side per NOTES.md §5.13, so free-text search stays a client-side narrowing over this result. */
export const useContracts = createQueryHook(
  (filters: ContractListFilters) => queryKeys.contracts.list(filters as Record<string, unknown>),
  fetchContracts,
)
