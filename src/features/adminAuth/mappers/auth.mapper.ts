import type { LoginResponse, LoginResponseUser } from '@/api/modules/auth.api'
import type { AuthUser } from '@/auth/auth.types'

function toAuthUser(dto: LoginResponseUser): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
  }
}

export function toLoginResult(dto: LoginResponse): { token: string; user: AuthUser } {
  return { token: dto.token, user: toAuthUser(dto.user) }
}

/** Display name for the header/avatar — falls back to the email local-part when no name is set. */
export function displayName(user: AuthUser): string {
  const parts = [user.firstName, user.lastName].filter(Boolean)
  if (parts.length) return parts.join(' ')
  return user.email.split('@')[0]
}
