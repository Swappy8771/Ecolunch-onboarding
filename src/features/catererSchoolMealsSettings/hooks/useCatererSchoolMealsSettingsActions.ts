import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererSchoolMealsSettingsApi } from '@/api/modules/caterer-school-meals-settings.api'
import type { UpdateSchoolMealsSettingsBody } from '@/api/modules/caterer-school-meals-settings.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Invalidates both this settings namespace and Modules & Required Setup's namespace — the
 *  School Meals checklist card reads these fields directly, so a save here must flip its status. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererSchoolMealsSettings.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.catererModulesRequiredSetup.all })
}

export function useUpdateCatererSchoolMealsSettings() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateSchoolMealsSettingsBody>({
    mutationFn: (body) => catererSchoolMealsSettingsApi.update(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}
