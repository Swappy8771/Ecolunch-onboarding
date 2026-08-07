import { catererContractsApi } from '@/api/modules/caterer-contracts.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { toContractDocumentDownloadViewModel } from '../mappers/catererContracts.mapper'
import type { ContractDocumentDownloadViewModel } from '../types/catererContracts.types'

/**
 * The one imperative action on this otherwise read-only module — getting a
 * fresh download URL for the signed document. Modeled as a mutation (not a
 * query) since it's an on-demand action triggered by a button click, not
 * data to keep in sync — same convention as every other caterer module's
 * imperative actions, kept out of `CatererContractsPage.tsx` itself so the
 * page never calls `catererContractsApi` directly.
 */
export function useCatererContractDownload() {
  return useApiMutation<ContractDocumentDownloadViewModel, string>({
    mutationFn: async (cid) =>
      toContractDocumentDownloadViewModel(
        (await catererContractsApi.getSignedDocumentDownload(cid)) as Parameters<typeof toContractDocumentDownloadViewModel>[0],
      ),
  })
}
