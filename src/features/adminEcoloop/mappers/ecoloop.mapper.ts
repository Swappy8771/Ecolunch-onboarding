import type {
  ConversationViewModel,
  MessageViewModel,
  ParticipantViewModel,
  LinkedItemViewModel,
  ConversationDetailViewModel,
  ConversationHistoryViewModel,
  AuditEntryViewModel,
  DashboardViewModel,
  ConversationListResult,
} from '../types/ecoloop.types'

/**
 * Hand-authored, not generated — none of `modules/ecoloop`'s responses have a
 * documented `content.application/json.schema` in the OpenAPI spec (matches
 * `RequestBody`'s own header note about response schemas being largely
 * undocumented today), so these mirror `ecoloop.service.ts`'s actual return
 * shapes directly.
 */

interface ConversationDto {
  _id: string
  catererId: string
  catererName?: string
  subject: string
  status: string
  priority: string
  linkedModule: string | null
  linkedEntityId: string | null
  linkedItems?: { module: string; entityId: string; label: string | null; linkedAt: string }[]
  assigneeId?: string | null
  assigneeName?: string | null
  messageCount: number
  lastMessageAt: string | null
  resolvedAt: string | null
  closedAt: string | null
  createdAt: string
}

interface MessageDto {
  _id: string
  conversationId: string
  senderId: string
  senderType: string
  senderName: string
  content: string
  isInternal?: boolean
  createdAt: string
}

interface ParticipantDto {
  userId: string
  userName: string
  userType: string
  role: string
}

function toLinkedItem(dto: NonNullable<ConversationDto['linkedItems']>[number]): LinkedItemViewModel {
  return {
    module: dto.module as LinkedItemViewModel['module'],
    entityId: dto.entityId,
    label: dto.label,
    linkedAt: dto.linkedAt,
  }
}

export function toConversationViewModel(dto: ConversationDto): ConversationViewModel {
  return {
    id: dto._id,
    catererId: dto.catererId,
    catererName: dto.catererName ?? 'Unknown',
    subject: dto.subject,
    status: dto.status as ConversationViewModel['status'],
    priority: dto.priority as ConversationViewModel['priority'],
    linkedModule: dto.linkedModule as ConversationViewModel['linkedModule'],
    linkedEntityId: dto.linkedEntityId,
    linkedItems: (dto.linkedItems ?? []).map(toLinkedItem),
    assigneeId: dto.assigneeId ?? null,
    assigneeName: dto.assigneeName ?? null,
    messageCount: dto.messageCount,
    lastMessageAt: dto.lastMessageAt,
    resolvedAt: dto.resolvedAt,
    closedAt: dto.closedAt,
    createdAt: dto.createdAt,
  }
}

export function toMessageViewModel(dto: MessageDto): MessageViewModel {
  return {
    id: dto._id,
    conversationId: dto.conversationId,
    senderId: dto.senderId,
    senderType: dto.senderType as MessageViewModel['senderType'],
    senderName: dto.senderName,
    content: dto.content,
    isInternal: dto.isInternal ?? false,
    createdAt: dto.createdAt,
  }
}

function toParticipantViewModel(dto: ParticipantDto): ParticipantViewModel {
  return {
    userId: dto.userId,
    userName: dto.userName,
    userType: dto.userType as ParticipantViewModel['userType'],
    role: dto.role as ParticipantViewModel['role'],
  }
}

export function toConversationListResult(dto: {
  data: ConversationDto[]
  total: number
  limit: number
  offset: number
}): ConversationListResult {
  return {
    items: dto.data.map(toConversationViewModel),
    total: dto.total,
    limit: dto.limit,
    offset: dto.offset,
  }
}

export function toConversationDetail(dto: {
  conversation: ConversationDto
  messages: MessageDto[]
  participants: ParticipantDto[]
}): ConversationDetailViewModel {
  return {
    conversation: toConversationViewModel(dto.conversation),
    messages: dto.messages.map(toMessageViewModel),
    participants: dto.participants.map(toParticipantViewModel),
  }
}

function toAuditEntry(dto: { timestamp: string; action: string; actorId?: string | null; actorType?: string }): AuditEntryViewModel {
  return {
    timestamp: dto.timestamp,
    action: dto.action,
    actorId: dto.actorId ?? null,
    actorType: dto.actorType ?? 'admin',
  }
}

export function toConversationHistory(dto: {
  conversation: ConversationDto
  messages: MessageDto[]
  auditHistory: { timestamp: string; action: string; actorId?: string | null; actorType?: string }[]
}): ConversationHistoryViewModel {
  return {
    conversation: toConversationViewModel(dto.conversation),
    messages: dto.messages.map(toMessageViewModel),
    auditHistory: dto.auditHistory.map(toAuditEntry),
  }
}

export function toDashboardViewModel(dto: {
  summary: {
    totalConversations: number
    open: number
    waitingForCaterer: number
    waitingForAdmin: number
    resolved: number
    closed: number
  }
  recentConversations: ConversationDto[]
}): DashboardViewModel {
  return {
    totalConversations: dto.summary.totalConversations,
    open: dto.summary.open,
    waitingForCaterer: dto.summary.waitingForCaterer,
    waitingForAdmin: dto.summary.waitingForAdmin,
    resolved: dto.summary.resolved,
    closed: dto.summary.closed,
    recentConversations: dto.recentConversations.map(toConversationViewModel),
  }
}
