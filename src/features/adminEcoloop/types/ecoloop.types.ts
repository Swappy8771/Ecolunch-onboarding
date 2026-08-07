export type ConversationStatus = 'open' | 'waiting_for_caterer' | 'waiting_for_admin' | 'resolved' | 'closed'
export type ConversationPriority = 'low' | 'normal' | 'high' | 'urgent'
export type LinkedModule =
  | 'validation'
  | 'documents'
  | 'contracts'
  | 'modules-pricing'
  | 'go-live'
  | 'corrections'
  | 'smart-import'
  | 'school_meals'
  | 'daycare_meals'
  | 'camp_meals'
  | 'accounting'
  | 'reportiq'
export type SenderType = 'admin' | 'caterer' | 'system' | 'api'

export interface LinkedItemViewModel {
  module: LinkedModule
  entityId: string
  label: string | null
  linkedAt: string
}

export interface ConversationViewModel {
  id: string
  catererId: string
  catererName: string
  subject: string
  status: ConversationStatus
  priority: ConversationPriority
  linkedModule: LinkedModule | null
  linkedEntityId: string | null
  linkedItems: LinkedItemViewModel[]
  assigneeId: string | null
  assigneeName: string | null
  messageCount: number
  lastMessageAt: string | null
  resolvedAt: string | null
  closedAt: string | null
  createdAt: string
}

export interface MessageViewModel {
  id: string
  conversationId: string
  senderId: string
  senderType: SenderType
  senderName: string
  content: string
  isInternal: boolean
  createdAt: string
}

export interface ParticipantViewModel {
  userId: string
  userName: string
  userType: 'admin' | 'caterer'
  role: 'initiator' | 'participant'
}

export interface ConversationDetailViewModel {
  conversation: ConversationViewModel
  messages: MessageViewModel[]
  participants: ParticipantViewModel[]
}

export interface AuditEntryViewModel {
  timestamp: string
  action: string
  actorId: string | null
  actorType: string
}

export interface ConversationHistoryViewModel {
  conversation: ConversationViewModel
  messages: MessageViewModel[]
  auditHistory: AuditEntryViewModel[]
}

export interface DashboardViewModel {
  totalConversations: number
  open: number
  waitingForCaterer: number
  waitingForAdmin: number
  resolved: number
  closed: number
  recentConversations: ConversationViewModel[]
}

export interface ConversationListFilters {
  status?: ConversationStatus
  priority?: ConversationPriority
  linkedModule?: LinkedModule
  limit?: number
  offset?: number
}

export interface ConversationListResult {
  items: ConversationViewModel[]
  total: number
  limit: number
  offset: number
}
