import { queryKeys } from '@/api/queryKeys'
import { modulesApi } from '@/api/modules/modules.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapValidationStatusToViewModel, type ValidationStatusDto } from '../mappers/modulesPricing.mapper'
import type { ValidationStatusViewModel } from '../types/modulesPricing.types'

async function fetchValidationStatus(catererId: string): Promise<ValidationStatusViewModel> {
  const response = (await modulesApi.getValidationStatus(catererId)) as ValidationStatusDto
  return mapValidationStatusToViewModel(response)
}

/** Backs the Validation screen — `GET /admin/modules-pricing/caterers/:catererId/validation-status`. Real per-module blockers/warnings, computed backend-side by `validateModuleReadiness()`. */
export const useValidationStatus = createQueryHook(
  (catererId: string) => queryKeys.modules.validationStatus(catererId),
  fetchValidationStatus,
)
