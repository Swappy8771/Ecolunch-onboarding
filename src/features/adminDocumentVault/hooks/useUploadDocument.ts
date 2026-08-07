import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { documentVaultApi } from '@/api/modules/documentVault.api'
import { useApiMutation } from '@/api/hooks/useApi'
import type { UploadDocumentInput } from '../types/documentVault.types'

export interface UploadDocumentVariables extends UploadDocumentInput {
  catererId: string
}

/**
 * Registers a new document reference against a caterer (`POST /admin/documents/caterers/:catererId`).
 * A new document changes that caterer's document list, its category tiles
 * (requirement match status), and the global vault summary counts all at
 * once — same invalidation scope as `useReviewDocument`.
 */
export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useApiMutation<unknown, UploadDocumentVariables>({
    mutationFn: ({ catererId, ...body }) =>
      documentVaultApi.upload(catererId, body as Parameters<typeof documentVaultApi.upload>[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documentVault.all })
    },
  })
}
