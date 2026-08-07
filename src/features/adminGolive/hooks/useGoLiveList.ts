import { queryKeys } from '@/api/queryKeys'
import { goliveApi } from '@/api/modules/golive.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapList } from '@/api/mappers/types'
import { mapGoLiveListItemToViewModel, type GoLiveListItemDto } from '../mappers/golive.mapper'
import type { GoLiveListItemViewModel } from '../types/golive.types'

interface GoLiveListResponseDto {
  data: GoLiveListItemDto[]
  total: number
}

export interface GoLiveListFilters {
  readiness?: 'ready' | 'not_ready' | 'in_progress'
}

async function fetchGoLiveList(filters: GoLiveListFilters): Promise<GoLiveListItemViewModel[]> {
  const response = (await goliveApi.list(filters)) as GoLiveListResponseDto
  return mapList(response.data, mapGoLiveListItemToViewModel)
}

/** The caterer-readiness table's data source — `GET /admin/golive`. */
export const useGoLiveList = createQueryHook(
  (filters: GoLiveListFilters) => queryKeys.golive.list(filters as Record<string, unknown>),
  fetchGoLiveList,
)
