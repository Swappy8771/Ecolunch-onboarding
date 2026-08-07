import { useApiMutation } from '@/api/hooks/useApi'
import { contractsApi, type ExportContractsQuery } from '@/api/modules/contracts.api'
import { downloadBlob } from '@/api/client/http'

/** Wired to the "Export" button — previously had no `onClick` at all. Mirrors `useExportCaterers`. */
export function useExportContracts() {
  return useApiMutation<void, ExportContractsQuery>({
    mutationFn: async (query) => {
      const { blob, fileName } = await contractsApi.export(query)
      downloadBlob(blob, fileName ?? `contracts.${query.format ?? 'csv'}`)
    },
  })
}
