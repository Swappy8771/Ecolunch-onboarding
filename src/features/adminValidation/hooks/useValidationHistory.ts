import { queryKeys } from '@/api/queryKeys'
import { validationApi } from '@/api/modules/validation.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { mapList } from '@/api/mappers/types'
import { mapHistoryEntryToViewModel, type ValidationAuditEntryDto } from '../mappers/validation.mapper'
import type { ValidationHistoryEntryViewModel } from '../types/validation.types'

interface ValidationHistoryResponseDto {
  item: unknown
  history: ValidationAuditEntryDto[]
}

/** Backs the drawer's "History" section — only fetched while the drawer is open (`enabled: open`). */
export function useValidationHistory(vid: string, open: boolean) {
  return useApiQuery<ValidationHistoryEntryViewModel[]>({
    queryKey: queryKeys.validation.history(vid),
    queryFn: async () => {
      const response = (await validationApi.getHistory(vid)) as ValidationHistoryResponseDto
      return mapList(response.history, mapHistoryEntryToViewModel)
    },
    enabled: open,
  })
}
