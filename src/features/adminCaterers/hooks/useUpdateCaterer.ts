import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { caterersApi } from '@/api/modules/caterers.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { mapFormInputToRequestBody } from '../mappers/caterer.mapper'
import type { CatererFormInput } from '../types/caterer.types'

export interface UpdateCatererVariables {
  id: string
  input: CatererFormInput
}

/** Wired to the Edit Caterer modal. Sends the full profile (business info, location, verticals, assigned admin, contacts, address, tax) — same request-body shape as create. */
export function useUpdateCaterer() {
  const queryClient = useQueryClient()

  return useApiMutation<unknown, UpdateCatererVariables>({
    mutationFn: ({ id, input }) => caterersApi.update(id, mapFormInputToRequestBody(input)),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.caterers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.caterers.detail(variables.id) })
    },
  })
}
