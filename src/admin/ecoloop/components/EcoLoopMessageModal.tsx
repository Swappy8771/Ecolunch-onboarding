import { useState } from 'react'
import { X, Send, Lock, AlertTriangle } from 'lucide-react'

interface EcoLoopMessageModalProps {
  /** 'note' = internal (admin-only); 'message' = client-visible; 'caterer' logs an inbound caterer message. */
  variant: 'note' | 'message' | 'caterer'
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: (content: string) => void
}

const META = {
  note:    { title: 'Add Internal Note',        placeholder: 'Visible to admins only…',            icon: Lock, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.28)' },
  message: { title: 'Send Message',              placeholder: 'Type a message to the caterer…',      icon: Send, color: '#07070a', bg: 'var(--accent)', border: 'transparent' },
  caterer: { title: 'Log Caterer Message',       placeholder: 'What did the caterer say (phone/email)?', icon: Send, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.28)' },
} as const

export function EcoLoopMessageModal({ variant, isSubmitting, error, onCancel, onConfirm }: EcoLoopMessageModalProps) {
  const [content, setContent] = useState('')
  const meta = META[variant]
  const Icon = meta.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[480px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>{meta.title}</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-6 py-5">
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} autoFocus
            placeholder={meta.placeholder}
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />

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
          <button disabled={!content.trim() || isSubmitting} onClick={() => onConfirm(content.trim())}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
            <Icon size={13} strokeWidth={2.2} />{isSubmitting ? 'Sending…' : meta.title}
          </button>
        </div>
      </div>
    </div>
  )
}
