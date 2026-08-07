/**
 * Builds a ready-to-use `useXMutation()` hook from a mutation function, so
 * a Phase 2 module hook is a one-line declaration instead of hand-written
 * `useMutation` boilerplate:
 *
 *   export const useCloseCorrectionMutation = createMutationHook(
 *     (id: string) => correctionsApi.close(id),
 *   )
 *
 * Invalidation is deliberately NOT baked into this factory — per
 * `development/phase-1-foundation/REACT_QUERY.md`, every mutation
 * invalidates the *specific* query keys it affects, which differs per
 * mutation (e.g. closing a Correction should also invalidate the
 * relevant Go-Live summary). That decision belongs to each module's own
 * hook declaration (passed via `options.onSuccess`), not this shared
 * factory. No module-specific hook is declared in this file.
 */
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query'
import { useApiMutation } from './useApi'
import type { ApiError } from '../client/errors'

type BaseMutationOptions<TData, TVariables> = Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>

export function createMutationHook<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  baseOptions?: BaseMutationOptions<TData, TVariables>,
) {
  return function useGeneratedMutation(
    options?: BaseMutationOptions<TData, TVariables>,
  ): UseMutationResult<TData, ApiError, TVariables> {
    return useApiMutation<TData, TVariables>({
      mutationFn,
      ...baseOptions,
      ...options,
    })
  }
}
