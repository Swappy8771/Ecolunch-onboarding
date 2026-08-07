import { queryKeys } from '@/api/queryKeys'
import { documentVaultApi } from '@/api/modules/documentVault.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { mapList } from '@/api/mappers/types'
import { mapVaultSummaryToViewModel, type VaultSummaryDto } from '../mappers/documentVault.mapper'
import type { CatererVaultSummaryViewModel } from '../types/documentVault.types'

/** Hand-authored — see `documentVault.mapper.ts`'s header. Matches `GET /admin/documents/vault`'s real `{ data: VaultSummaryDTO[] }` shape. */
interface VaultSummaryResponseDto {
  data: VaultSummaryDto[]
}

async function fetchVaultSummary(): Promise<CatererVaultSummaryViewModel[]> {
  const response = (await documentVaultApi.getVaultSummary()) as VaultSummaryResponseDto
  return mapList(response.data, mapVaultSummaryToViewModel)
}

/** Level 1 of the Document Vault page — the global per-caterer summary grid. No args: takes zero query params on the backend. */
export function useDocumentVaultSummary() {
  return useApiQuery({
    queryKey: queryKeys.documentVault.vaultSummary,
    queryFn: fetchVaultSummary,
  })
}
