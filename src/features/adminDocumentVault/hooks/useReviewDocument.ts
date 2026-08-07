import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { documentVaultApi } from '@/api/modules/documentVault.api'
import { useApiMutation } from '@/api/hooks/useApi'
import type { DocumentReviewInput } from '../types/documentVault.types'

export interface ReviewDocumentVariables extends DocumentReviewInput {
  docId: string
  /** Needed only for cache invalidation scoping — not sent to the backend. */
  catererId: string
}

/**
 * Wired to the existing "Approve"/"Reject"/"Request Correction" row
 * actions. A review changes this caterer's document list, its category
 * tiles (requirement match status), and the global vault summary counts
 * all at once — invalidating the whole `documentVault` namespace (not a
 * bare, unscoped `invalidateQueries()`) is the correct scope here, not an
 * arbitrary broadening.
 */
export function useReviewDocument() {
  const queryClient = useQueryClient()

  return useApiMutation<unknown, ReviewDocumentVariables>({
    mutationFn: (variables) => documentVaultApi.review(variables.docId, { decision: variables.decision, note: variables.note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documentVault.all })
    },
  })
}
