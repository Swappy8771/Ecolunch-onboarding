import { useState } from 'react'
import { X, XCircle, MessageSquare, MessageCircle, Send } from 'lucide-react'

export type ValidationActionVariant = 'reject' | 'request_correction' | 'add_note' | 'send_ecoloop'

interface ValidationActionModalProps {
  itemTitle: string | null
  variant: ValidationActionVariant
  onCancel: () => void
  onConfirm: (input: { text: string; priority?: 'high' | 'medium' | 'low' }) => void
  isSubmitting?: boolean
}

const VARIANT_COPY: Record<ValidationActionVariant, {
  title: string; color: string; icon: typeof XCircle; label: string; placeholder: string; cta: string; showPriority: boolean
}> = {
  reject: {
    title: 'Reject Item', color: '#f87171', icon: XCircle, label: 'Reason', showPriority: false,
    placeholder: 'Explain why this is being rejected…', cta: 'Reject',
  },
  request_correction: {
    title: 'Request Correction', color: '#fbbf24', icon: MessageSquare, label: 'Description', showPriority: true,
    placeholder: "Describe what the caterer needs to fix…", cta: 'Request Correction',
  },
  add_note: {
    title: 'Add Internal Note', color: 'var(--text-2)', icon: MessageCircle, label: 'Note', showPriority: false,
    placeholder: 'Visible only to admins…', cta: 'Add Note',
  },
  send_ecoloop: {
    title: 'Send via EcoLoop', color: '#60a5fa', icon: Send, label: 'Message', showPriority: false,
    placeholder: 'Message to send…', cta: 'Send',
  },
}

/**
 * Backs Reject / Request Correction / Add Internal Note / Send via
 * EcoLoop — all 4 are a single required text field (+ an optional
 * priority selector for Request Correction) posted to a different
 * endpoint, so one parameterized modal serves all 4 rather than 4
 * near-identical components.
 */
export function ValidationActionModal({ itemTitle, variant, onCancel, onConfirm, isSubmitting }: ValidationActionModalProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const copy = VARIANT_COPY[variant]
  const Icon = copy.icon

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="w-full max-w-[480px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div className="flex items-center gap-2.5">
            <Icon size={16} strokeWidth={2} style={{ color: copy.color }} />
            <div>
              {itemTitle && <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{itemTitle}</p>}
              <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>{copy.title}</h2>
            </div>
          </div>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
              {copy.label} <span style={{ color: '#f87171' }}>*</span>
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              placeholder={copy.placeholder}
              className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
            />
          </div>

          {copy.showPriority && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
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
          <button
            disabled={!text.trim() || isSubmitting}
            onClick={() => onConfirm({ text: text.trim(), priority: copy.showPriority ? priority : undefined })}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: copy.color, color: '#07070a' }}>
            {copy.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
