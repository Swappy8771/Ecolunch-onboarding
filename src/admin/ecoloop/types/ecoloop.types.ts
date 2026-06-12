export type TicketStatus   = 'open' | 'pending' | 'closed' | 'blocked'
export type Priority       = 'critical' | 'high' | 'medium' | 'low'
export type MessageType    = 'admin' | 'client' | 'system'
export type LinkedObjType  = 'validation' | 'document' | 'smart-import' | 'contract' | 'golive-blocker'

export type TicketCategory =
  | 'correction-request'
  | 'client-message'
  | 'validation-followup'
  | 'contract-followup'
  | 'golive-blocker'
  | 'internal'

export interface Message {
  id: string
  type: MessageType
  sender: string
  ts: string
  content: string
}

export interface InternalNote {
  id: string
  author: string
  ts: string
  content: string
}

export interface SystemEvent {
  id: string
  ts: string
  event: string
  detail: string | null
}

export interface LinkedObject {
  id: string
  type: LinkedObjType
  name: string
  status: string
  refId: string
}

export interface CorrectionRequest {
  id: string
  item: string
  status: 'open' | 'resolved' | 'closed'
  createdAt: string
  linkedTicketId: string
}

export interface ValidationFollowup {
  id: string
  item: string
  status: string
  assignedAdmin: string
  dueDate: string
  linkedTicketId: string
}

export interface Ticket {
  id: string
  number: string
  caterer: string
  catererId: string
  category: TicketCategory
  priority: Priority
  status: TicketStatus
  assignedTo: string
  lastActivity: string
  createdAt: string
  subject: string
  conversation: Message[]
  internalNotes: InternalNote[]
  systemEvents: SystemEvent[]
  linkedObjects: LinkedObject[]
  correctionRequests: CorrectionRequest[]
  validationFollowups: ValidationFollowup[]
}
