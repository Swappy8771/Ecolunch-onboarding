import { useState } from 'react'
import { X, Save, AlertTriangle } from 'lucide-react'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

interface ClosureFormModalProps {
  title: string
  establishmentOptions: { id: string; name: string }[]
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onSave: (input: { establishmentId: string; label: string; year: string; closureDate: string }) => void
}

export function ClosureFormModal({ title, establishmentOptions, isSubmitting, error, onCancel, onSave }: ClosureFormModalProps) {
  const [establishmentId, setEstablishmentId] = useState('')
  const [label, setLabel] = useState('')
  const [year, setYear] = useState('')
  const [closureDate, setClosureDate] = useState('')

  const valid = establishmentId.length > 0 && label.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[460px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>{title}</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Establishment <span style={{ color: '#f87171' }}>*</span></label>
            <select value={establishmentId} onChange={e => setEstablishmentId(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer" style={inputStyle}>
              <option value="">Select…</option>
              {establishmentOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Calendar Label <span style={{ color: '#f87171' }}>*</span></label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. 2025–26 Closures" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Year</label>
              <input value={year} onChange={e => setYear(e.target.value)} placeholder="2025–26" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Closure Date</label>
              <input value={closureDate} onChange={e => setClosureDate(e.target.value)} type="date" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>

          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            This adds a structured closure-date entry. Uploading a calendar document isn't wired up yet
            on the backend (this endpoint accepts an optional linked Document Vault file, but no upload
            flow exists here yet).
          </p>

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
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer" style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>Cancel</button>
          <button disabled={!valid || isSubmitting} onClick={() => onSave({ establishmentId, label: label.trim(), year, closureDate })}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Save size={13} strokeWidth={2.2} />{isSubmitting ? 'Saving…' : 'Add Calendar'}
          </button>
        </div>
      </div>
    </div>
  )
}
