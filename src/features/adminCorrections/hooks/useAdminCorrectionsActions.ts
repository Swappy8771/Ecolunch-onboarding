import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { correctionsApi } from '@/api/modules/corrections.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Every mutation invalidates the whole `corrections.all` namespace — a comment or close affects both
 *  the Validation Center's and Document Vault's own linked-correction panels alike. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.corrections.all })
}

export interface AddAdminCorrectionCommentVariables {
  id: string
  body: string
}

export function useAddAdminCorrectionComment() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, AddAdminCorrectionCommentVariables>({
    mutationFn: ({ id, body }) => correctionsApi.addComment(id, { body }),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useCloseAdminCorrection() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (id) => correctionsApi.close(id),
    onSuccess: () => invalidateAll(queryClient),
  })
}
