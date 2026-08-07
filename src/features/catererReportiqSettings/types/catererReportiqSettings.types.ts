export interface CatererReportiqSettingsViewModel {
  catererId: string
  reportTypes: string[]
  recipients: string[]
  frequency: string | null
  format: string | null
  establishmentIds: string[]
  automationNeeds: string | null
  updatedAt: string | null
}
