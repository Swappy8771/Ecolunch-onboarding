import { useState } from 'react'
import { X, Plus, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import { displayName } from '@/features/adminAuth/mappers/auth.mapper'
import { useCaterers } from '@/features/adminCaterers/hooks/useCaterers'
import { useCreateTicket } from '@/features/adminEcoloop/hooks/useEcoLoopActions'
import type { ConversationPriority } from '@/features/adminEcoloop/types/ecoloop.types'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

export function CreateTicketModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const caterersQuery = useCaterers({ limit: 100 })
  const createMutation = useCreateTicket()

  const [catererId, setCatererId] = useState('')
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState<ConversationPriority>('normal')
  const [message, setMessage] = useState('')

  const valid = catererId && subject.trim().length >= 3 && message.trim().length > 0

  function handleSubmit() {
    if (!valid || !user) return
    createMutation.mutate(
      {
        catererId,
        subject: subject.trim(),
        priority,
        initialMessage: { senderId: user.id, senderName: displayName(user), content: message.trim() },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[520px] rounded-2xl flex flex-col gap-0 overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>EcoLoop Onboarding</p>
            <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Create Ticket</h2>
          </div>
          <button onClick={onClose} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Caterer <span style={{ color: '#f87171' }}>*</span></label>
            <select value={catererId} onChange={e => setCatererId(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer" style={inputStyle}>
              <option value="">Select a caterer…</option>
              {caterersQuery.data?.items.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Subject <span style={{ color: '#f87171' }}>*</span></label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="Describe the issue or follow-up"
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none"
              style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value as ConversationPriority)}
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
              style={inputStyle}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Initial Message <span style={{ color: '#f87171' }}>*</span></label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
              placeholder="What does the caterer need to know or do?"
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none"
              style={inputStyle} />
          </div>

          {createMutation.isError && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
              <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
              <span className="text-[12.5px]" style={{ color: '#f87171' }}>{createMutation.error.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            Cancel
          </button>
          <button disabled={!valid || createMutation.isPending} onClick={handleSubmit}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Plus size={14} strokeWidth={2.5} />
            {createMutation.isPending ? 'Creating…' : 'Create Ticket'}
          </button>
        </div>
      </div>
    </div>
  )
}
