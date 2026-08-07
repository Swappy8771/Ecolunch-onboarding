import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererEcoloopApi } from '@/api/modules/caterer-ecoloop.api'
import type { CatererAddEcoloopMessageBody } from '@/api/modules/caterer-ecoloop.api'
import { useApiMutation } from '@/api/hooks/useApi'

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererEcoloop.all })
}

export interface AddEcoloopMessageVariables {
  conversationId: string
  body: CatererAddEcoloopMessageBody
}

export function useAddCatererEcoloopMessage() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, AddEcoloopMessageVariables>({
    mutationFn: ({ conversationId, body }) => catererEcoloopApi.addMessage(conversationId, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useMarkCatererEcoloopRead() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (conversationId) => catererEcoloopApi.markRead(conversationId),
    onSuccess: () => invalidateAll(queryClient),
  })
}
