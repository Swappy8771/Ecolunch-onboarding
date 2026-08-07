/**
 * Auth-domain utility re-exports. Deliberately thin — the actual
 * storage mechanism is owned by `shared/utils/storage.ts` (the one place
 * that knows the `authToken` key name); this file exists so `src/auth/`
 * consumers import from their own domain folder rather than reaching
 * into `shared/utils` directly, keeping the option open to add real
 * auth-only logic here later (e.g. token expiry parsing) without
 * relocating callers.
 */
import { getStoredToken, hasStoredToken } from '@shared/utils/storage'

export { getStoredToken, hasStoredToken }
