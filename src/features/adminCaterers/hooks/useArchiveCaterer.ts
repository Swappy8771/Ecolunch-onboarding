import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { caterersApi } from '@/api/modules/caterers.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Wired to the "Archive Caterer" row action — see `AdminCaterersPage.tsx`. */
export function useArchiveCaterer() {
  const queryClient = useQueryClient()

  return useApiMutation<unknown, string>({
    mutationFn: (id: string) => caterersApi.archive(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.caterers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.caterers.detail(id) })
    },
  })
}
