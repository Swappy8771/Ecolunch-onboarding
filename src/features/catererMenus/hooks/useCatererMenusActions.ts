import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { catererMenusApi } from '@/api/modules/caterer-menus.api'
import type { CreateMenuBody, UpdateMenuBody, CreateDishBody } from '@/api/modules/caterer-menus.api'
import { useApiMutation } from '@/api/hooks/useApi'

/** Every mutation invalidates the whole `catererMenus.all` namespace — a change to any menu or
 *  dish affects the list, the overview completion %, and (for dishes) every menu referencing them. */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.catererMenus.all })
}

export function useCreateCatererMenu() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, CreateMenuBody>({
    mutationFn: (body) => catererMenusApi.create(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface UpdateMenuVariables {
  id: string
  body: UpdateMenuBody
}

export function useUpdateCatererMenu() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdateMenuVariables>({
    mutationFn: ({ id, body }) => catererMenusApi.update(id, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useDeleteCatererMenu() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (id) => catererMenusApi.remove(id),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useCreateCatererDish() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, CreateDishBody>({
    mutationFn: (body) => catererMenusApi.createDish(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useDeleteCatererDish() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (dishId) => catererMenusApi.deleteDish(dishId),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface MenuDishVariables {
  menuId: string
  dishId: string
}

export function useAddDishToCatererMenu() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, MenuDishVariables>({
    mutationFn: ({ menuId, dishId }) => catererMenusApi.addDishToMenu(menuId, dishId),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useRemoveDishFromCatererMenu() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, MenuDishVariables>({
    mutationFn: ({ menuId, dishId }) => catererMenusApi.removeDishFromMenu(menuId, dishId),
    onSuccess: () => invalidateAll(queryClient),
  })
}
