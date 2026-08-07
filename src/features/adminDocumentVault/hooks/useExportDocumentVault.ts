import { useApiMutation } from '@/api/hooks/useApi'
import { documentVaultApi } from '@/api/modules/documentVault.api'
import type { ExportVaultQuery } from '@/api/modules/documentVault.api'
import { downloadBlob } from '@/api/client/http'

/** Wired to the "Export" button — previously had no `onClick` at all. Mirrors `useExportCaterers`/`useExportContracts`. */
export function useExportDocumentVault() {
  return useApiMutation<void, ExportVaultQuery>({
    mutationFn: async (query) => {
      const { blob, fileName } = await documentVaultApi.exportVaultSummary(query)
      downloadBlob(blob, fileName ?? `document_vault.${query?.format ?? 'csv'}`)
    },
  })
}
