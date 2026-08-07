import { useApiMutation } from '@/api/hooks/useApi'
import { contractsApi } from '@/api/modules/contracts.api'

/** Hand-authored — matches `getSignedDocumentDownload()`'s real `{ contractId, url }` shape. */
interface ContractDocumentDownloadDto {
  contractId: string
  url: string
}

/**
 * `GET /:cid/document/download` — modeled as a mutation, not a query: the
 * returned URL is a short-lived link (per NOTES.md §6), so caching it in
 * React Query would risk serving an expired URL on a cache hit. Fetched
 * fresh on every click, opened immediately, never stored.
 */
export function useDownloadContract() {
  return useApiMutation<ContractDocumentDownloadDto, string>({
    mutationFn: async (cid: string) => (await contractsApi.getDocumentDownload(cid)) as ContractDocumentDownloadDto,
    onSuccess: data => {
      window.open(data.url, '_blank', 'noopener,noreferrer')
    },
  })
}
