import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererAccountingSettingsApi } from '@/api/modules/caterer-accounting-settings.api'
import type { UpdateAccountingSettingsBody } from '@/api/modules/caterer-accounting-settings.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Invalidates both this settings namespace and Modules & Required Setup's namespace — the
 *  Accounting checklist card reads these fields directly, so a save here must flip its status. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererAccountingSettings.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.catererModulesRequiredSetup.all })
}

export function useUpdateCatererAccountingSettings() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateAccountingSettingsBody>({
    mutationFn: (body) => catererAccountingSettingsApi.update(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}
