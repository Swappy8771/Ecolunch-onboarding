import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererDocumentVaultApi } from '@/api/modules/caterer-document-vault.api'
import { useApiMutation } from '@/api/hooks/useApi'
import type { UploadDocumentInput, ReplaceDocumentInput } from '../types/catererDocumentVault.types'

/** A new upload/replace changes the requirement catalogue's match status, the
 *  groups, the progress, and the raw document list all at once. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererDocumentVault.all })
}

export function useUploadCatererDocument() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UploadDocumentInput>({
    mutationFn: (input) => catererDocumentVaultApi.uploadDocument(input),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface ReplaceCatererDocumentVariables {
  docId: string
  input: ReplaceDocumentInput
}

export function useReplaceCatererDocument() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, ReplaceCatererDocumentVariables>({
    mutationFn: ({ docId, input }) => catererDocumentVaultApi.replaceDocument(docId, input),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useCatererDocumentDownloadLink() {
  return useApiMutation<unknown, string>({
    mutationFn: (docId) => catererDocumentVaultApi.getDownloadLink(docId),
  })
}
