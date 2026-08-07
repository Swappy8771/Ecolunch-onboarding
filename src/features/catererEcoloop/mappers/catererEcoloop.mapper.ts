import type {
  EcoloopConversationViewModel, EcoloopMessageViewModel, EcoloopConversationDetailViewModel,
} from '../types/catererEcoloop.types'

function toConversationViewModel(dto: EcoloopConversationViewModel): EcoloopConversationViewModel {
  return { ...dto }
}

function toMessageViewModel(dto: EcoloopMessageViewModel): EcoloopMessageViewModel {
  return { ...dto }
}

export function toConversationListViewModel(dto: { data: EcoloopConversationViewModel[]; total: number }): {
  data: EcoloopConversationViewModel[]
  total: number
} {
  return { data: dto.data.map(toConversationViewModel), total: dto.total }
}

export function toConversationDetailViewModel(dto: {
  conversation: EcoloopConversationViewModel
  messages: EcoloopMessageViewModel[]
}): EcoloopConversationDetailViewModel {
  return {
    conversation: toConversationViewModel(dto.conversation),
    messages: dto.messages.map(toMessageViewModel),
  }
}
