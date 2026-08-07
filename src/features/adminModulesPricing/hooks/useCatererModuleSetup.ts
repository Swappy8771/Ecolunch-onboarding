import { queryKeys } from '@/api/queryKeys'
import { modulesApi } from '@/api/modules/modules.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapCatererModuleSetupToViewModel, type CatererModuleSetupDto } from '../mappers/modulesPricing.mapper'
import type { CatererModuleSetupViewModel } from '../types/modulesPricing.types'

async function fetchCatererModuleSetup(catererId: string): Promise<CatererModuleSetupViewModel> {
  const response = (await modulesApi.getForCaterer(catererId)) as CatererModuleSetupDto
  return mapCatererModuleSetupToViewModel(response)
}

/** The Dashboard/Modules/Pricing/Effective-Dates screens' shared data source — `GET /admin/modules-pricing/caterers/:catererId`. */
export const useCatererModuleSetup = createQueryHook(
  (catererId: string) => queryKeys.modules.setup(catererId),
  fetchCatererModuleSetup,
)
