import { useState } from 'react'
import { Pencil, Check, X, AlertTriangle, DollarSign, Star } from 'lucide-react'
import { StatCard } from '@/features/adminDashboard/components/StatCard'
import { useSavePricing } from '@/features/adminModulesPricing/hooks/useModuleMutations'
import type { CatererModuleViewModel } from '@/features/adminModulesPricing/types/modulesPricing.types'

function EditableCents({ cents, onSave }: { cents: number | null; onSave: (cents: number | null) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(cents !== null ? String(cents / 100) : '')

  function commit() {
    const parsed = parseFloat(draft)
    onSave(isNaN(parsed) ? null : Math.round(parsed * 100))
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>$</span>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
          className="w-20 px-2 py-1 rounded-lg text-[12.5px] outline-none"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--accent)', color: 'var(--text-1)' }}
          autoFocus
        />
        <button onClick={commit} className="cursor-pointer" style={{ color: '#4ade80' }}><Check size={12} strokeWidth={2.5} /></button>
        <button onClick={() => setEditing(false)} className="cursor-pointer" style={{ color: 'var(--text-4)' }}><X size={12} strokeWidth={2.5} /></button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => setEditing(true)}>
      <span className={`text-[13px] font-medium ${cents === null ? 'italic' : ''}`}
        style={{ color: cents !== null ? 'var(--text-1)' : 'var(--text-4)' }}>
        {cents !== null ? `$${(cents / 100).toLocaleString()}` : 'Set price'}
      </span>
      <Pencil size={10} strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
    </div>
  )
}

function DiscountCell({ pct, onSave }: { pct: number; onSave: (pct: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(pct))

  function commit() {
    const parsed = Math.max(0, Math.min(100, Number(draft) || 0))
    onSave(parsed)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input type="number" min={0} max={100} value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
          className="w-14 px-2 py-1 rounded-lg text-[12.5px] outline-none" style={{ background: 'var(--bg-inner)', border: '1px solid var(--accent)', color: 'var(--text-1)' }} autoFocus />
        <button onClick={commit} className="cursor-pointer" style={{ color: '#4ade80' }}><Check size={12} strokeWidth={2.5} /></button>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => setEditing(true)}>
      <span className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>{pct}%</span>
      <Pencil size={10} strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
    </div>
  )
}

export function PricingScreen({ catererId, modules }: { catererId: string; modules: CatererModuleViewModel[] }) {
  const active = modules.filter(m => m.status !== 'inactive')
  const saveMutation = useSavePricing()

  function save(moduleKey: string, patch: Partial<{ monthlyPriceCents: number | null; setupFeeCents: number | null; discountPct: number; foundingPartnerFree: boolean }>) {
    const mod = active.find(m => m.key === moduleKey)!
    saveMutation.mutate({
      catererId,
      moduleKey,
      monthlyPriceCents: mod.pricing.monthlyPriceCents,
      setupFeeCents: mod.pricing.setupFeeCents,
      discountPct: mod.pricing.discountPct,
      foundingPartnerFree: mod.pricing.foundingPartnerFree,
      ...patch,
    })
  }

  const netMonthlyCents = active.reduce((s, m) => {
    if (m.pricing.foundingPartnerFree) return s
    const base = m.pricing.monthlyPriceCents ?? 0
    return s + Math.round((base * (100 - m.pricing.discountPct)) / 100)
  }, 0)
  const setupTotalCents = active.reduce((s, m) => s + (m.pricing.setupFeeCents ?? 0), 0)
  const grossMonthlyCents = active.reduce((s, m) => s + (m.pricing.monthlyPriceCents ?? 0), 0)
  const discountCents = grossMonthlyCents - netMonthlyCents
  const foundingPartnerCount = active.filter(m => m.pricing.foundingPartnerFree).length

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Net Monthly Revenue" value={`$${(netMonthlyCents / 100).toLocaleString()}`} valueColor="lime" trend="after discounts" icon={<DollarSign size={15} strokeWidth={1.8} />} />
        <StatCard label="Total Setup Fees"    value={`$${(setupTotalCents / 100).toLocaleString()}`} valueColor="blue" trend="one-time" icon={<DollarSign size={15} strokeWidth={1.8} />} />
        <StatCard label="Discounts Applied"   value={`$${(discountCents / 100).toLocaleString()}`}    valueColor="amber" trend="per month" icon={null} />
        <StatCard label="Founding Partner Modules" value={foundingPartnerCount} valueColor={foundingPartnerCount > 0 ? 'purple' : 'amber'} trend="free-for-life" icon={<Star size={15} strokeWidth={1.8} />} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="px-5 py-3.5" style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
            Pricing Configuration — click any value to edit inline
          </p>
        </div>
        {active.length === 0 ? (
          <p className="text-[13px] text-center py-10" style={{ color: 'var(--text-4)' }}>No active modules yet — activate a module first.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '820px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                  {['Module', 'Monthly SaaS', 'Setup Fee', 'Discount %', 'Founding Partner', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3">
                      <span className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {active.map((m, idx) => {
                  const complete = m.pricing.monthlyPriceCents !== null
                  return (
                    <tr key={m.key} style={{ borderBottom: idx < active.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <td className="px-4 py-3.5"><span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{m.name}</span></td>
                      <td className="px-4 py-3.5"><EditableCents cents={m.pricing.monthlyPriceCents} onSave={v => save(m.key, { monthlyPriceCents: v })} /></td>
                      <td className="px-4 py-3.5"><EditableCents cents={m.pricing.setupFeeCents} onSave={v => save(m.key, { setupFeeCents: v })} /></td>
                      <td className="px-4 py-3.5"><DiscountCell pct={m.pricing.discountPct} onSave={v => save(m.key, { discountPct: v })} /></td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => save(m.key, { foundingPartnerFree: !m.pricing.foundingPartnerFree })}
                          className="relative shrink-0 rounded-full cursor-pointer transition-colors"
                          style={{ background: m.pricing.foundingPartnerFree ? '#a78bfa' : 'var(--bg-inner)', border: `1px solid ${m.pricing.foundingPartnerFree ? '#a78bfa' : 'var(--border-strong)'}`, width: '36px', height: '20px' }}>
                          <span className="absolute top-[2px] rounded-full transition-all"
                            style={{ width: '14px', height: '14px', background: m.pricing.foundingPartnerFree ? '#07070a' : 'var(--text-4)', left: m.pricing.foundingPartnerFree ? '18px' : '2px' }} />
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                          style={{ background: complete ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.10)', color: complete ? '#4ade80' : '#fbbf24', border: `1px solid ${complete ? 'rgba(74,222,128,0.30)' : 'rgba(251,191,36,0.25)'}` }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: complete ? '#4ade80' : '#fbbf24' }} />
                          {complete ? 'Complete' : 'Incomplete'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {active.some(m => m.pricing.monthlyPriceCents === null) && (
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.22)' }}>
          <AlertTriangle size={13} strokeWidth={2} style={{ color: '#fbbf24' }} />
          <p className="text-[12.5px]" style={{ color: '#fbbf24' }}>
            <strong>Pricing incomplete</strong> — contract generation is blocked until every active module has a monthly rate.
          </p>
        </div>
      )}
    </div>
  )
}
