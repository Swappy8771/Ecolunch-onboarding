import { caterersApi, type ExportQuery } from '@/api/modules/caterers.api'
import { downloadBlob } from '@/api/client/http'
import { useApiMutation } from '@/api/hooks/useApi'

/**
 * Wired to the "Export" button — previously had no `onClick` at all. Fetches
 * the currently-applied filters as CSV/XLSX via `httpClient.getBlob` and
 * triggers a browser download; falls back to a generic filename only if
 * the response has no `Content-Disposition` header.
 */
export function useExportCaterers() {
  return useApiMutation<void, ExportQuery>({
    mutationFn: async (query) => {
      const { blob, fileName } = await caterersApi.export(query)
      downloadBlob(blob, fileName ?? `caterers.${query.format ?? 'csv'}`)
    },
  })
}
