import { queryKeys } from '@/api/queryKeys'
import { ecoloopApi } from '@/api/modules/ecoloop.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { useApiQuery } from '@/api/hooks/useApi'
import {
  toConversationListResult,
  toConversationDetail,
  toConversationHistory,
  toDashboardViewModel,
} from '../mappers/ecoloop.mapper'
import type {
  ConversationListFilters,
  ConversationListResult,
  ConversationDetailViewModel,
  ConversationHistoryViewModel,
  DashboardViewModel,
} from '../types/ecoloop.types'

export const useEcoLoopList = createQueryHook(
  (filters: ConversationListFilters) => queryKeys.ecoloop.list(filters as Record<string, unknown>),
  async (filters: ConversationListFilters): Promise<ConversationListResult> =>
    toConversationListResult((await ecoloopApi.list(filters)) as Parameters<typeof toConversationListResult>[0]),
)

export const useEcoLoopByCaterer = createQueryHook(
  (args: { catererId: string; filters?: ConversationListFilters }) =>
    queryKeys.ecoloop.byCaterer(args.catererId, args.filters as Record<string, unknown>),
  async (args: { catererId: string; filters?: ConversationListFilters }): Promise<ConversationListResult> =>
    toConversationListResult(
      (await ecoloopApi.listForCaterer(args.catererId, args.filters)) as Parameters<typeof toConversationListResult>[0],
    ),
)

export const useEcoLoopDashboard = createQueryHook(
  () => queryKeys.ecoloop.dashboard,
  async (): Promise<DashboardViewModel> =>
    toDashboardViewModel((await ecoloopApi.getDashboard()) as Parameters<typeof toDashboardViewModel>[0]),
)

/** Conditionally fetched (no conversation selected yet) — same `enabled` convention as `useGoLiveSummary`. */
export function useEcoLoopDetail(conversationId: string, enabled: boolean) {
  return useApiQuery<ConversationDetailViewModel>({
    queryKey: queryKeys.ecoloop.detail(conversationId),
    queryFn: async () =>
      toConversationDetail((await ecoloopApi.getById(conversationId)) as Parameters<typeof toConversationDetail>[0]),
    enabled,
  })
}

export function useEcoLoopHistory(conversationId: string, enabled: boolean) {
  return useApiQuery<ConversationHistoryViewModel>({
    queryKey: queryKeys.ecoloop.history(conversationId),
    queryFn: async () =>
      toConversationHistory((await ecoloopApi.getHistory(conversationId)) as Parameters<typeof toConversationHistory>[0]),
    enabled,
  })
}
