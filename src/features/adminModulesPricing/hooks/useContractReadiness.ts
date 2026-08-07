import { queryKeys } from '@/api/queryKeys'
import { modulesApi } from '@/api/modules/modules.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapContractReadinessToViewModel, type ContractReadinessDto } from '../mappers/modulesPricing.mapper'
import type { ContractReadinessViewModel } from '../types/modulesPricing.types'

async function fetchContractReadiness(catererId: string): Promise<ContractReadinessViewModel> {
  const response = (await modulesApi.getContractReadiness(catererId)) as ContractReadinessDto
  return mapContractReadinessToViewModel(response)
}

/** Backs the Contract Readiness screen — merge fields + validation + go-live gate status, in one call. */
export const useContractReadiness = createQueryHook(
  (catererId: string) => queryKeys.modules.contractReadiness(catererId),
  fetchContractReadiness,
)
