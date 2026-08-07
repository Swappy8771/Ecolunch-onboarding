import { useState } from 'react'
import { X, Save, AlertTriangle } from 'lucide-react'
import type { CatererProfileContactViewModel } from '@/features/catererProfile/types/catererProfile.types'
import type { UpdateContactBody } from '@/api/modules/caterer-profile.api'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

interface ContactEditModalProps {
  initial: CatererProfileContactViewModel
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onSave: (body: UpdateContactBody) => void
}

export function ContactEditModal({ initial, isSubmitting, error, onCancel, onSave }: ContactEditModalProps) {
  const [name, setName] = useState(initial.primaryContact?.name ?? '')
  const [title, setTitle] = useState(initial.primaryContact?.title ?? '')
  const [email, setEmail] = useState(initial.primaryContact?.email ?? '')
  const [phone, setPhone] = useState(initial.primaryContact?.phone ?? '')
  const [secondaryName, setSecondaryName] = useState(initial.secondaryContact?.name ?? '')
  const [secondaryEmail, setSecondaryEmail] = useState(initial.secondaryContact?.email ?? '')

  function handleSave() {
    const body: UpdateContactBody = {}
    const primaryContact: NonNullable<UpdateContactBody['primaryContact']> = {}
    if (name.trim()) primaryContact.name = name.trim()
    if (title.trim()) primaryContact.title = title.trim()
    if (email.trim()) primaryContact.email = email.trim()
    if (phone.trim()) primaryContact.phone = phone.trim()
    if (Object.keys(primaryContact).length > 0) body.primaryContact = primaryContact

    const secondaryContact: NonNullable<UpdateContactBody['secondaryContact']> = {}
    if (secondaryName.trim()) secondaryContact.name = secondaryName.trim()
    if (secondaryEmail.trim()) secondaryContact.email = secondaryEmail.trim()
    if (Object.keys(secondaryContact).length > 0) body.secondaryContact = secondaryContact

    onSave(body)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[520px] rounded-2xl flex flex-col overflow-hidden max-h-[90vh]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Edit Contact Information</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <p className="text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>Primary Contact</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Job Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="514-555-0123" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>

          <p className="text-[11px] uppercase tracking-[0.12em] font-bold mt-2" style={{ color: 'var(--text-4)' }}>Secondary Contact (optional)</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Name</label>
              <input value={secondaryName} onChange={e => setSecondaryName(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Email</label>
              <input value={secondaryEmail} onChange={e => setSecondaryEmail(e.target.value)} type="email" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
              <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
              <span className="text-[12.5px]" style={{ color: '#f87171' }}>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer" style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>Cancel</button>
          <button disabled={isSubmitting} onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Save size={13} strokeWidth={2.2} />{isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
