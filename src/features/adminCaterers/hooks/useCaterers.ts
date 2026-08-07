import { queryKeys } from '@/api/queryKeys'
import { caterersApi } from '@/api/modules/caterers.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapList } from '@/api/mappers/types'
import { mapCatererToViewModel, mapVerticalToBackendFilter, type CatererDto } from '../mappers/caterer.mapper'
import type { CatererListFilters, CatererListResult } from '../types/caterer.types'

/**
 * Hand-authored, not generated — `GET /admin/caterers` has no response
 * schema in the OpenAPI spec (see `src/api/generated/helpers.ts`'s
 * header). Matches `caterersService.list`'s actual return shape.
 */
interface CaterersListResponseDto {
  data: CatererDto[]
  page: number
  limit: number
  total: number
}

async function fetchCaterers(filters: CatererListFilters): Promise<CatererListResult> {
  const response = (await caterersApi.list({
    search: filters.search || undefined,
    status: filters.status,
    vertical: mapVerticalToBackendFilter(filters.vertical),
    assignedAdmin: filters.assignedAdmin || undefined,
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
  })) as CaterersListResponseDto

  return {
    items: mapList(response.data, mapCatererToViewModel),
    total: response.total,
    page: response.page,
    limit: response.limit,
  }
}

/** The Caterers admin page's list query — filters/search/pagination all hit the real backend. */
export const useCaterers = createQueryHook(
  (filters: CatererListFilters) => queryKeys.caterers.list(filters as Record<string, unknown>),
  fetchCaterers,
)
