import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import type { Priority, TicketCategory } from '../types/ecoloop.types'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

export function CreateTicketModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    caterer: '',
    subject: '',
    category: '' as TicketCategory | '',
    priority: 'medium' as Priority,
  })

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  const valid = form.caterer && form.subject && form.category

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
          {/* Caterer */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Caterer <span style={{ color: '#f87171' }}>*</span></label>
            <input value={form.caterer} onChange={e => set('caterer', e.target.value)}
              placeholder="Select or type caterer name"
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none"
              style={inputStyle} />
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Subject <span style={{ color: '#f87171' }}>*</span></label>
            <input value={form.subject} onChange={e => set('subject', e.target.value)}
              placeholder="Describe the issue or follow-up"
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none"
              style={inputStyle} />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Category <span style={{ color: '#f87171' }}>*</span></label>
              <select value={form.category} onChange={e => set('category', e.target.value as TicketCategory | '')}
                className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
                style={inputStyle}>
                <option value="">Select…</option>
                <option value="correction-request">Correction Request</option>
                <option value="client-message">Client Message</option>
                <option value="validation-followup">Validation Follow-up</option>
                <option value="contract-followup">Contract Follow-up</option>
                <option value="golive-blocker">Go-live Blocker</option>
                <option value="internal">Internal</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value as Priority)}
                className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
                style={inputStyle}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            Cancel
          </button>
          <button disabled={!valid}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Plus size={14} strokeWidth={2.5} />Create Ticket
          </button>
        </div>
      </div>
    </div>
  )
}
