import { useState } from 'react'
import { FileText, RotateCcw, CalendarDays, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { ModuleSelector } from '../ModuleSelector'
import { useModulePricingDetail } from '@/features/adminModulesPricing/hooks/useModulePricingDetail'
import { useSaveCommercialTerms } from '@/features/adminModulesPricing/hooks/useModuleMutations'
import type { CatererModuleViewModel } from '@/features/adminModulesPricing/types/modulesPricing.types'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>{label}</label>
      {children}
      {hint && <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{hint}</p>}
    </div>
  )
}

const inputClass = 'px-3 py-2 rounded-xl text-[13px] outline-none'
const inputStyle = { background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }

/** Commercial terms (contract dates, renewal, payment terms) are modeled per module on the backend — matches the client spec's module configuration table. */
export function CommercialTermsScreen({ catererId, modules }: { catererId: string; modules: CatererModuleViewModel[] }) {
  const active = modules.filter(m => m.status !== 'inactive')
  const [selectedKey, setSelectedKey] = useState<string>(active[0]?.key ?? modules[0]?.key ?? '')
  const detailQuery = useModulePricingDetail(catererId, selectedKey, Boolean(selectedKey))
  const saveMutation = useSaveCommercialTerms()

  const [startDate, setStartDate] = useState('')
  const [termMonths, setTermMonths] = useState<number | ''>('')
  const [autoRenewal, setAutoRenewal] = useState(false)
  const [paymentDays, setPaymentDays] = useState<number | ''>('')
  const [specialTerms, setSpecialTerms] = useState('')

  // Adjust form state during render when fresh data arrives, rather than an
  // effect + setState (which triggers a redundant extra render) — see
  // `FoundingPartnerScreen.tsx` for the same pattern.
  const [prefilledFor, setPrefilledFor] = useState<typeof detailQuery.data>(undefined)
  if (detailQuery.data && detailQuery.data !== prefilledFor) {
    setPrefilledFor(detailQuery.data)
    const t = detailQuery.data.commercialTerms
    setStartDate(t.contractStartDate?.slice(0, 10) ?? '')
    setTermMonths(t.contractTermMonths ?? '')
    setAutoRenewal(t.autoRenewal)
    setPaymentDays(t.paymentDaysInAdvance ?? '')
    setSpecialTerms(t.specialTerms ?? '')
  }

  const endDate = startDate && termMonths
    ? (() => { const d = new Date(startDate); d.setMonth(d.getMonth() + Number(termMonths)); return d.toISOString().slice(0, 10) })()
    : null

  const missingFields = [!startDate && 'Contract start date', !termMonths && 'Contract term'].filter(Boolean)

  function save() {
    saveMutation.mutate({
      catererId, moduleKey: selectedKey,
      contractStartDate: startDate || undefined,
      contractTermMonths: termMonths ? Number(termMonths) : undefined,
      autoRenewal,
      paymentDaysInAdvance: paymentDays === '' ? undefined : Number(paymentDays),
      specialTerms: specialTerms || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <ModuleSelector modules={modules} selectedKey={selectedKey} onChange={setSelectedKey} />

      {detailQuery.isLoading ? (
        <p className="text-[13px]" style={{ color: 'var(--text-4)' }}>Loading…</p>
      ) : (
        <>
          {missingFields.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl px-5 py-3.5" style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.22)' }}>
              <AlertTriangle size={14} strokeWidth={2} style={{ color: '#fbbf24' }} />
              <p className="text-[12.5px]" style={{ color: '#fbbf24' }}><strong>Required:</strong> {missingFields.join(', ')}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays size={14} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
                <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Contract Dates</p>
              </div>
              <Field label="Contract Start Date" hint="The date the contract takes legal effect.">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} style={inputStyle} />
              </Field>
              <Field label="Contract Term (months)" hint="Standard: 12, 24, or 36 months.">
                <div className="flex gap-2 flex-wrap">
                  {[12, 24, 36, 48].map(n => (
                    <button key={n} onClick={() => setTermMonths(n)}
                      className="px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
                      style={{ background: termMonths === n ? 'var(--accent-dim)' : 'var(--bg-inner)', color: termMonths === n ? 'var(--accent)' : 'var(--text-3)', border: `1px solid ${termMonths === n ? 'var(--accent-border)' : 'var(--border-strong)'}` }}>
                      {n} mo
                    </button>
                  ))}
                  <input type="number" min={1} value={termMonths} onChange={e => setTermMonths(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Custom" className={`${inputClass} w-24 text-center`} style={inputStyle} />
                </div>
              </Field>
              {endDate && (
                <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.22)' }}>
                  <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />
                  <div>
                    <p className="text-[12px] font-semibold" style={{ color: '#4ade80' }}>Contract end: {endDate}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{termMonths} months from {startDate}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <div className="flex items-center gap-2 mb-1">
                <RotateCcw size={14} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
                <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Renewal &amp; Payment</p>
              </div>
              <Field label="Auto-Renewal" hint="Contract renews automatically at end of term unless cancelled.">
                <div className="flex gap-2">
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => setAutoRenewal(v)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
                      style={{
                        background: autoRenewal === v ? (v ? 'rgba(74,222,128,0.10)' : 'rgba(248,113,113,0.09)') : 'var(--bg-inner)',
                        color: autoRenewal === v ? (v ? '#4ade80' : '#f87171') : 'var(--text-3)',
                        border: `1px solid ${autoRenewal === v ? (v ? 'rgba(74,222,128,0.30)' : 'rgba(248,113,113,0.28)') : 'var(--border-strong)'}`,
                      }}>
                      {v ? 'Yes — auto-renew' : 'No — manual renewal'}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Payment Terms (days in advance)" hint="Net-30 is standard. Enter 0 for immediate.">
                <div className="flex gap-2 flex-wrap">
                  {[0, 15, 30, 45, 60].map(n => (
                    <button key={n} onClick={() => setPaymentDays(n)}
                      className="px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
                      style={{ background: paymentDays === n ? 'var(--accent-dim)' : 'var(--bg-inner)', color: paymentDays === n ? 'var(--accent)' : 'var(--text-3)', border: `1px solid ${paymentDays === n ? 'var(--accent-border)' : 'var(--border-strong)'}` }}>
                      {n === 0 ? 'Immediate' : `Net ${n}`}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="lg:col-span-2 rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <div className="flex items-center gap-2 mb-1">
                <FileText size={14} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
                <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Special Terms</p>
              </div>
              <Field label="Special Terms" hint="Feeds the contract's merge-field data as commercial context.">
                <textarea value={specialTerms} onChange={e => setSpecialTerms(e.target.value)}
                  rows={4} placeholder="e.g. Priority onboarding included for first 90 days…"
                  className="px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed resize-none outline-none" style={inputStyle} />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl px-5 py-4 flex items-center gap-6 flex-wrap" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <span className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Term: <strong style={{ color: 'var(--text-2)' }}>{termMonths || '—'} months</strong></span>
            <span className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Start: <strong style={{ color: 'var(--text-2)' }}>{startDate || '—'}</strong></span>
            <span className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>End: <strong style={{ color: 'var(--text-2)' }}>{endDate || '—'}</strong></span>
            <div className="ml-auto flex items-center gap-1.5" style={{ color: 'var(--text-4)' }}>
              <Clock size={11} strokeWidth={1.8} />
            </div>
            <button onClick={save} disabled={saveMutation.isPending}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#07070a' }}>
              {saveMutation.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
