import { queryKeys } from '@/api/queryKeys'
import { catererContractsApi } from '@/api/modules/caterer-contracts.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { useApiQuery } from '@/api/hooks/useApi'
import {
  toContractListResult, toContractDetailViewModel, toContractProgressViewModel, toContractDocumentViewModel,
} from '../mappers/catererContracts.mapper'
import type {
  ContractListItemViewModel, ContractDetailViewModel, ContractProgressViewModel, ContractDocumentViewModel,
} from '../types/catererContracts.types'

export const useCatererContractsList = createQueryHook(
  () => queryKeys.catererContracts.list,
  async (): Promise<ContractListItemViewModel[]> =>
    toContractListResult((await catererContractsApi.list()) as Parameters<typeof toContractListResult>[0]),
)

export const useCatererContractsProgress = createQueryHook(
  () => queryKeys.catererContracts.progress,
  async (): Promise<ContractProgressViewModel> =>
    toContractProgressViewModel((await catererContractsApi.getProgress()) as Parameters<typeof toContractProgressViewModel>[0]),
)

export function useCatererContractDetail(cid: string, enabled: boolean) {
  return useApiQuery<ContractDetailViewModel>({
    queryKey: queryKeys.catererContracts.detail(cid),
    queryFn: async () =>
      toContractDetailViewModel((await catererContractsApi.getById(cid)) as Parameters<typeof toContractDetailViewModel>[0]),
    enabled,
  })
}

export function useCatererContractDocument(cid: string, enabled: boolean) {
  return useApiQuery<ContractDocumentViewModel>({
    queryKey: queryKeys.catererContracts.document(cid),
    queryFn: async () =>
      toContractDocumentViewModel((await catererContractsApi.getSignedDocument(cid)) as Parameters<typeof toContractDocumentViewModel>[0]),
    enabled,
  })
}
