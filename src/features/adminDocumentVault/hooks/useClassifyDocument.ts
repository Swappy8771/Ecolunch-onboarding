import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { documentVaultApi } from '@/api/modules/documentVault.api'
import { useApiMutation } from '@/api/hooks/useApi'
import type { ClassifyDocumentInput } from '../types/documentVault.types'

export interface ClassifyDocumentVariables extends ClassifyDocumentInput {
  docId: string
  /** Needed only for cache invalidation scoping — not sent to the backend. */
  catererId: string
}

/** Wired to the "Classify"/"Reclassify" row actions (`PATCH /admin/documents/:docId/classify`). */
export function useClassifyDocument() {
  const queryClient = useQueryClient()

  return useApiMutation<unknown, ClassifyDocumentVariables>({
    mutationFn: (variables) =>
      documentVaultApi.classify(variables.docId, { category: variables.category, linkedSection: variables.linkedSection }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documentVault.all })
    },
  })
}
