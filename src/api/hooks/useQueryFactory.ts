/**
 * Builds a ready-to-use `useXQuery(args)` hook from a query-key builder +
 * a fetcher function, so a Phase 2 module hook is a one-line declaration
 * instead of hand-written `useQuery` boilerplate:
 *
 *   export const useGoLiveSummaryQuery = createQueryHook(
 *     (catererId: string) => queryKeys.golive.summary(catererId),
 *     (catererId: string) => goliveApi.getSummary(catererId),
 *   )
 *
 * No module-specific hook is declared in this file — this is the factory
 * only, per this phase's scope.
 */
import type { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useApiQuery } from './useApi'
import type { ApiError } from '../client/errors'

type BaseQueryOptions<TData> = Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>

export function createQueryHook<TArgs, TData>(
  buildKey: (args: TArgs) => QueryKey,
  queryFn: (args: TArgs) => Promise<TData>,
  baseOptions?: BaseQueryOptions<TData>,
) {
  return function useGeneratedQuery(args: TArgs, options?: BaseQueryOptions<TData>): UseQueryResult<TData, ApiError> {
    return useApiQuery<TData>({
      queryKey: buildKey(args),
      queryFn: () => queryFn(args),
      ...baseOptions,
      ...options,
    })
  }
}
