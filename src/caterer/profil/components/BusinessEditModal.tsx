import { useState } from 'react'
import { X, Save, AlertTriangle } from 'lucide-react'
import type { CatererProfileBusinessViewModel } from '@/features/catererProfile/types/catererProfile.types'
import type { UpdateBusinessBody } from '@/api/modules/caterer-profile.api'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

const VERTICALS = ['schools', 'daycares', 'css', 'camps'] as const
const VERTICAL_LABELS: Record<(typeof VERTICALS)[number], string> = {
  schools: 'Schools',
  daycares: 'Daycares',
  css: 'CSS',
  camps: 'Camps',
}

interface BusinessEditModalProps {
  initial: CatererProfileBusinessViewModel
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onSave: (body: UpdateBusinessBody) => void
}

export function BusinessEditModal({ initial, isSubmitting, error, onCancel, onSave }: BusinessEditModalProps) {
  const [verticals, setVerticals] = useState<string[]>(initial.verticals)
  const [industrySector, setIndustrySector] = useState(initial.industrySector ?? '')
  const [employeeCount, setEmployeeCount] = useState(initial.employeeCount?.toString() ?? '')
  const [annualCapacityMeals, setAnnualCapacityMeals] = useState(initial.annualCapacityMeals?.toString() ?? '')
  const [kitchenLocations, setKitchenLocations] = useState(initial.kitchenLocations?.toString() ?? '')
  const [deliveryZones, setDeliveryZones] = useState(initial.deliveryZones.join(', '))

  function toggleVertical(v: string) {
    setVerticals(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]))
  }

  function handleSave() {
    const body: UpdateBusinessBody = { verticals: verticals as UpdateBusinessBody['verticals'] }
    const businessDetails: NonNullable<UpdateBusinessBody['businessDetails']> = {}
    if (industrySector.trim()) businessDetails.industrySector = industrySector.trim()
    if (employeeCount.trim()) businessDetails.employeeCount = Number(employeeCount)
    if (annualCapacityMeals.trim()) businessDetails.annualCapacityMeals = Number(annualCapacityMeals)
    if (kitchenLocations.trim()) businessDetails.kitchenLocations = Number(kitchenLocations)
    if (deliveryZones.trim()) businessDetails.deliveryZones = deliveryZones.split(',').map(s => s.trim()).filter(Boolean)
    if (Object.keys(businessDetails).length > 0) body.businessDetails = businessDetails
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
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Edit Business Details</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Active Service Types</label>
            <div className="flex flex-wrap gap-2">
              {VERTICALS.map(v => {
                const active = verticals.includes(v)
                return (
                  <button key={v} type="button" onClick={() => toggleVertical(v)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer"
                    style={{
                      background: active ? 'var(--accent-dim)' : 'var(--bg-inner)',
                      color: active ? 'var(--accent)' : 'var(--text-3)',
                      border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border-strong)'}`,
                    }}>
                    {VERTICAL_LABELS[v]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Industry Sector</label>
            <input value={industrySector} onChange={e => setIndustrySector(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Number of Employees</label>
              <input value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} type="number" min={0} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Annual Capacity (meals)</label>
              <input value={annualCapacityMeals} onChange={e => setAnnualCapacityMeals(e.target.value)} type="number" min={0} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Kitchen Locations</label>
            <input value={kitchenLocations} onChange={e => setKitchenLocations(e.target.value)} type="number" min={0} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Delivery Zones</label>
            <input value={deliveryZones} onChange={e => setDeliveryZones(e.target.value)} placeholder="Comma-separated, e.g. Île-de-France, Normandy" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
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
