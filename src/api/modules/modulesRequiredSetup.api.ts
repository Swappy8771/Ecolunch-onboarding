/**
 * Modules & Required Setup API module — typed functions only, no
 * React/Query/UI code. Backend: `/api/admin/modules-required-setup/*`
 * (pure aggregation/orchestration over Modules & Pricing + Document
 * Vault + Establishments + Menus — no persistence of its own, per its
 * backend NOTES.md). Split from `modules.api.ts` because it is a
 * distinct backend module, mirroring the `modules` /
 * `modulesRequiredSetup` split already made in `queryKeys.ts`.
 */
import { httpClient } from '../client/http'

export const modulesRequiredSetupApi = {
  getActiveModules: (catererId: string) =>
    httpClient.get<unknown>(`/admin/modules-required-setup/caterers/${catererId}/active-modules`),

  getOverview: (catererId: string) =>
    httpClient.get<unknown>(`/admin/modules-required-setup/caterers/${catererId}/overview`),

  getProgress: (catererId: string) =>
    httpClient.get<unknown>(`/admin/modules-required-setup/caterers/${catererId}/progress`),

  getMissingItems: (catererId: string) =>
    httpClient.get<unknown>(`/admin/modules-required-setup/caterers/${catererId}/missing-items`),

  getModuleDetail: (catererId: string, moduleKey: string) =>
    httpClient.get<unknown>(`/admin/modules-required-setup/caterers/${catererId}/modules/${moduleKey}`),
} as const
