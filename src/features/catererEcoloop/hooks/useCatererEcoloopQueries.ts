import { queryKeys } from '@/api/queryKeys'
import { catererEcoloopApi } from '@/api/modules/caterer-ecoloop.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { toConversationListViewModel, toConversationDetailViewModel } from '../mappers/catererEcoloop.mapper'
import type { EcoloopConversationViewModel, EcoloopConversationDetailViewModel } from '../types/catererEcoloop.types'

export function useCatererEcoloopList() {
  return useApiQuery<{ data: EcoloopConversationViewModel[]; total: number }>({
    queryKey: queryKeys.catererEcoloop.list,
    queryFn: async () =>
      toConversationListViewModel((await catererEcoloopApi.list()) as Parameters<typeof toConversationListViewModel>[0]),
  })
}

export function useCatererEcoloopDetail(conversationId: string, enabled: boolean) {
  return useApiQuery<EcoloopConversationDetailViewModel>({
    queryKey: queryKeys.catererEcoloop.detail(conversationId),
    queryFn: async () =>
      toConversationDetailViewModel(
        (await catererEcoloopApi.getById(conversationId)) as Parameters<typeof toConversationDetailViewModel>[0],
      ),
    enabled,
  })
}
