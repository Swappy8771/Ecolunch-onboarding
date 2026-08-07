/**
 * Modules & Pricing API module — typed functions only, no React/Query/UI
 * code. Backend: `/api/admin/modules-pricing/*`.
 *
 * "Modules & Required Setup" (`/api/admin/modules-required-setup/*`) is a
 * distinct backend module (aggregation/read-only, no persistence of its
 * own — see backend NOTES.md) and gets its own `modulesRequiredSetup.api.ts`
 * file, mirroring the query-key split already made in `queryKeys.ts`
 * (`modules` vs `modulesRequiredSetup`).
 */
import { httpClient } from '../client/http'
import type { RequestBody } from '../generated/helpers'

type SetModuleBody = RequestBody<'/admin/modules-pricing/caterers/{catererId}/modules/{moduleKey}', 'put'>
type SetPricingRulesBody = RequestBody<'/admin/modules-pricing/caterers/{catererId}/modules/{moduleKey}/rules', 'patch'>
type SetPricingBody = RequestBody<'/admin/modules-pricing/caterers/{catererId}/modules/{moduleKey}/pricing', 'post'>
type SetConfigurationBody =
  RequestBody<'/admin/modules-pricing/caterers/{catererId}/modules/{moduleKey}/configuration', 'post'>
type SetCommercialTermsBody =
  RequestBody<'/admin/modules-pricing/caterers/{catererId}/modules/{moduleKey}/commercial-terms', 'post'>

export const modulesApi = {
  getCatalogue: () => httpClient.get<unknown>('/admin/modules-pricing/catalogue'),

  getForCaterer: (catererId: string) => httpClient.get<unknown>(`/admin/modules-pricing/caterers/${catererId}`),

  getSummary: (catererId: string) => httpClient.get<unknown>(`/admin/modules-pricing/caterers/${catererId}/summary`),

  /** `configureModuleSchema` requires at least one field — this previously sent no body at all, which would always 400. */
  setModule: (catererId: string, moduleKey: string, body: SetModuleBody) =>
    httpClient.put<unknown>(`/admin/modules-pricing/caterers/${catererId}/modules/${moduleKey}`, body),

  setPricingRules: (catererId: string, moduleKey: string, body: SetPricingRulesBody) =>
    httpClient.patch<unknown>(`/admin/modules-pricing/caterers/${catererId}/modules/${moduleKey}/rules`, body),

  getPricing: (catererId: string, moduleKey: string) =>
    httpClient.get<unknown>(`/admin/modules-pricing/caterers/${catererId}/modules/${moduleKey}/pricing`),

  setPricing: (catererId: string, moduleKey: string, body: SetPricingBody) =>
    httpClient.post<unknown>(`/admin/modules-pricing/caterers/${catererId}/modules/${moduleKey}/pricing`, body),

  getConfiguration: (catererId: string, moduleKey: string) =>
    httpClient.get<unknown>(`/admin/modules-pricing/caterers/${catererId}/modules/${moduleKey}/configuration`),

  setConfiguration: (catererId: string, moduleKey: string, body: SetConfigurationBody) =>
    httpClient.post<unknown>(`/admin/modules-pricing/caterers/${catererId}/modules/${moduleKey}/configuration`, body),

  setCommercialTerms: (catererId: string, moduleKey: string, body: SetCommercialTermsBody) =>
    httpClient.post<unknown>(`/admin/modules-pricing/caterers/${catererId}/modules/${moduleKey}/commercial-terms`, body),

  getHistory: (catererId: string, moduleKey: string) =>
    httpClient.get<unknown>(`/admin/modules-pricing/caterers/${catererId}/modules/${moduleKey}/history`),

  getCompleteConfiguration: (catererId: string) =>
    httpClient.get<unknown>(`/admin/modules-pricing/caterers/${catererId}/complete-configuration`),

  getValidationStatus: (catererId: string) =>
    httpClient.get<unknown>(`/admin/modules-pricing/caterers/${catererId}/validation-status`),

  getContractReadiness: (catererId: string) =>
    httpClient.get<unknown>(`/admin/modules-pricing/caterers/${catererId}/contract-readiness`),
} as const
