import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { validationApi } from '@/api/modules/validation.api'
import { useApiMutation } from '@/api/hooks/useApi'

/**
 * The 6 decision/action mutations behind the row/drawer actions — approve,
 * reject, request-correction, add note, send via EcoLoop. Every mutation
 * invalidates the whole `validation.all` namespace (not a bare
 * `invalidateQueries()`): a decision changes this item's status, the
 * queue's filtered lists, and (for approve) the linked caterer's go-live
 * gate — same invalidation-scope reasoning already used for Document
 * Vault's `useReviewDocument`.
 */

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.validation.all })
}

export function useApproveValidation() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (vid: string) => validationApi.approve(vid),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface RejectValidationVariables {
  vid: string
  reason: string
}

export function useRejectValidation() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, RejectValidationVariables>({
    mutationFn: ({ vid, reason }) => validationApi.reject(vid, { reason }),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface RequestCorrectionVariables {
  vid: string
  description: string
  priority?: 'high' | 'medium' | 'low'
}

export function useRequestCorrectionValidation() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, RequestCorrectionVariables>({
    mutationFn: ({ vid, description, priority }) => validationApi.requestCorrection(vid, { description, priority }),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface AddValidationNoteVariables {
  vid: string
  note: string
}

export function useAddValidationNote() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, AddValidationNoteVariables>({
    mutationFn: ({ vid, note }) => validationApi.addNote(vid, { note }),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface SendValidationEcoLoopVariables {
  vid: string
  message: string
}

/**
 * Sends via `POST /:vid/send-ecoloop`. Note (documented, not hidden): this
 * hits `integrations/ecoloop.ts`'s adapter, a separate, always-stub
 * integration — not the app's own fully-built `modules/ecoloop`
 * conversation engine. The message is still recorded on the validation
 * item's `internalNotes[]` and audit log either way.
 */
export function useSendValidationEcoLoop() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, SendValidationEcoLoopVariables>({
    mutationFn: ({ vid, message }) => validationApi.sendToEcoLoop(vid, { message }),
    onSuccess: () => invalidateAll(queryClient),
  })
}
