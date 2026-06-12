import { useState } from 'react'
import { Send, User, Cpu } from 'lucide-react'
import type { Message, MessageType } from '../../types/ecoloop.types'

const TYPE_META: Record<MessageType, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; align: 'left' | 'right' }> = {
  admin:  { label: 'Admin',  color: '#a78bfa', bg: 'rgba(167,139,250,0.09)', border: 'rgba(167,139,250,0.22)', icon: <User size={12} strokeWidth={2} />, align: 'right' },
  client: { label: 'Client', color: '#60a5fa', bg: 'rgba(96,165,250,0.09)',  border: 'rgba(96,165,250,0.22)',  icon: <User size={12} strokeWidth={2} />, align: 'left'  },
  system: { label: 'System', color: 'var(--text-4)', bg: 'var(--bg-inner)', border: 'var(--border-strong)', icon: <Cpu  size={12} strokeWidth={2} />, align: 'left'  },
}

function Bubble({ msg }: { msg: Message }) {
  const m = TYPE_META[msg.type]
  const isRight = m.align === 'right'
  const isSystem = msg.type === 'system'

  if (isSystem) {
    return (
      <div className="flex items-center gap-2 py-1.5">
        <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
          <Cpu size={10} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
          <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{msg.content}</span>
          <span className="text-[10px]" style={{ color: 'var(--text-4)' }}>· {msg.ts.split(' ')[1]}</span>
        </div>
        <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
      </div>
    )
  }

  return (
    <div className={`flex items-end gap-2.5 ${isRight ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
        style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
        {msg.type === 'admin' ? 'A' : msg.sender.charAt(0).toUpperCase()}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isRight ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold" style={{ color: m.color }}>{msg.sender}</span>
          <span className="text-[10.5px]" style={{ color: 'var(--text-4)' }}>{msg.ts}</span>
        </div>
        <div className="px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-relaxed"
          style={{
            background: m.bg,
            border: `1px solid ${m.border}`,
            color: 'var(--text-2)',
            borderBottomRightRadius: isRight ? '4px' : undefined,
            borderBottomLeftRadius: !isRight ? '4px' : undefined,
          }}>
          {msg.content}
        </div>
      </div>
    </div>
  )
}

export function ConversationSection({ messages }: { messages: Message[] }) {
  const [draft, setDraft] = useState('')

  return (
    <div className="flex flex-col gap-3">
      {/* Section label */}
      <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
        Conversation
      </p>

      {/* Timeline */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {messages.length === 0 ? (
          <p className="text-[12.5px] text-center py-10" style={{ color: 'var(--text-4)' }}>No messages available.</p>
        ) : (
          <div className="flex flex-col gap-3 px-5 py-4">
            {messages.map(m => <Bubble key={m.id} msg={m} />)}
          </div>
        )}

        {/* Composer */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Type a message to the client…"
              rows={2}
              className="flex-1 px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed resize-none outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
            />
            <button
              disabled={!draft.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer shrink-0 disabled:opacity-40"
              style={{ background: 'var(--accent)', color: '#07070a' }}
            >
              <Send size={13} strokeWidth={2.5} />Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
