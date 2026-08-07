import { queryKeys } from '@/api/queryKeys'
import { contractsApi } from '@/api/modules/contracts.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapContractHistoryToViewModel, type ContractHistoryDto } from '../mappers/contract.mapper'
import type { ContractHistoryViewModel } from '../types/contract.types'

async function fetchContractHistory(cid: string): Promise<ContractHistoryViewModel> {
  const response = (await contractsApi.getHistory(cid)) as ContractHistoryDto
  return mapContractHistoryToViewModel(response)
}

/**
 * `GET /admin/contracts/:cid/history` — the Detail Drawer's audit-history
 * section. Per Phase 4B: fetched lazily, not prefetched with every drawer
 * open — pass `{ enabled: <history section is visible/expanded> }` as the
 * second argument at the call site, e.g.
 * `useContractHistory(cid, { enabled: historyOpen })`.
 */
export const useContractHistory = createQueryHook(
  (cid: string) => queryKeys.contracts.history(cid),
  fetchContractHistory,
)
