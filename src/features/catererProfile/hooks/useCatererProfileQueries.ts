import { queryKeys } from '@/api/queryKeys'
import { catererProfileApi } from '@/api/modules/caterer-profile.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { toCatererProfileViewModel, toCatererProfileOverviewViewModel } from '../mappers/catererProfile.mapper'
import type { CatererProfileViewModel, CatererProfileOverviewViewModel } from '../types/catererProfile.types'

export const useCatererProfile = createQueryHook(
  () => queryKeys.catererProfile.detail,
  async (): Promise<CatererProfileViewModel> =>
    toCatererProfileViewModel((await catererProfileApi.get()) as Parameters<typeof toCatererProfileViewModel>[0]),
)

export const useCatererProfileOverview = createQueryHook(
  () => queryKeys.catererProfile.overview,
  async (): Promise<CatererProfileOverviewViewModel> =>
    toCatererProfileOverviewViewModel(
      (await catererProfileApi.getOverview()) as Parameters<typeof toCatererProfileOverviewViewModel>[0],
    ),
)
