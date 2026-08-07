import { useState } from 'react'
import { X, ArrowUpDown, AlertTriangle } from 'lucide-react'
import type { ConversationPriority } from '@/features/adminEcoloop/types/ecoloop.types'
import { PRIORITY_META } from './TicketStatusBadge'

interface EcoLoopPriorityModalProps {
  currentPriority: ConversationPriority
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: (priority: ConversationPriority) => void
}

const PRIORITIES: ConversationPriority[] = ['low', 'normal', 'high', 'urgent']

export function EcoLoopPriorityModal({ currentPriority, isSubmitting, error, onCancel, onConfirm }: EcoLoopPriorityModalProps) {
  const [priority, setPriority] = useState<ConversationPriority>(currentPriority)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[420px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Change Priority</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-6 py-5">
          <div className="grid grid-cols-2 gap-2">
            {PRIORITIES.map(p => {
              const m = PRIORITY_META[p]
              const active = p === priority
              return (
                <button key={p} onClick={() => setPriority(p)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[12.5px] font-bold cursor-pointer transition-all"
                  style={{
                    background: active ? m.bg : 'var(--bg-inner)',
                    color: active ? m.color : 'var(--text-3)',
                    border: `1px solid ${active ? m.border : 'var(--border-strong)'}`,
                  }}>
                  {m.label}
                </button>
              )
            })}
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
              <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
              <span className="text-[12.5px]" style={{ color: '#f87171' }}>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            Cancel
          </button>
          <button disabled={isSubmitting || priority === currentPriority} onClick={() => onConfirm(priority)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <ArrowUpDown size={13} strokeWidth={2.2} />{isSubmitting ? 'Updating…' : 'Update Priority'}
          </button>
        </div>
      </div>
    </div>
  )
}
