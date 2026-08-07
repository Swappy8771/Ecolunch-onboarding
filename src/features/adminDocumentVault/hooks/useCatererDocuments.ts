import { queryKeys } from '@/api/queryKeys'
import { documentVaultApi } from '@/api/modules/documentVault.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapList } from '@/api/mappers/types'
import { mapDocumentToViewModel, type DocumentDto } from '../mappers/documentVault.mapper'
import type { DocumentViewModel } from '../types/documentVault.types'

export interface CatererDocumentsArgs {
  catererId: string
  category?: string
}

/** Hand-authored — see `documentVault.mapper.ts`'s header. Matches `GET /admin/documents/caterers/:catererId`'s real `{ data: DocumentResponseDTO[], total }` shape. */
interface DocumentListResponseDto {
  data: DocumentDto[]
  total: number
}

async function fetchCatererDocuments({ catererId, category }: CatererDocumentsArgs): Promise<DocumentViewModel[]> {
  const response = (await documentVaultApi.list(catererId, { category })) as DocumentListResponseDto
  // Superseded versions (`archived`) are never shown in the main table — see `toStatusDisplay`'s doc comment.
  return mapList(
    response.data.filter(doc => doc.status !== 'archived'),
    mapDocumentToViewModel,
  )
}

/** Level 3 of the Document Vault page — documents for the selected caterer, filtered by category. */
export const useCatererDocuments = createQueryHook(
  (args: CatererDocumentsArgs) => queryKeys.documentVault.listForCaterer(args.catererId, { category: args.category }),
  fetchCatererDocuments,
)
