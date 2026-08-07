import { queryKeys } from '@/api/queryKeys'
import { catererEstablishmentsApi } from '@/api/modules/caterer-establishments.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { useApiQuery } from '@/api/hooks/useApi'
import {
  toActiveModuleFlags, toDashboardViewModel, toOverviewViewModel,
  toEstablishmentListResult, toEstablishmentDetailViewModel,
} from '../mappers/catererEstablishments.mapper'
import type {
  ActiveModuleFlagsViewModel, EstablishmentDashboardViewModel, EstablishmentOverviewViewModel,
  EstablishmentListFilters, EstablishmentListResult, EstablishmentDetailViewModel,
} from '../types/catererEstablishments.types'

export const useCatererActiveModules = createQueryHook(
  () => queryKeys.catererEstablishments.activeModules,
  async (): Promise<ActiveModuleFlagsViewModel> =>
    toActiveModuleFlags((await catererEstablishmentsApi.getActiveModules()) as Parameters<typeof toActiveModuleFlags>[0]),
)

export const useCatererEstablishmentsDashboard = createQueryHook(
  () => queryKeys.catererEstablishments.dashboard,
  async (): Promise<EstablishmentDashboardViewModel> =>
    toDashboardViewModel((await catererEstablishmentsApi.getDashboard()) as Parameters<typeof toDashboardViewModel>[0]),
)

export const useCatererEstablishmentsOverview = createQueryHook(
  (type: string | undefined) => queryKeys.catererEstablishments.overview(type),
  async (type: string | undefined): Promise<EstablishmentOverviewViewModel> =>
    toOverviewViewModel(
      (await catererEstablishmentsApi.getOverview(type ? { type: type as never } : undefined)) as Parameters<
        typeof toOverviewViewModel
      >[0],
    ),
)

export const useCatererEstablishmentsList = createQueryHook(
  (filters: EstablishmentListFilters) => queryKeys.catererEstablishments.list(filters as Record<string, unknown>),
  async (filters: EstablishmentListFilters): Promise<EstablishmentListResult> =>
    toEstablishmentListResult(
      (await catererEstablishmentsApi.list(filters as never)) as Parameters<typeof toEstablishmentListResult>[0],
    ),
)

export function useCatererEstablishmentDetail(id: string, enabled: boolean) {
  return useApiQuery<EstablishmentDetailViewModel>({
    queryKey: queryKeys.catererEstablishments.detail(id),
    queryFn: async () =>
      toEstablishmentDetailViewModel(
        (await catererEstablishmentsApi.getById(id)) as Parameters<typeof toEstablishmentDetailViewModel>[0],
      ),
    enabled,
  })
}
