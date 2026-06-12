import { useState } from 'react'
import { Star, AlertTriangle, Info } from 'lucide-react'
import type { CatererSetup, FoundingPartnerConfig } from '../../types/modules.types'

export function FoundingPartnerScreen({ setup }: { setup: CatererSetup }) {
  const [fp, setFp] = useState<FoundingPartnerConfig>({ ...setup.foundingPartner })

  const grossMonthly = setup.modules
    .filter(m => m.status !== 'inactive')
    .reduce((s, m) => s + (m.monthlyRate ?? 0) * (1 - m.discountPct / 100), 0)

  const fpSaving   = fp.enabled ? grossMonthly * (fp.discountPct / 100) : 0
  const netMonthly = grossMonthly - fpSaving

  return (
    <div className="flex flex-col gap-5">
      {/* Toggle header */}
      <div className="rounded-2xl p-5 flex items-start gap-4"
        style={{
          background: fp.enabled ? 'rgba(167,139,250,0.07)' : 'var(--bg-card)',
          border: `1px solid ${fp.enabled ? 'rgba(167,139,250,0.30)' : 'var(--border-default)'}`,
        }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: fp.enabled ? 'rgba(167,139,250,0.15)' : 'var(--bg-inner)', border: `1px solid ${fp.enabled ? 'rgba(167,139,250,0.35)' : 'var(--border-strong)'}` }}>
          <Star size={18} strokeWidth={1.8} style={{ color: fp.enabled ? '#a78bfa' : 'var(--text-4)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[14px] font-bold" style={{ color: 'var(--text-1)' }}>Founding Partner</p>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                First-cohort caterers who committed early. Eligible for lifetime rate discounts.
              </p>
            </div>
            {/* Big toggle */}
            <button
              onClick={() => setFp(prev => ({ ...prev, enabled: !prev.enabled }))}
              className="relative cursor-pointer rounded-full transition-colors shrink-0"
              style={{
                width: '48px', height: '26px',
                background: fp.enabled ? 'var(--accent)' : 'var(--bg-inner)',
                border: `2px solid ${fp.enabled ? 'var(--accent)' : 'var(--border-strong)'}`,
              }}
            >
              <span className="absolute top-[3px] rounded-full transition-all"
                style={{
                  width: '16px', height: '16px',
                  background: fp.enabled ? '#07070a' : 'var(--text-4)',
                  left: fp.enabled ? '26px' : '3px',
                }} />
            </button>
          </div>
        </div>
      </div>

      {fp.enabled && (
        <>
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount */}
            <div className="rounded-2xl p-5 flex flex-col gap-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Discount Settings</p>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Discount Percentage</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} max={100} value={fp.discountPct}
                    onChange={e => setFp(prev => ({ ...prev, discountPct: Number(e.target.value) }))}
                    className="w-24 px-3 py-2 rounded-xl text-[13.5px] font-bold outline-none text-center"
                    style={{ background: 'var(--bg-inner)', border: '1px solid var(--accent)', color: '#a78bfa' }}
                  />
                  <span className="text-[13px] font-bold" style={{ color: '#a78bfa' }}>%</span>
                  <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>off all modules, applied on net</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Free for Life</label>
                <div className="flex items-center gap-3">
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => setFp(prev => ({ ...prev, freeForLife: v }))}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
                      style={{
                        background: fp.freeForLife === v ? 'rgba(167,139,250,0.12)' : 'var(--bg-inner)',
                        color: fp.freeForLife === v ? '#a78bfa' : 'var(--text-3)',
                        border: `1px solid ${fp.freeForLife === v ? 'rgba(167,139,250,0.35)' : 'var(--border-strong)'}`,
                      }}>
                      <span className="w-2.5 h-2.5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: fp.freeForLife === v ? '#a78bfa' : 'var(--text-4)' }}>
                        {fp.freeForLife === v && <span className="w-1 h-1 rounded-full block" style={{ background: '#a78bfa' }} />}
                      </span>
                      {v ? 'Yes — free for life' : 'No — discount only'}
                    </button>
                  ))}
                </div>
              </div>

              {!fp.freeForLife && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Discount Expiry</label>
                  <input
                    type="date"
                    value={fp.discountExpiry ?? ''}
                    onChange={e => setFp(prev => ({ ...prev, discountExpiry: e.target.value }))}
                    className="px-3 py-2 rounded-xl text-[13px] outline-none"
                    style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
                  />
                  <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>After this date, standard pricing applies automatically.</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="rounded-2xl p-5 flex flex-col gap-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Notes & Context</p>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Internal Notes</label>
                <textarea
                  value={fp.notes}
                  onChange={e => setFp(prev => ({ ...prev, notes: e.target.value }))}
                  rows={6}
                  placeholder="e.g. First-cohort partner, committed in 2025-Q4..."
                  className="flex-1 px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed resize-none outline-none"
                  style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
                />
              </div>
              <div className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.20)' }}>
                <Info size={12} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
                <p className="text-[11px]" style={{ color: '#60a5fa' }}>
                  Notes are internal only — not included in contracts or visible to caterer.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing impact panel */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-4" style={{ color: 'var(--text-4)' }}>Pricing Impact Preview</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Gross Monthly',    value: `$${grossMonthly.toLocaleString()}`,             color: 'var(--text-1)' },
                { label: 'FP Discount',      value: `–$${Math.round(fpSaving).toLocaleString()}`,   color: '#a78bfa' },
                { label: 'Net Monthly',      value: `$${Math.round(netMonthly).toLocaleString()}`,   color: '#4ade80' },
                { label: 'Annual Saving',    value: `$${Math.round(fpSaving * 12).toLocaleString()}`, color: '#fbbf24' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl px-4 py-3 text-center"
                  style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
                  <p className="text-[10px] uppercase tracking-[0.12em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>{label}</p>
                  <p className="text-[18px] font-black" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Visual bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-4)' }}>
                <span>Gross ${grossMonthly}/mo</span>
                <span>Net ${Math.round(netMonthly)}/mo ({Math.round((1 - netMonthly / grossMonthly) * 100)}% saved)</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
                <div className="h-full rounded-full" style={{ width: `${(netMonthly / grossMonthly) * 100}%`, background: '#a78bfa' }} />
              </div>
              <div className="h-1 rounded-full" style={{ width: `${(fpSaving / grossMonthly) * 100}%`, background: 'rgba(167,139,250,0.30)', marginTop: '-4px', marginLeft: `${(netMonthly / grossMonthly) * 100}%` }} />
            </div>
          </div>

          {fp.freeForLife && (
            <div className="flex items-start gap-3 rounded-2xl px-5 py-4"
              style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.22)' }}>
              <AlertTriangle size={15} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: '#f87171' }} />
              <div>
                <p className="text-[12.5px] font-bold mb-0.5" style={{ color: '#f87171' }}>Free for Life — revenue impact</p>
                <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>
                  This caterer will pay $0/month permanently. Ensure this is explicitly approved by leadership before generating the contract.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {!fp.enabled && (
        <div className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center"
          style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-strong)' }}>
          <Star size={28} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
          <p className="text-[14px] font-semibold" style={{ color: 'var(--text-3)' }}>Founding partner program not enabled</p>
          <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>
            Toggle the switch above to enable founding partner pricing for this caterer.
          </p>
        </div>
      )}
    </div>
  )
}
