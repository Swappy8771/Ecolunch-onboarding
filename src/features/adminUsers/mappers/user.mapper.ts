import type { Mapper } from '@/api/mappers/types'
import type { UserOptionViewModel } from '../types/user.types'

/** Hand-authored — matches `backend/src/modules/users/users.dto.ts`'s `UserSummaryDTO` exactly. */
export interface UserSummaryDto {
  id: string
  firstName: string | null
  lastName: string | null
  fullName: string
  email: string
  status: 'active' | 'inactive' | 'suspended'
}

export const mapUserToOption: Mapper<UserSummaryDto, UserOptionViewModel> = dto => ({
  id: dto.id,
  fullName: dto.fullName,
  email: dto.email,
})
