import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererReportiqSettingsApi } from '@/api/modules/caterer-reportiq-settings.api'
import type { UpdateReportiqSettingsBody } from '@/api/modules/caterer-reportiq-settings.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Invalidates both this settings namespace and Modules & Required Setup's namespace — the
 *  ReportIQ checklist card reads these fields directly, so a save here must flip its status. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererReportiqSettings.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.catererModulesRequiredSetup.all })
}

export function useUpdateCatererReportiqSettings() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateReportiqSettingsBody>({
    mutationFn: (body) => catererReportiqSettingsApi.update(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}
