import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapList } from '@/api/mappers/types'
import { mapContractToListItem, type ContractDto } from '../mappers/contract.mapper'
import type { ContractListItemViewModel } from '../types/contract.types'

/** Hand-authored — matches `contractsService.listForCaterer()`'s real `{ data, total }` shape. */
interface ContractListResponseDto {
  data: ContractDto[]
  total: number
}

export interface ContractListResult {
  items: ContractListItemViewModel[]
  total: number
}

async function fetchContractsByCaterer(catererId: string): Promise<ContractListResult> {
  const response = (await contractsApi.listForCaterer(catererId)) as ContractListResponseDto
  return {
    items: mapList(response.data, mapContractToListItem),
    total: response.total,
  }
}

/** A single caterer's contracts — used by the Send Wizard's caterer step and any future caterer-detail context. */
export const useContractsByCaterer = createQueryHook(
  (catererId: string) => queryKeys.contracts.byCaterer(catererId),
  fetchContractsByCaterer,
)
