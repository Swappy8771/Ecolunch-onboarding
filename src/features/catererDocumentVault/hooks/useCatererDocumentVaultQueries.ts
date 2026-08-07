import { queryKeys } from '@/api/queryKeys'
import { catererDocumentVaultApi } from '@/api/modules/caterer-document-vault.api'
import type { CatererListDocumentsQuery } from '@/api/modules/caterer-document-vault.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { useApiQuery } from '@/api/hooks/useApi'
import {
  toGroupsViewModel, toProgressViewModel, toDocumentListViewModel,
} from '../mappers/catererDocumentVault.mapper'
import type {
  DocumentGroupViewModel, DocumentVaultProgressViewModel,
} from '../types/catererDocumentVault.types'

export function useCatererDocumentVaultGroups() {
  return useApiQuery<DocumentGroupViewModel[]>({
    queryKey: queryKeys.catererDocumentVault.groups,
    queryFn: async () => toGroupsViewModel((await catererDocumentVaultApi.getGroups()) as Parameters<typeof toGroupsViewModel>[0]),
  })
}

export function useCatererDocumentVaultProgress() {
  return useApiQuery<DocumentVaultProgressViewModel>({
    queryKey: queryKeys.catererDocumentVault.progress,
    queryFn: async () => toProgressViewModel((await catererDocumentVaultApi.getProgress()) as Parameters<typeof toProgressViewModel>[0]),
  })
}

export const useCatererDocumentVaultDocuments = createQueryHook(
  (filters: CatererListDocumentsQuery | undefined) => queryKeys.catererDocumentVault.documents(filters as Record<string, unknown>),
  async (filters: CatererListDocumentsQuery | undefined) =>
    toDocumentListViewModel((await catererDocumentVaultApi.listDocuments(filters)) as Parameters<typeof toDocumentListViewModel>[0]),
)
