import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererDaycareMealsSettingsApi } from '@/api/modules/caterer-daycare-meals-settings.api'
import type { UpdateDaycareMealsSettingsBody } from '@/api/modules/caterer-daycare-meals-settings.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Invalidates both this settings namespace and Modules & Required Setup's namespace — the
 *  Daycare / CPE Meals checklist card reads these fields directly, so a save here must flip its status. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererDaycareMealsSettings.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.catererModulesRequiredSetup.all })
}

export function useUpdateCatererDaycareMealsSettings() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateDaycareMealsSettingsBody>({
    mutationFn: (body) => catererDaycareMealsSettingsApi.update(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}
