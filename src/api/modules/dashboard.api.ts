/**
 * Dashboard API module — typed functions only, no React/Query/UI code.
 * Backend: `GET /api/admin/dashboard` — the 4 stat-card counts (Caterers
 * Onboarding, Open Validations, EcoLoop Tickets, Blocked Go-Lives),
 * aggregated server-side over Caterers/Validation/EcoLoop/Go-live's own
 * real services. Admin-only, no caterer-facing equivalent.
 */
import { httpClient } from '../client/http'

export const dashboardApi = {
  getStats: () => httpClient.get<unknown>('/admin/dashboard'),
} as const
