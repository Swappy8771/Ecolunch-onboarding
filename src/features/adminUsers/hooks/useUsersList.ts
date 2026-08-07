import { queryKeys } from '@/api/queryKeys'
import { usersApi } from '@/api/modules/users.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapList } from '@/api/mappers/types'
import { mapUserToOption, type UserSummaryDto } from '../mappers/user.mapper'
import type { UserOptionViewModel } from '../types/user.types'

/** Hand-authored — matches `GET /admin/users`'s real `{ data: UserSummaryDTO[], page, limit, total }` shape. */
interface UsersListResponseDto {
  data: UserSummaryDto[]
  page: number
  limit: number
  total: number
}

async function fetchUsersList(search: string): Promise<UserOptionViewModel[]> {
  const response = (await usersApi.list({ search: search || undefined, status: 'active', limit: 50 })) as UsersListResponseDto
  return mapList(response.data, mapUserToOption)
}

/** Powers the Assigned Admin dropdown/search on the Caterer form — active admins only, capped at 50 (no UI for paging through more than that in a picker). */
export const useUsersList = createQueryHook(
  (search: string) => queryKeys.users.list({ search }),
  fetchUsersList,
)
