/**
 * Generic, domain-agnostic types reused across modules. Never a copy of a
 * backend DTO — module-specific shapes live in each module's own
 * `types/` folder, mirrored from that module's real backend DTO at
 * integration time (see `development/STANDARDS.md`).
 */

export interface Identifiable {
  id: string
}

export interface Timestamped {
  createdAt: string
  updatedAt: string
}

export type Nullable<T> = T | null

export type Optional<T> = T | undefined
