import type { CatererAuthUser } from '@/auth/caterer/catererAuth.types'

interface CatererLoginResponseUser {
  id: string
  catererId: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  status: string
}

export interface CatererLoginResponse {
  token: string
  user: CatererLoginResponseUser
}

function toCatererAuthUser(dto: CatererLoginResponseUser): CatererAuthUser {
  return {
    id: dto.id,
    catererId: dto.catererId,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    role: dto.role as CatererAuthUser['role'],
    status: dto.status as CatererAuthUser['status'],
  }
}

export function toCatererLoginResult(dto: CatererLoginResponse): { token: string; user: CatererAuthUser } {
  return { token: dto.token, user: toCatererAuthUser(dto.user) }
}

/** Display name for the header/avatar — falls back to the email local-part when no name is set. */
export function catererDisplayName(user: CatererAuthUser): string {
  const parts = [user.firstName, user.lastName].filter(Boolean)
  if (parts.length) return parts.join(' ')
  return user.email.split('@')[0]
}
