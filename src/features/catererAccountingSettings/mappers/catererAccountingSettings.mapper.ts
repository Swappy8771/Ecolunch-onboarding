import type { CatererAccountingSettingsViewModel } from '../types/catererAccountingSettings.types'

/** Hand-authored — `accounting-settings`'s DTO shape has no OpenAPI response schema, same convention as every other hand-authored mapper this session. */
export function toCatererAccountingSettingsViewModel(dto: CatererAccountingSettingsViewModel): CatererAccountingSettingsViewModel {
  return { ...dto }
}
