import { useState } from 'react'
import { Pencil, Check, X, AlertTriangle, DollarSign } from 'lucide-react'
import { StatCard } from '@/features/dashboard/components/StatCard'
import type { CatererSetup } from '../../types/modules.types'

function EditableCell({
  value, onSave,
}: { value: number | null; onSave: (v: number | null) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value !== null ? String(value) : '')

  function commit() {
    const parsed = parseFloat(draft)
    onSave(isNaN(parsed) ? null : parsed)
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
      <span className={`text-[13px] font-medium ${value === null ? 'italic' : ''}`}
        style={{ color: value !== null ? 'var(--text-1)' : 'var(--text-4)' }}>
        {value !== null ? `$${value.toLocaleString()}` : 'Set price'}
      </span>
      <Pencil size={10} strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
    </div>
  )
}

export function PricingScreen({ setup }: { setup: CatererSetup }) {
  const [modules, setModules] = useState(
    setup.modules.filter(m => m.status !== 'inactive')
  )

  function updateModule(id: string, field: 'monthlyRate' | 'setupFee' | 'discountPct', val: number | null) {
    setModules(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m))
  }

  const monthly  = modules.reduce((s, m) => s + (m.monthlyRate ?? 0), 0)
  const setup_   = modules.reduce((s, m) => s + (m.setupFee ?? 0), 0)
  const discount = modules.reduce((s, m) => s + (m.monthlyRate ?? 0) * (m.discountPct / 100), 0)
  const fpDiscount = setup.foundingPartner.enabled
    ? (monthly - discount) * (setup.foundingPartner.discountPct / 100)
    : 0
  const netMonthly = monthly - discount - fpDiscount

  return (
    <div className="flex flex-col gap-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Monthly Revenue"  value={`$${netMonthly.toLocaleString()}`} valueColor="lime"  trend="after discounts" icon={<DollarSign size={15} strokeWidth={1.8} />} />
        <StatCard label="Total Setup Fees" value={`$${setup_.toLocaleString()}`}      valueColor="blue"  trend="one-time"        icon={<DollarSign size={15} strokeWidth={1.8} />} />
        <StatCard label="Module Discounts" value={`$${discount.toLocaleString()}`}    valueColor="amber" trend="per month"        icon={null} />
        <StatCard label="FP Discount"      value={`$${Math.round(fpDiscount).toLocaleString()}`} valueColor={setup.foundingPartner.enabled ? 'purple' : 'amber'} trend={setup.foundingPartner.enabled ? `${setup.foundingPartner.discountPct}% founding partner` : 'not applicable'} icon={null} />
      </div>

      {/* Founding partner notice */}
      {setup.foundingPartner.enabled && (
        <div className="flex items-start gap-3 rounded-2xl px-5 py-4"
          style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)' }}>
          <AlertTriangle size={15} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
          <div>
            <p className="text-[12.5px] font-bold mb-0.5" style={{ color: '#a78bfa' }}>
              Founding Partner — {setup.foundingPartner.discountPct}% discount applied
            </p>
            <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>
              Applied on top of module discounts until {setup.foundingPartner.discountExpiry ?? 'no expiry'}. Net monthly: ${Math.round(netMonthly).toLocaleString()}/mo
            </p>
          </div>
        </div>
      )}

      {/* Pricing table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="px-5 py-3.5" style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
            Pricing Configuration — click any value to edit inline
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '780px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                {['Module', 'Monthly SaaS', 'Setup Fee', 'Discount %', 'Effective Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3">
                    <span className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m, idx) => {
                const complete = m.monthlyRate !== null
                return (
                  <tr key={m.id}
                    style={{ borderBottom: idx < modules.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{m.name}</span>
                        <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{m.shortName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <EditableCell value={m.monthlyRate} onSave={v => updateModule(m.id, 'monthlyRate', v)} />
                    </td>
                    <td className="px-4 py-3.5">
                      <EditableCell value={m.setupFee} onSave={v => updateModule(m.id, 'setupFee', v)} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 group cursor-pointer">
                        <span className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>{m.discountPct}%</span>
                        <Pencil size={10} strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-3)' }}>
                        {m.effectiveDate ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          background: complete ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.10)',
                          color: complete ? '#4ade80' : '#fbbf24',
                          border: `1px solid ${complete ? 'rgba(74,222,128,0.30)' : 'rgba(251,191,36,0.25)'}`,
                        }}>
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

        {/* Totals */}
        <div className="px-5 py-4" style={{ borderTop: '2px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>Gross Monthly</p>
              <p className="text-[18px] font-black" style={{ color: 'var(--text-1)' }}>${monthly.toLocaleString()}</p>
            </div>
            <span style={{ color: 'var(--text-4)' }}>–</span>
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>Discounts</p>
              <p className="text-[18px] font-black" style={{ color: '#fbbf24' }}>${Math.round(discount + fpDiscount).toLocaleString()}</p>
            </div>
            <span style={{ color: 'var(--text-4)' }}>=</span>
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>Net Monthly</p>
              <p className="text-[18px] font-black" style={{ color: '#a3e635' }}>${Math.round(netMonthly).toLocaleString()}</p>
            </div>
            <div className="ml-auto">
              <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>Total Setup Fees</p>
              <p className="text-[18px] font-black" style={{ color: '#60a5fa' }}>${setup_.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {modules.some(m => m.monthlyRate === null) && (
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.22)' }}>
          <AlertTriangle size={13} strokeWidth={2} style={{ color: '#fbbf24' }} />
          <p className="text-[12.5px]" style={{ color: '#fbbf24' }}>
            <strong>Pricing incomplete</strong> — {modules.filter(m => m.monthlyRate === null).map(m => m.shortName).join(', ')} {modules.filter(m => m.monthlyRate === null).length === 1 ? 'is' : 'are'} missing monthly rate. Contract generation is blocked.
          </p>
        </div>
      )}
    </div>
  )
}
