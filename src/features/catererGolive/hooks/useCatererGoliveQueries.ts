import { queryKeys } from '@/api/queryKeys'
import { catererGoliveApi } from '@/api/modules/caterer-golive.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { toGoLiveSummaryViewModel, toGoLiveChecklistViewModel } from '../mappers/catererGolive.mapper'
import type { GoLiveSummaryViewModel, GoLiveChecklistViewModel } from '../types/catererGolive.types'

export function useCatererGoliveSummary() {
  return useApiQuery<GoLiveSummaryViewModel>({
    queryKey: queryKeys.catererGolive.summary,
    queryFn: async () => toGoLiveSummaryViewModel((await catererGoliveApi.getSummary()) as Parameters<typeof toGoLiveSummaryViewModel>[0]),
  })
}

export function useCatererGoliveChecklist() {
  return useApiQuery<GoLiveChecklistViewModel>({
    queryKey: queryKeys.catererGolive.checklist,
    queryFn: async () => toGoLiveChecklistViewModel((await catererGoliveApi.getChecklist()) as Parameters<typeof toGoLiveChecklistViewModel>[0]),
  })
}
