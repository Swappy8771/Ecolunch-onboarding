import { useApiMutation } from '@/api/hooks/useApi'
import { validationApi } from '@/api/modules/validation.api'
import type { ExportValidationsQuery } from '@/api/modules/validation.api'
import { downloadBlob } from '@/api/client/http'

/** Wired to the "Export" button — previously permanently `disabled` with no backend route. Mirrors `useExportCaterers`/`useExportContracts`. */
export function useExportValidations() {
  return useApiMutation<void, ExportValidationsQuery>({
    mutationFn: async (query) => {
      const { blob, fileName } = await validationApi.export(query)
      downloadBlob(blob, fileName ?? `validation_center.${query?.format ?? 'csv'}`)
    },
  })
}
