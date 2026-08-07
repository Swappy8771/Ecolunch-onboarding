import { queryKeys } from '@/api/queryKeys'
import { catererCorrectionsApi } from '@/api/modules/caterer-corrections.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { useApiQuery } from '@/api/hooks/useApi'
import {
  toCorrectionListResult, toCorrectionSummaryViewModel, toCorrectionHistoryViewModel,
} from '../mappers/catererCorrections.mapper'
import type {
  CorrectionListFilters, CorrectionListResult, CorrectionSummaryViewModel, CorrectionHistoryViewModel,
} from '../types/catererCorrections.types'

export const useCatererCorrectionsList = createQueryHook(
  (filters: CorrectionListFilters) => queryKeys.catererCorrections.list(filters as Record<string, unknown>),
  async (filters: CorrectionListFilters): Promise<CorrectionListResult> =>
    toCorrectionListResult((await catererCorrectionsApi.list(filters as never)) as Parameters<typeof toCorrectionListResult>[0]),
)

export const useCatererCorrectionsSummary = createQueryHook(
  () => queryKeys.catererCorrections.summary,
  async (): Promise<CorrectionSummaryViewModel> =>
    toCorrectionSummaryViewModel((await catererCorrectionsApi.getSummary()) as Parameters<typeof toCorrectionSummaryViewModel>[0]),
)

export function useCatererCorrectionHistory(id: string, enabled: boolean) {
  return useApiQuery<CorrectionHistoryViewModel>({
    queryKey: queryKeys.catererCorrections.history(id),
    queryFn: async () =>
      toCorrectionHistoryViewModel((await catererCorrectionsApi.getHistory(id)) as Parameters<typeof toCorrectionHistoryViewModel>[0]),
    enabled,
  })
}
