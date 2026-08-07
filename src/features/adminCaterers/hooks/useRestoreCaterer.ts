import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { caterersApi } from '@/api/modules/caterers.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Wired to a "Restore Caterer" row action, shown only for archived caterers (mirrors `useArchiveCaterer`'s shape). `archived → onboarding` only — see backend `caterer/NOTES.md` §5.2. */
export function useRestoreCaterer() {
  const queryClient = useQueryClient()

  return useApiMutation<unknown, string>({
    mutationFn: (id: string) => caterersApi.restore(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.caterers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.caterers.detail(id) })
    },
  })
}
