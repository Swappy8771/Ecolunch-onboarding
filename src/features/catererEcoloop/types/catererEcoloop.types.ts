export interface EcoloopConversationViewModel {
  id: string
  subject: string
  status: 'open' | 'waiting_for_caterer' | 'waiting_for_admin' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  linkedModule: string | null
  messageCount: number
  lastMessageAt: string | null
  createdAt: string
  unreadCount: number
}

export interface EcoloopMessageViewModel {
  id: string
  senderId: string
  senderType: string
  senderName: string
  content: string
  createdAt: string
}

export interface EcoloopConversationDetailViewModel {
  conversation: EcoloopConversationViewModel
  messages: EcoloopMessageViewModel[]
}
