import type { CatererReportiqSettingsViewModel } from '../types/catererReportiqSettings.types'

/** Hand-authored — `reportiq-settings`'s DTO shape has no OpenAPI response schema, same convention as every other hand-authored mapper this session. */
export function toCatererReportiqSettingsViewModel(dto: CatererReportiqSettingsViewModel): CatererReportiqSettingsViewModel {
  return {
    ...dto,
    reportTypes: [...dto.reportTypes],
    recipients: [...dto.recipients],
    establishmentIds: [...dto.establishmentIds],
  }
}
