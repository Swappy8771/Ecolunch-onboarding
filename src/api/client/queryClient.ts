/**
 * The single TanStack Query client instance for the app. Defaults chosen
 * per `knowledge/03-frontend/phase-1-foundation/REACT_QUERY.md`:
 *   - staleTime: 30s — admin data changes via explicit actions, not
 *     high-frequency, so a short-lived "fresh" window avoids redundant
 *     refetching without going stale for long.
 *   - gcTime: 5 minutes — default-ish, revisit only if a real memory/
 *     staleness problem is observed.
 *   - retry: 3 for queries (network hiccups), 0 for mutations (a failed
 *     POST/PATCH should surface to the user, not silently retry an
 *     action that might not be idempotent).
 *   - refetchOnWindowFocus: false — admin pages don't need "wake the tab,
 *     refetch everything" behavior by default.
 */
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
