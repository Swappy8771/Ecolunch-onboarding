import { queryKeys } from '@/api/queryKeys'
import { validationApi } from '@/api/modules/validation.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapList } from '@/api/mappers/types'
import { mapValidationItemToViewModel, type ValidationItemDto } from '../mappers/validation.mapper'
import type { ValidationItemViewModel, ValidationListFilters } from '../types/validation.types'

/** Matches `validationService.list()`'s real `{ data, total }` shape (no DTO layer, no pagination — every matching item is returned). */
interface ValidationListResponseDto {
  data: ValidationItemDto[]
  total: number
}

export interface ValidationListResult {
  items: ValidationItemViewModel[]
  total: number
}

async function fetchValidationItems(filters: ValidationListFilters): Promise<ValidationListResult> {
  const response = (await validationApi.list({
    caterer: filters.caterer || undefined,
    type: filters.type,
    status: filters.status,
    priority: filters.priority,
  })) as ValidationListResponseDto

  return {
    items: mapList(response.data, mapValidationItemToViewModel),
    total: response.total,
  }
}

/** The review queue's data source — `GET /admin/validations`, filtered by caterer/type/status/priority. */
export const useValidationItems = createQueryHook(
  (filters: ValidationListFilters) => queryKeys.validation.list(filters as Record<string, unknown>),
  fetchValidationItems,
)
