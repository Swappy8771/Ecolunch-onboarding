import { useState } from 'react'
import { X, MessageSquare, XCircle } from 'lucide-react'

interface ReviewNoteModalProps {
  fileName: string
  decision: 'reject' | 'request_correction'
  onCancel: () => void
  onConfirm: (note: string) => void
  isSubmitting?: boolean
}

const COPY = {
  reject: { title: 'Reject Document', color: '#f87171', icon: XCircle, cta: 'Reject Document' },
  request_correction: { title: 'Request Correction', color: '#fbbf24', icon: MessageSquare, cta: 'Request Correction' },
} as const

/**
 * Collects a required note before Reject/Request Correction is sent — the
 * backend's `reviewNote` was previously always `undefined` for these two
 * decisions because no UI ever prompted for one, leaving the caterer with
 * no explanation of what needs fixing.
 */
export function ReviewNoteModal({ fileName, decision, onCancel, onConfirm, isSubmitting }: ReviewNoteModalProps) {
  const [note, setNote] = useState('')
  const copy = COPY[decision]
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
              <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{fileName}</p>
              <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>{copy.title}</h2>
            </div>
          </div>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-6 py-5">
          <label className="text-[12px] font-semibold block mb-1.5" style={{ color: 'var(--text-3)' }}>
            Note for the caterer <span style={{ color: '#f87171' }}>*</span>
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={4}
            placeholder="Explain what's wrong or what needs to be resubmitted…"
            className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
          />
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            Cancel
          </button>
          <button
            disabled={!note.trim() || isSubmitting}
            onClick={() => onConfirm(note.trim())}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: copy.color, color: '#07070a' }}>
            {copy.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
