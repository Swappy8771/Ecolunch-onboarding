import { queryKeys } from '@/api/queryKeys'
import { catererBankingApi } from '@/api/modules/caterer-banking.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { ApiError } from '@/api/client/errors'
import { toBankingRecordViewModel, toBankingOverviewViewModel } from '../mappers/catererBanking.mapper'
import type { BankingRecordViewModel, BankingOverviewViewModel } from '../types/catererBanking.types'

/** No banking record submitted yet is a normal, expected 404 — resolves to `null`, not an error state. */
export const useCatererBanking = createQueryHook(
  () => queryKeys.catererBanking.detail,
  async (): Promise<BankingRecordViewModel | null> => {
    try {
      return toBankingRecordViewModel((await catererBankingApi.get()) as Parameters<typeof toBankingRecordViewModel>[0])
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null
      throw err
    }
  },
)

export const useCatererBankingOverview = createQueryHook(
  () => queryKeys.catererBanking.overview,
  async (): Promise<BankingOverviewViewModel> =>
    toBankingOverviewViewModel((await catererBankingApi.getOverview()) as Parameters<typeof toBankingOverviewViewModel>[0]),
)
