import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { caterersApi } from '@/api/modules/caterers.api'
import { useApiMutation } from '@/api/hooks/useApi'
import { mapFormInputToRequestBody } from '../mappers/caterer.mapper'
import type { CatererFormInput } from '../types/caterer.types'

/** Full profile — assigned admin, primary/secondary contact, address, tax — is now sent on create, matching the production Admin Portal form. See `development/phase-3-module-integration/Caterers.md` for the field-by-field parity record. */
export function useCreateCaterer() {
  const queryClient = useQueryClient()

  return useApiMutation<unknown, CatererFormInput>({
    mutationFn: input => caterersApi.create(mapFormInputToRequestBody(input)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.caterers.all })
    },
  })
}
