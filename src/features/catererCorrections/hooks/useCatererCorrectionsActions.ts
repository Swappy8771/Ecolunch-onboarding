import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererCorrectionsApi } from '@/api/modules/caterer-corrections.api'
import type { ResubmitCorrectionBody, AddCorrectionCommentBody } from '@/api/modules/caterer-corrections.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Every mutation invalidates the whole `catererCorrections.all` namespace — a status change or
 *  new comment affects the list, the summary counts, and the go-live blocked flag alike. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererCorrections.all })
}

export interface ResubmitCorrectionVariables {
  id: string
  body: ResubmitCorrectionBody
}

export function useResubmitCatererCorrection() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, ResubmitCorrectionVariables>({
    mutationFn: ({ id, body }) => catererCorrectionsApi.resubmit(id, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface AddCorrectionCommentVariables {
  id: string
  body: AddCorrectionCommentBody
}

export function useAddCatererCorrectionComment() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, AddCorrectionCommentVariables>({
    mutationFn: ({ id, body }) => catererCorrectionsApi.addComment(id, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}
