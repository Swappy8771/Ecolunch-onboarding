import { useState } from 'react'
import { X, Save, AlertTriangle } from 'lucide-react'
import type { CatererProfileCompanyViewModel } from '@/features/catererProfile/types/catererProfile.types'
import type { UpdateCompanyBody } from '@/api/modules/caterer-profile.api'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

const ORG_TYPES = ['sole_proprietor', 'partnership', 'corporation', 'cooperative', 'non_profit', 'other'] as const

interface CompanyEditModalProps {
  initial: CatererProfileCompanyViewModel
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onSave: (body: UpdateCompanyBody) => void
}

export function CompanyEditModal({ initial, isSubmitting, error, onCancel, onSave }: CompanyEditModalProps) {
  const [legalName, setLegalName] = useState(initial.legalName ?? '')
  const [tradingName, setTradingName] = useState(initial.tradingName ?? '')
  const [organizationType, setOrganizationType] = useState(initial.organizationType ?? '')
  const [website, setWebsite] = useState(initial.website ?? '')
  const [foundedYear, setFoundedYear] = useState(initial.foundedYear?.toString() ?? '')
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl ?? '')

  const valid = legalName.trim().length > 0

  function handleSave() {
    if (!valid) return
    const body: UpdateCompanyBody = { legalName: legalName.trim() }
    if (tradingName.trim()) body.tradingName = tradingName.trim()
    if (organizationType) body.organizationType = organizationType as UpdateCompanyBody['organizationType']
    if (website.trim()) body.website = website.trim()
    if (foundedYear.trim()) body.foundedYear = Number(foundedYear)
    if (logoUrl.trim()) body.logoUrl = logoUrl.trim()
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
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Edit Company Information</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Legal Name <span style={{ color: '#f87171' }}>*</span></label>
            <input value={legalName} onChange={e => setLegalName(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Trading Name</label>
            <input value={tradingName} onChange={e => setTradingName(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Organization Type</label>
            <select value={organizationType} onChange={e => setOrganizationType(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer" style={inputStyle}>
              <option value="">Select…</option>
              {ORG_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Founded Year</label>
              <input value={foundedYear} onChange={e => setFoundedYear(e.target.value)} type="number" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Website</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://…" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Company Logo URL</label>
            <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://…" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
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
          <button disabled={!valid || isSubmitting} onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Save size={13} strokeWidth={2.2} />{isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
