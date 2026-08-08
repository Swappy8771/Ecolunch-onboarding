import { queryKeys } from '@/api/queryKeys'
import { caterersApi } from '@/api/modules/caterers.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { mapNullable } from '@/api/mappers/types'
import { mapCatererToViewModel, type CatererDto } from '../mappers/caterer.mapper'
import type { CatererViewModel } from '../types/caterer.types'

/**
 * Hand-authored, not generated — `GET /admin/caterers/{id}` has no
 * response schema in the OpenAPI spec. `getById` wraps the caterer
 * alongside its onboarding file and go-live checklist; this hook exposes
 * only the caterer itself as a ViewModel (the current admin page's detail
 * modal doesn't need the other two — see
 * `knowledge/03-frontend/phase-3-module-integration/Caterers.md`).
 */
interface CatererDetailResponseDto {
  caterer: CatererDto
  onboardingFile: unknown
  checklist: unknown
}

async function fetchCaterer(id: string): Promise<CatererViewModel | null> {
  const response = (await caterersApi.getById({ id })) as CatererDetailResponseDto
  return mapNullable(response.caterer, mapCatererToViewModel)
}

/** Wired into the Edit Caterer modal — the list row's ViewModel never carries contacts/address/tax (`CatererListItemDTO` is deliberately lighter than `CatererResponseDTO`), so editing requires this full detail read. */
export const useCaterer = createQueryHook(
  (id: string) => queryKeys.caterers.detail(id),
  fetchCaterer,
)
