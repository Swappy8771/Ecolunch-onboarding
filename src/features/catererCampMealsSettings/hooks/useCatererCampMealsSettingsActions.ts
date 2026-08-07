import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererCampMealsSettingsApi } from '@/api/modules/caterer-camp-meals-settings.api'
import type { UpdateCampMealsSettingsBody } from '@/api/modules/caterer-camp-meals-settings.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Invalidates both this settings namespace and Modules & Required Setup's namespace — the
 *  Camp Meals checklist card reads these fields directly, so a save here must flip its status. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererCampMealsSettings.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.catererModulesRequiredSetup.all })
}

export function useUpdateCatererCampMealsSettings() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateCampMealsSettingsBody>({
    mutationFn: (body) => catererCampMealsSettingsApi.update(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}
