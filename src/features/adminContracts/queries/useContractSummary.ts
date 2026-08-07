import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapProgressToSummary, type ContractProgressDto } from '../mappers/contract.mapper'
import type { ContractSummaryViewModel } from '../types/contract.types'

async function fetchContractSummary(catererId: string): Promise<ContractSummaryViewModel> {
  const response = (await contractsApi.getSummary(catererId)) as ContractProgressDto
  return mapProgressToSummary(response)
}

/**
 * `GET /admin/contracts/caterers/:catererId/summary` — per-caterer
 * progress/go-live-blockers. There is no global dashboard endpoint
 * (NOTES.md §5.9); the page-level 4-stat dashboard is a client-side
 * aggregate over `useContracts()`, not this hook.
 */
export const useContractSummary = createQueryHook(
  (catererId: string) => queryKeys.contracts.summary(catererId),
  fetchContractSummary,
)
