import { useState } from 'react'
import { X, Link2, AlertTriangle } from 'lucide-react'
import type { LinkedModule } from '@/features/adminEcoloop/types/ecoloop.types'
import { LINKED_MODULE_META } from './TicketStatusBadge'

interface EcoLoopLinkModalProps {
  /** Preselects the module (from the specific "Link Document"/"Link Contract"/etc. action button) — still editable. */
  initialModule: LinkedModule
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: (input: { module: LinkedModule; entityId: string; label?: string }) => void
}

const MODULES: LinkedModule[] = ['validation', 'documents', 'contracts', 'modules-pricing', 'go-live', 'corrections', 'smart-import']

export function EcoLoopLinkModal({ initialModule, isSubmitting, error, onCancel, onConfirm }: EcoLoopLinkModalProps) {
  const [module, setModule] = useState<LinkedModule>(initialModule)
  const [entityId, setEntityId] = useState('')
  const [label, setLabel] = useState('')

  const valid = entityId.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[480px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Link Item to Ticket</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Module</label>
            <select value={module} onChange={e => setModule(e.target.value as LinkedModule)}
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}>
              {MODULES.map(m => <option key={m} value={m}>{LINKED_MODULE_META[m].label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Entity ID <span style={{ color: '#f87171' }}>*</span></label>
            <input value={entityId} onChange={e => setEntityId(e.target.value)}
              placeholder="ID of the document / contract / item to link"
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Label (optional)</label>
            <input value={label} onChange={e => setLabel(e.target.value)}
              placeholder="A short human-readable name"
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
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
          <button disabled={!valid || isSubmitting}
            onClick={() => onConfirm({ module, entityId: entityId.trim(), label: label.trim() || undefined })}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Link2 size={13} strokeWidth={2.2} />{isSubmitting ? 'Linking…' : 'Link Item'}
          </button>
        </div>
      </div>
    </div>
  )
}
