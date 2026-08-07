import { useState } from 'react'
import { X, ShieldAlert, Mail, Send } from 'lucide-react'

export type GoLiveActionVariant = 'block' | 'remind' | 'send_ecoloop'

interface GoLiveActionModalProps {
  catererName: string
  variant: GoLiveActionVariant
  onCancel: () => void
  onConfirm: (message: string) => void
  isSubmitting?: boolean
}

const VARIANT_COPY: Record<GoLiveActionVariant, { title: string; color: string; icon: typeof ShieldAlert; label: string; placeholder: string; cta: string; required: boolean }> = {
  block: {
    title: 'Block Go-live', color: '#f87171', icon: ShieldAlert, label: 'Blocking reason', required: true,
    placeholder: 'Explain why go-live is being blocked…', cta: 'Block Go-live',
  },
  remind: {
    title: 'Send Client Reminder', color: '#60a5fa', icon: Mail, label: 'Message (optional)', required: false,
    placeholder: "Leave blank to auto-generate from this caterer's current blockers…", cta: 'Send Reminder',
  },
  send_ecoloop: {
    title: 'Send via EcoLoop', color: '#4ade80', icon: Send, label: 'Message', required: true,
    placeholder: 'Message to send…', cta: 'Send',
  },
}

/** Backs Block Go-live / Send Client Reminder / Send via EcoLoop — a single required-or-optional text field posted to a different endpoint per variant. */
export function GoLiveActionModal({ catererName, variant, onCancel, onConfirm, isSubmitting }: GoLiveActionModalProps) {
  const [text, setText] = useState('')
  const copy = VARIANT_COPY[variant]
  const Icon = copy.icon
  const canSubmit = !copy.required || text.trim().length > 0

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
              <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{catererName}</p>
              <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>{copy.title}</h2>
            </div>
          </div>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-2 px-6 py-5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
            {copy.label} {copy.required && <span style={{ color: '#f87171' }}>*</span>}
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

        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            Cancel
          </button>
          <button
            disabled={!canSubmit || isSubmitting}
            onClick={() => onConfirm(text.trim())}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: copy.color, color: '#07070a' }}>
            {copy.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
