/**
 * Thin, typed wrappers around TanStack Query's core hooks, scoped to
 * this project's `ApiError` type. Every future per-module hook
 * (`useEstablishmentsQuery`, `useCloseCorrectionMutation`, etc.) should
 * build on these rather than calling `useQuery`/`useMutation` directly,
 * so error typing is consistent everywhere instead of each module
 * re-declaring `TError` as `unknown`/`Error`/`any`. No module-specific
 * query is defined here — see `knowledge/03-frontend/phase-1-foundation/
 * REACT_QUERY.md` for the full strategy.
 */
import { useMutation, useQuery, type UseMutationOptions, type UseMutationResult, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import type { ApiError } from '../client/errors'

export function useApiQuery<TData>(
  options: UseQueryOptions<TData, ApiError>,
): UseQueryResult<TData, ApiError> {
  return useQuery<TData, ApiError>(options)
}

export function useApiMutation<TData, TVariables = void>(
  options: UseMutationOptions<TData, ApiError, TVariables>,
): UseMutationResult<TData, ApiError, TVariables> {
  return useMutation<TData, ApiError, TVariables>(options)
}
