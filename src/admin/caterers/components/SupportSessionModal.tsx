import { useState } from 'react'
import { X, ShieldAlert, AlertTriangle } from 'lucide-react'

interface SupportSessionModalProps {
  catererName: string
  onCancel: () => void
  onConfirm: (reason: string) => void
  isSubmitting?: boolean
  error?: string | null
}

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

/**
 * "Open Support Access Session" — per spec, this must read as an audited
 * support action, never as an ordinary "log in as this caterer" switch.
 * The reason is mandatory (`startSupportSession()` logs it to `audit_logs`
 * alongside the actor and timestamp) and this modal is the only place it's
 * collected.
 */
export function SupportSessionModal({ catererName, onCancel, onConfirm, isSubmitting, error }: SupportSessionModalProps) {
  const [reason, setReason] = useState('')
  const valid = reason.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="w-full max-w-[440px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={16} strokeWidth={1.8} style={{ color: '#f87171' }} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{catererName}</p>
              <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Open Support Access Session</h2>
            </div>
          </div>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
            This opens an audited session on this caterer's own portal — the session start, your reason, and the eventual end will be recorded in the audit trail. This is not a normal login switch.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
              Reason for access <span style={{ color: '#f87171' }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Caterer requested help completing their banking setup"
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none"
              style={inputStyle}
            />
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
          <button
            disabled={!valid || isSubmitting}
            onClick={() => onConfirm(reason.trim())}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: '#f87171', color: '#07070a' }}>
            {isSubmitting ? 'Opening…' : 'Open Session'}
          </button>
        </div>
      </div>
    </div>
  )
}
