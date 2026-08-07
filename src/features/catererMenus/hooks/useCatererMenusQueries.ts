import { queryKeys } from '@/api/queryKeys'
import { catererMenusApi } from '@/api/modules/caterer-menus.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { useApiQuery } from '@/api/hooks/useApi'
import {
  toActiveMenuModuleFlags, toMenuOverviewViewModel, toMenuListResult, toMenuViewModel, toDishViewModel,
} from '../mappers/catererMenus.mapper'
import type {
  ActiveMenuModuleFlagsViewModel, MenuOverviewViewModel, MenuListFilters, MenuListResult, MenuViewModel, DishViewModel,
} from '../types/catererMenus.types'

export const useCatererActiveMenuModules = createQueryHook(
  () => queryKeys.catererMenus.activeModules,
  async (): Promise<ActiveMenuModuleFlagsViewModel> =>
    toActiveMenuModuleFlags((await catererMenusApi.getActiveModules()) as Parameters<typeof toActiveMenuModuleFlags>[0]),
)

export const useCatererMenusOverview = createQueryHook(
  (type: string | undefined) => queryKeys.catererMenus.overview(type),
  async (type: string | undefined): Promise<MenuOverviewViewModel> =>
    toMenuOverviewViewModel(
      (await catererMenusApi.getOverview(type ? { type: type as never } : undefined)) as Parameters<
        typeof toMenuOverviewViewModel
      >[0],
    ),
)

export const useCatererMenusList = createQueryHook(
  (filters: MenuListFilters) => queryKeys.catererMenus.list(filters as Record<string, unknown>),
  async (filters: MenuListFilters): Promise<MenuListResult> =>
    toMenuListResult((await catererMenusApi.list(filters as never)) as Parameters<typeof toMenuListResult>[0]),
)

export function useCatererMenuDetail(id: string, enabled: boolean) {
  return useApiQuery<MenuViewModel>({
    queryKey: queryKeys.catererMenus.detail(id),
    queryFn: async () => toMenuViewModel((await catererMenusApi.getById(id)) as Parameters<typeof toMenuViewModel>[0]),
    enabled,
  })
}

export const useCatererDishes = createQueryHook(
  () => queryKeys.catererMenus.dishes,
  async (): Promise<DishViewModel[]> => {
    const dishes = (await catererMenusApi.listDishes()) as Parameters<typeof toDishViewModel>[0][]
    return dishes.map(toDishViewModel)
  },
)
