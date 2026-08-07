export type AccountingSoftware = 'acomba' | 'quickbooks' | 'sage' | 'other'

export interface CatererAccountingSettingsViewModel {
  catererId: string
  accountingSoftware: AccountingSoftware | null
  accountingSoftwareOther: string | null
  accountingCodes: string | null
  exportPreference: string | null
  taxSetup: string | null
  updatedAt: string | null
}
