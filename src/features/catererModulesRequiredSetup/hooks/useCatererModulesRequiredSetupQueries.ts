import { queryKeys } from '@/api/queryKeys'
import { catererModulesRequiredSetupApi } from '@/api/modules/caterer-modules-required-setup.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { useApiQuery } from '@/api/hooks/useApi'
import {
  toActiveModulesViewModel, toModulesRequiredSetupOverviewViewModel, toModuleDetailViewModel,
  toModulesRequiredSetupProgressViewModel, toModuleMissingItemsViewModel,
} from '../mappers/catererModulesRequiredSetup.mapper'
import type {
  ActiveModulesViewModel, ModulesRequiredSetupOverviewViewModel, ModuleDetailViewModel,
  ModulesRequiredSetupProgressViewModel, ModuleMissingItemsViewModel, ModuleKey,
} from '../types/catererModulesRequiredSetup.types'

export const useCatererActiveModules = createQueryHook(
  () => queryKeys.catererModulesRequiredSetup.activeModules,
  async (): Promise<ActiveModulesViewModel> =>
    toActiveModulesViewModel(
      (await catererModulesRequiredSetupApi.getActiveModules()) as Parameters<typeof toActiveModulesViewModel>[0],
    ),
)

export const useCatererModulesRequiredSetupOverview = createQueryHook(
  () => queryKeys.catererModulesRequiredSetup.overview,
  async (): Promise<ModulesRequiredSetupOverviewViewModel> =>
    toModulesRequiredSetupOverviewViewModel(
      (await catererModulesRequiredSetupApi.getOverview()) as Parameters<typeof toModulesRequiredSetupOverviewViewModel>[0],
    ),
)

export const useCatererModulesRequiredSetupProgress = createQueryHook(
  () => queryKeys.catererModulesRequiredSetup.progress,
  async (): Promise<ModulesRequiredSetupProgressViewModel> =>
    toModulesRequiredSetupProgressViewModel(
      (await catererModulesRequiredSetupApi.getProgress()) as Parameters<typeof toModulesRequiredSetupProgressViewModel>[0],
    ),
)

export function useCatererModuleDetail(moduleKey: ModuleKey, enabled: boolean) {
  return useApiQuery<ModuleDetailViewModel>({
    queryKey: queryKeys.catererModulesRequiredSetup.detail(moduleKey),
    queryFn: async () =>
      toModuleDetailViewModel(
        (await catererModulesRequiredSetupApi.getModuleDetail(moduleKey)) as Parameters<typeof toModuleDetailViewModel>[0],
      ),
    enabled,
  })
}

export const useCatererModulesMissingItems = createQueryHook(
  (moduleKey: ModuleKey | undefined) => queryKeys.catererModulesRequiredSetup.missingItems(moduleKey),
  async (moduleKey: ModuleKey | undefined): Promise<ModuleMissingItemsViewModel[]> =>
    toModuleMissingItemsViewModel(
      (await catererModulesRequiredSetupApi.getMissingItems(moduleKey ? { moduleKey } : undefined)) as Parameters<
        typeof toModuleMissingItemsViewModel
      >[0],
    ),
)
