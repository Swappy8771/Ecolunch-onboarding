import { useState } from 'react'
import { X, Save, AlertTriangle } from 'lucide-react'
import type { CatererProfileAddressViewModel } from '@/features/catererProfile/types/catererProfile.types'
import type { UpdateAddressBody } from '@/api/modules/caterer-profile.api'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

interface AddressEditModalProps {
  initial: CatererProfileAddressViewModel
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onSave: (body: UpdateAddressBody) => void
}

export function AddressEditModal({ initial, isSubmitting, error, onCancel, onSave }: AddressEditModalProps) {
  const [line1, setLine1] = useState(initial.line1 ?? '')
  const [city, setCity] = useState(initial.city ?? '')
  const [postalCode, setPostalCode] = useState(initial.postalCode ?? '')
  const [country, setCountry] = useState(initial.country ?? '')
  const [region, setRegion] = useState(initial.region ?? '')
  const [operatingAddress, setOperatingAddress] = useState(initial.operatingAddress ?? '')

  function handleSave() {
    const body: UpdateAddressBody = {}
    if (line1.trim()) body.line1 = line1.trim()
    if (city.trim()) body.city = city.trim()
    if (postalCode.trim()) body.postalCode = postalCode.trim()
    if (country.trim()) body.country = country.trim()
    if (region.trim()) body.region = region.trim()
    if (operatingAddress.trim()) body.operatingAddress = operatingAddress.trim()
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
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Edit Address Information</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Registered Address</label>
            <input value={line1} onChange={e => setLine1(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>City</label>
              <input value={city} onChange={e => setCity(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Postal Code</label>
              <input value={postalCode} onChange={e => setPostalCode(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Country</label>
              <input value={country} onChange={e => setCountry(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Region / Department</label>
              <input value={region} onChange={e => setRegion(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Operating Address</label>
            <input value={operatingAddress} onChange={e => setOperatingAddress(e.target.value)} placeholder="Same as registered, or a distinct address" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
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
