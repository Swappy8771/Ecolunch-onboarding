import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { ecoloopApi } from '@/api/modules/ecoloop.api'
import { useApiMutation } from '@/api/hooks/useApi'
import type { LinkedModule, ConversationPriority } from '../types/ecoloop.types'

/**
 * Every mutation invalidates the whole `ecoloop.all` namespace — a change to
 * one conversation affects the list, the caterer-scoped list, the dashboard
 * counts, and the conversation's own detail/history, same invalidation-scope
 * reasoning as `useValidationDecisions`/`useGoLiveActions`.
 */
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.ecoloop.all });
}

export interface CreateTicketVariables {
  catererId: string
  subject: string
  priority?: ConversationPriority
  linkedModule?: LinkedModule
  linkedEntityId?: string
  initialMessage: { senderId: string; senderName: string; content: string }
}

export function useCreateTicket() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, CreateTicketVariables>({
    mutationFn: (body) => ecoloopApi.create(body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface SendMessageVariables {
  conversationId: string
  senderId: string
  senderName: string
  content: string
  senderType?: 'admin' | 'caterer'
}

export function useSendEcoLoopMessage() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, SendMessageVariables>({
    mutationFn: ({ conversationId, ...body }) => ecoloopApi.sendMessage(conversationId, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface AddNoteVariables {
  conversationId: string
  senderId: string
  senderName: string
  content: string
}

export function useAddEcoLoopNote() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, AddNoteVariables>({
    mutationFn: ({ conversationId, ...body }) => ecoloopApi.addNote(conversationId, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface AddLinkVariables {
  conversationId: string
  module: LinkedModule
  entityId: string
  label?: string
}

export function useAddEcoLoopLink() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, AddLinkVariables>({
    mutationFn: ({ conversationId, ...body }) => ecoloopApi.addLink(conversationId, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface ReassignVariables {
  conversationId: string
  assigneeId: string
  assigneeName: string
}

export function useReassignEcoLoopTicket() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, ReassignVariables>({
    mutationFn: ({ conversationId, ...body }) => ecoloopApi.reassign(conversationId, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface UpdatePriorityVariables {
  conversationId: string
  priority: ConversationPriority
}

export function useUpdateEcoLoopPriority() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, UpdatePriorityVariables>({
    mutationFn: ({ conversationId, priority }) => ecoloopApi.updatePriority(conversationId, { priority }),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useCloseEcoLoopTicket() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (conversationId) => ecoloopApi.close(conversationId),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useReopenEcoLoopTicket() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (conversationId) => ecoloopApi.reopen(conversationId),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useResolveEcoLoopTicket() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, string>({
    mutationFn: (conversationId) => ecoloopApi.resolve(conversationId),
    onSuccess: () => invalidateAll(queryClient),
  })
}
