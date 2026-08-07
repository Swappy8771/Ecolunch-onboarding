import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererEstablishmentsApi } from '@/api/modules/caterer-establishments.api'
import type {
  CreateEstablishmentBody, UpdateEstablishmentBody, AddContactBody, AddClosureBody,
} from '@/api/modules/caterer-establishments.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Every mutation invalidates the whole namespace — a change to one establishment affects the
 *  list, the dashboard, the overview completion %, and (for contacts/closures) counts shown there. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererEstablishments.all })
}

export function useCreateCatererEstablishment() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, CreateEstablishmentBody>({
    mutationFn: (body) => catererEstablishmentsApi.create(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface UpdateEstablishmentVariables {
  id: string
  body: UpdateEstablishmentBody
}

export function useUpdateCatererEstablishment() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateEstablishmentVariables>({
    mutationFn: ({ id, body }) => catererEstablishmentsApi.update(id, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useDeleteCatererEstablishment() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (id) => catererEstablishmentsApi.remove(id),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface AddContactVariables {
  id: string
  body: AddContactBody
}

export function useAddCatererContact() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, AddContactVariables>({
    mutationFn: ({ id, body }) => catererEstablishmentsApi.addContact(id, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface RemoveContactVariables {
  id: string
  contactId: string
}

export function useRemoveCatererContact() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, RemoveContactVariables>({
    mutationFn: ({ id, contactId }) => catererEstablishmentsApi.removeContact(id, contactId),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface AddClosureVariables {
  id: string
  body: AddClosureBody
}

export function useAddCatererClosure() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, AddClosureVariables>({
    mutationFn: ({ id, body }) => catererEstablishmentsApi.addClosure(id, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface RemoveClosureVariables {
  id: string
  closureId: string
}

export function useRemoveCatererClosure() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, RemoveClosureVariables>({
    mutationFn: ({ id, closureId }) => catererEstablishmentsApi.removeClosure(id, closureId),
    onSuccess: () => invalidateAll(queryClient),
  })
}
