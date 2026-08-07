import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererProfileApi } from '@/api/modules/caterer-profile.api'
import type {
  UpdateCompanyBody, UpdateBusinessBody, UpdateContactBody, UpdateAddressBody, UpdateTaxBody,
} from '@/api/modules/caterer-profile.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Every mutation invalidates the whole `catererProfile.all` namespace — a PATCH to any one
 *  section changes both `GET /` (the section data) and `GET /overview` (completion %). */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererProfile.all })
}

export function useUpdateCatererCompany() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateCompanyBody>({
    mutationFn: (body) => catererProfileApi.updateCompany(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useUpdateCatererBusiness() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateBusinessBody>({
    mutationFn: (body) => catererProfileApi.updateBusiness(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useUpdateCatererContact() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateContactBody>({
    mutationFn: (body) => catererProfileApi.updateContact(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useUpdateCatererAddress() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateAddressBody>({
    mutationFn: (body) => catererProfileApi.updateAddress(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useUpdateCatererTax() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateTaxBody>({
    mutationFn: (body) => catererProfileApi.updateTax(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}
