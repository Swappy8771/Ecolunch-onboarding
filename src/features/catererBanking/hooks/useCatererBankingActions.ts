import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererBankingApi } from '@/api/modules/caterer-banking.api'
import type { CreateOrUpdateBankingBody } from '@/api/modules/caterer-banking.api'
import { useApiMutation } from '@/api/hooks/useApi'

export function useSaveCatererBanking() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, CreateOrUpdateBankingBody>({
    mutationFn: (body) => catererBankingApi.createOrUpdate(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.catererBanking.all }),
  })
}
