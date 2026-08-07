import { queryKeys } from '@/api/queryKeys'
import { documentVaultApi } from '@/api/modules/documentVault.api'
import { useApiQuery } from '@/api/hooks/useApi'

/**
 * On-demand lookups behind the Document Table row menu's read-only actions
 * (View Version History / View Audit Trail / View Extracted Fields / View
 * Validation Status / View — "open in Dropbox"). Each is only fetched while
 * its modal is open (`enabled: open`), since none of these are needed for
 * the table itself.
 */

export interface DocumentAuditEntry {
  _id: string
  action: string
  actorId: string | null
  createdAt: string
  oldValue: unknown
  newValue: unknown
}

interface DocumentHistoryResponse {
  document: { id?: string; _id?: string; fileName: string }
  history: DocumentAuditEntry[]
}

export function useDocumentHistory(docId: string, open: boolean) {
  return useApiQuery<DocumentHistoryResponse>({
    queryKey: queryKeys.documentVault.history(docId),
    queryFn: () => documentVaultApi.getHistory(docId) as Promise<DocumentHistoryResponse>,
    enabled: open,
  })
}

interface DocumentDetailResponse {
  document: { id: string; version: number; fileName: string }
  versions: { id: string; version: number; fileName: string; status: string; createdAt: string; uploadedByName: string | null }[]
}

export function useDocumentVersions(docId: string, open: boolean) {
  return useApiQuery<DocumentDetailResponse>({
    queryKey: ['documentVault', 'versions', docId] as const,
    queryFn: () => documentVaultApi.getById(docId) as Promise<DocumentDetailResponse>,
    enabled: open,
  })
}

interface ExtractedFieldsResponse {
  documentId: string
  extractedFields: Record<string, unknown>
}

export function useExtractedFields(docId: string, open: boolean) {
  return useApiQuery<ExtractedFieldsResponse>({
    queryKey: ['documentVault', 'extracted-fields', docId] as const,
    queryFn: () => documentVaultApi.getExtractedFields(docId) as Promise<ExtractedFieldsResponse>,
    enabled: open,
  })
}

interface ValidationStatusResponse {
  documentId: string
  validationStatus: string | null
  validationItemId?: string
  validationType?: string
  message?: string
}

export function useDocumentValidationStatus(docId: string, open: boolean) {
  return useApiQuery<ValidationStatusResponse>({
    queryKey: ['documentVault', 'validation-status', docId] as const,
    queryFn: () => documentVaultApi.getValidationStatus(docId) as Promise<ValidationStatusResponse>,
    enabled: open,
  })
}

interface DropboxLinkResponse {
  documentId: string
  fileName: string
  dropboxLink: string
}

export function useOpenDropboxLink(docId: string, open: boolean) {
  return useApiQuery<DropboxLinkResponse>({
    queryKey: ['documentVault', 'open-dropbox', docId] as const,
    queryFn: () => documentVaultApi.getOpenDropbox(docId) as Promise<DropboxLinkResponse>,
    enabled: open,
  })
}
