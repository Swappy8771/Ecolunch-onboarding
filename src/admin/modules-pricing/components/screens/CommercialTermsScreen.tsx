import { useState } from 'react'
import { FileText, RotateCcw, CalendarDays, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { CatererSetup, CommercialTerms } from '../../types/modules.types'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>{label}</label>
      {children}
      {hint && <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{hint}</p>}
    </div>
  )
}

const inputClass = "px-3 py-2 rounded-xl text-[13px] outline-none"
const inputStyle = { background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }

export function CommercialTermsScreen({ setup }: { setup: CatererSetup }) {
  const [terms, setTerms] = useState<CommercialTerms>({ ...setup.terms })

  function set<K extends keyof CommercialTerms>(k: K, v: CommercialTerms[K]) {
    setTerms(prev => ({ ...prev, [k]: v }))
  }

  const endDate = terms.startDate && terms.termMonths
    ? (() => {
        const d = new Date(terms.startDate)
        d.setMonth(d.getMonth() + terms.termMonths)
        return d.toISOString().slice(0, 10)
      })()
    : null

  const missingFields = [
    !terms.startDate && 'Contract start date',
    !terms.termMonths && 'Contract term',
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-5">
      {missingFields.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-3.5"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.22)' }}>
          <AlertTriangle size={14} strokeWidth={2} style={{ color: '#fbbf24' }} />
          <p className="text-[12.5px]" style={{ color: '#fbbf24' }}>
            <strong>Required:</strong> {missingFields.join(', ')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contract Dates */}
        <div className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays size={14} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Contract Dates</p>
          </div>

          <Field label="Contract Start Date" hint="The date the contract takes legal effect.">
            <input type="date" value={terms.startDate ?? ''} onChange={e => set('startDate', e.target.value)}
              className={inputClass} style={inputStyle} />
          </Field>

          <Field label="Contract Term (months)" hint="Standard: 12, 24, or 36 months.">
            <div className="flex gap-2 flex-wrap">
              {[12, 24, 36, 48].map(n => (
                <button key={n} onClick={() => set('termMonths', n)}
                  className="px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
                  style={{
                    background: terms.termMonths === n ? 'var(--accent-dim)' : 'var(--bg-inner)',
                    color: terms.termMonths === n ? 'var(--accent)' : 'var(--text-3)',
                    border: `1px solid ${terms.termMonths === n ? 'var(--accent-border)' : 'var(--border-strong)'}`,
                  }}>
                  {n} mo
                </button>
              ))}
              <input type="number" min={1} value={terms.termMonths ?? ''} onChange={e => set('termMonths', Number(e.target.value))}
                placeholder="Custom" className={`${inputClass} w-24 text-center`} style={inputStyle} />
            </div>
          </Field>

          {endDate && (
            <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
              style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.22)' }}>
              <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />
              <div>
                <p className="text-[12px] font-semibold" style={{ color: '#4ade80' }}>
                  Contract end: {endDate}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
                  {terms.termMonths} months from {terms.startDate}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Renewal & Payment */}
        <div className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <div className="flex items-center gap-2 mb-1">
            <RotateCcw size={14} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Renewal & Payment</p>
          </div>

          <Field label="Auto-Renewal" hint="Contract renews automatically at end of term unless cancelled.">
            <div className="flex gap-2">
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => set('autoRenewal', v)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
                  style={{
                    background: terms.autoRenewal === v ? (v ? 'rgba(74,222,128,0.10)' : 'rgba(248,113,113,0.09)') : 'var(--bg-inner)',
                    color: terms.autoRenewal === v ? (v ? '#4ade80' : '#f87171') : 'var(--text-3)',
                    border: `1px solid ${terms.autoRenewal === v ? (v ? 'rgba(74,222,128,0.30)' : 'rgba(248,113,113,0.28)') : 'var(--border-strong)'}`,
                  }}>
                  {v ? 'Yes — auto-renew' : 'No — manual renewal'}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Payment Terms (days)" hint="Net-30 is standard. Enter 0 for immediate.">
            <div className="flex gap-2 flex-wrap">
              {[15, 30, 45, 60].map(n => (
                <button key={n} onClick={() => set('paymentDays', n)}
                  className="px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
                  style={{
                    background: terms.paymentDays === n ? 'var(--accent-dim)' : 'var(--bg-inner)',
                    color: terms.paymentDays === n ? 'var(--accent)' : 'var(--text-3)',
                    border: `1px solid ${terms.paymentDays === n ? 'var(--accent-border)' : 'var(--border-strong)'}`,
                  }}>
                  Net {n}
                </button>
              ))}
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
              Selected: <strong style={{ color: 'var(--text-3)' }}>Net {terms.paymentDays}</strong> — invoices due within {terms.paymentDays} days of issuance.
            </p>
          </Field>
        </div>

        {/* Notes */}
        <div className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={14} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Terms Notes</p>
          </div>

          <Field label="General Notes" hint="Internal context — not included in contract text.">
            <textarea value={terms.notes} onChange={e => set('notes', e.target.value)}
              rows={4} placeholder="e.g. Priority onboarding included for first 90 days..."
              className="px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed resize-none outline-none"
              style={{ ...inputStyle }} />
          </Field>
        </div>

        {/* Custom / Special */}
        <div className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Custom Conditions</p>
          </div>

          <Field label="Custom Contract Conditions" hint="Appended to the contract's Special Conditions clause.">
            <textarea value={terms.customConditions ?? ''} onChange={e => set('customConditions', e.target.value)}
              rows={3} placeholder="e.g. White-glove training for kitchen staff included..."
              className="px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed resize-none outline-none"
              style={{ ...inputStyle }} />
          </Field>

          <Field label="Special Pricing Note" hint="Documents why pricing differs from standard.">
            <textarea value={terms.specialPricing ?? ''} onChange={e => set('specialPricing', e.target.value)}
              rows={3} placeholder="e.g. Founding partner discount applied at invoice level..."
              className="px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed resize-none outline-none"
              style={{ ...inputStyle }} />
          </Field>
        </div>
      </div>

      {/* Summary strip */}
      <div className="rounded-2xl px-5 py-4"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-6 flex-wrap text-[12.5px]">
          <span style={{ color: 'var(--text-4)' }}>
            Term: <strong style={{ color: 'var(--text-2)' }}>{terms.termMonths || '—'} months</strong>
          </span>
          <span style={{ color: 'var(--text-4)' }}>
            Start: <strong style={{ color: 'var(--text-2)' }}>{terms.startDate || '—'}</strong>
          </span>
          <span style={{ color: 'var(--text-4)' }}>
            End: <strong style={{ color: 'var(--text-2)' }}>{endDate || '—'}</strong>
          </span>
          <span style={{ color: 'var(--text-4)' }}>
            Payment: <strong style={{ color: 'var(--text-2)' }}>Net {terms.paymentDays}</strong>
          </span>
          <span style={{ color: 'var(--text-4)' }}>
            Auto-renew: <strong style={{ color: terms.autoRenewal ? '#4ade80' : '#f87171' }}>{terms.autoRenewal ? 'Yes' : 'No'}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
