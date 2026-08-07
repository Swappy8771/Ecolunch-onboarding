import { queryKeys } from '@/api/queryKeys'
import { documentVaultApi } from '@/api/modules/documentVault.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapGroupsToTiles, type DocumentGroupDto } from '../mappers/documentVault.mapper'
import type { DocumentCategoryTileViewModel } from '../types/documentVault.types'

async function fetchCategoryTiles(catererId: string): Promise<DocumentCategoryTileViewModel[]> {
  const groups = (await documentVaultApi.getGroups(catererId)) as DocumentGroupDto[]
  return mapGroupsToTiles(groups)
}

/** Level 2 of the Document Vault page — category tiles for the selected caterer, sourced from the requirement catalogue (`/document-vault/caterers/:catererId/groups`), not raw upload counts. */
export const useDocumentCategoryTiles = createQueryHook(
  (catererId: string) => queryKeys.documentVault.groups(catererId),
  fetchCategoryTiles,
)
