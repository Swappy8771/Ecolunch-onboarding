export type BankingAccountType = 'checking' | 'savings' | 'business'

export interface BankingInstitutionViewModel {
  bankName: string | null
  branchName: string | null
  branchCode: string | null
  bicSwift: string | null
  bankCountry: string | null
}

/** Sensitive fields are last4-masked only — the backend never returns a full IBAN/account number here. */
export interface BankingAccountViewModel {
  accountHolder: string | null
  accountType: BankingAccountType | null
  currency: string | null
  ibanLast4: string | null
  accountNumberLast4: string | null
}

export interface BankingTransitViewModel {
  transitNumber: string | null
  institutionNumber: string | null
  codeEtablissement: string | null
  codeGuichet: string | null
  cleRib: string | null
  sepaCompliant: boolean | null
}

export interface BankingDocumentReferencesViewModel {
  ribDocumentId: string | null
  bankStatementDocId: string | null
  authorizationLetterId: string | null
}

export interface BankingRecordViewModel {
  id: string
  catererId: string
  institution: BankingInstitutionViewModel
  account: BankingAccountViewModel
  transit: BankingTransitViewModel
  documents: BankingDocumentReferencesViewModel
  submittedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface BankingMissingDocumentViewModel {
  documentKey: string
  label: string
}

export interface BankingSectionResultViewModel {
  key: string
  percentage: number
  validationStatus: string
}

export interface BankingCompletionViewModel {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: BankingSectionResultViewModel[]
}

export interface BankingOverviewViewModel {
  completion: BankingCompletionViewModel
  missingDocuments: BankingMissingDocumentViewModel[]
}
