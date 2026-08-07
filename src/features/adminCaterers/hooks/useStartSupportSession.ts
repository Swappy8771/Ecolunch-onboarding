import { caterersApi, type StartSupportSessionResult } from '@/api/modules/caterers.api'
import { useApiMutation } from '@/api/hooks/useApi'

export interface StartSupportSessionVariables {
  id: string
  reason: string
}

/** "Open Support Access Session" — mints a real, short-lived Caterer Portal token; the audit
 *  entry (actor + reason) is written server-side, not here. See `AdminCaterersPage.tsx`. */
export function useStartSupportSession() {
  return useApiMutation<StartSupportSessionResult, StartSupportSessionVariables>({
    mutationFn: ({ id, reason }) => caterersApi.startSupportSession(id, reason),
  })
}
