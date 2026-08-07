import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapNullable } from '@/api/mappers/types'
import { mapContractToDetail, type ContractDetailDto } from '../mappers/contract.mapper'
import type { ContractDetailViewModel } from '../types/contract.types'

async function fetchContract(cid: string): Promise<ContractDetailViewModel | null> {
  const response = (await contractsApi.getById(cid)) as ContractDetailDto | null
  return mapNullable(response, mapContractToDetail)
}

/** The Detail Drawer's primary data source — `GET /admin/contracts/:cid`. */
export const useContract = createQueryHook(
  (cid: string) => queryKeys.contracts.detail(cid),
  fetchContract,
)
