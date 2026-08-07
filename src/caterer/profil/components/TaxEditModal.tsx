import { useState } from 'react'
import { X, Save, AlertTriangle } from 'lucide-react'
import type { CatererProfileTaxViewModel } from '@/features/catererProfile/types/catererProfile.types'
import type { UpdateTaxBody } from '@/api/modules/caterer-profile.api'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

interface TaxEditModalProps {
  initial: CatererProfileTaxViewModel
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onSave: (body: UpdateTaxBody) => void
}

export function TaxEditModal({ initial, isSubmitting, error, onCancel, onSave }: TaxEditModalProps) {
  const [neqNumber, setNeqNumber] = useState(initial.neqNumber ?? '')
  const [sirenNumber, setSirenNumber] = useState(initial.sirenNumber ?? '')
  const [vatNumber, setVatNumber] = useState(initial.vatNumber ?? '')
  const [siretNumber, setSiretNumber] = useState(initial.siretNumber ?? '')
  const [apeNafCode, setApeNafCode] = useState(initial.apeNafCode ?? '')
  const [rcsRegistration, setRcsRegistration] = useState(initial.rcsRegistration ?? '')

  function handleSave() {
    const body: UpdateTaxBody = {}
    if (neqNumber.trim()) body.neqNumber = neqNumber.trim()
    if (sirenNumber.trim()) body.sirenNumber = sirenNumber.trim()
    if (vatNumber.trim()) body.vatNumber = vatNumber.trim()
    if (siretNumber.trim()) body.siretNumber = siretNumber.trim()
    if (apeNafCode.trim()) body.apeNafCode = apeNafCode.trim()
    if (rcsRegistration.trim()) body.rcsRegistration = rcsRegistration.trim()
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
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Edit Tax Information</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <p className="text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>Quebec</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>NEQ Number</label>
            <input value={neqNumber} onChange={e => setNeqNumber(e.target.value)} placeholder="8 digits" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>

          <p className="text-[11px] uppercase tracking-[0.12em] font-bold mt-2" style={{ color: 'var(--text-4)' }}>France</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>SIREN Number</label>
              <input value={sirenNumber} onChange={e => setSirenNumber(e.target.value)} placeholder="9 digits" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>SIRET Number</label>
              <input value={siretNumber} onChange={e => setSiretNumber(e.target.value)} placeholder="14 digits" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>VAT Number</label>
              <input value={vatNumber} onChange={e => setVatNumber(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>APE / NAF Code</label>
              <input value={apeNafCode} onChange={e => setApeNafCode(e.target.value)} placeholder="e.g. 5621Z" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>RCS Registration</label>
            <input value={rcsRegistration} onChange={e => setRcsRegistration(e.target.value)} placeholder="e.g. Paris B 843 201 789" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
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
