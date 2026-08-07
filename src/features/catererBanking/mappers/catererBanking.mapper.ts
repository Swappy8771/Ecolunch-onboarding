import type {
  BankingRecordViewModel,
  BankingOverviewViewModel,
  BankingSectionResultViewModel,
  BankingMissingDocumentViewModel,
} from '../types/catererBanking.types'

/**
 * Hand-authored, not generated — `modules/banking`'s responses have no
 * documented OpenAPI response schema (same pattern as every other
 * hand-authored mapper this session), so these mirror `banking.dto.ts`'s
 * actual DTO shapes directly.
 */

export function toBankingRecordViewModel(dto: BankingRecordViewModel): BankingRecordViewModel {
  return {
    ...dto,
    institution: { ...dto.institution },
    account: { ...dto.account },
    transit: { ...dto.transit },
    documents: { ...dto.documents },
  }
}

export function toBankingOverviewViewModel(dto: {
  completion: {
    completionPercentage: number
    completedFields: string[]
    missingFields: string[]
    totalFields: number
    sections: BankingSectionResultViewModel[]
  }
  missingDocuments: BankingMissingDocumentViewModel[]
}): BankingOverviewViewModel {
  return {
    completion: {
      completionPercentage: dto.completion.completionPercentage,
      completedFields: [...dto.completion.completedFields],
      missingFields: [...dto.completion.missingFields],
      totalFields: dto.completion.totalFields,
      sections: dto.completion.sections.map((s) => ({ ...s })),
    },
    missingDocuments: dto.missingDocuments.map((d) => ({ ...d })),
  }
}
