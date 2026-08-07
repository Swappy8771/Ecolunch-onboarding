import { queryKeys } from '@/api/queryKeys'
import { correctionsApi } from '@/api/modules/corrections.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { toCorrectionListResult } from '../mappers/adminCorrections.mapper'
import type { CorrectionListFilters, CorrectionListResult } from '../types/adminCorrections.types'

/** The Validation Center item's own correction(s), if any were raised against it. */
export const useCorrectionsByValidationItem = createQueryHook(
  (validationItemId: string) => queryKeys.corrections.list({ validationItemId }),
  async (validationItemId: string): Promise<CorrectionListResult> =>
    toCorrectionListResult(
      (await correctionsApi.list({ validationItemId, limit: 20 })) as Parameters<typeof toCorrectionListResult>[0],
    ),
)

/** The Document Vault document's own correction(s), if any were raised against it. */
export const useCorrectionsByDocument = createQueryHook(
  (documentId: string) => queryKeys.corrections.list({ linkedDocumentId: documentId }),
  async (documentId: string): Promise<CorrectionListResult> =>
    toCorrectionListResult(
      (await correctionsApi.list({ linkedDocumentId: documentId, limit: 20 })) as Parameters<typeof toCorrectionListResult>[0],
    ),
)

export type { CorrectionListFilters }
