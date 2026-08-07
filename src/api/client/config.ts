/**
 * Central environment/config resolution for the API layer. This is the
 * only file that reads `import.meta.env` for API concerns — no hardcoded
 * URLs anywhere else in `src/api/`.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export const DEFAULT_TIMEOUT_MS = 15_000
