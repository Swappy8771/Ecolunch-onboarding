import { CheckCircle2, XCircle, AlertTriangle, FileText, Pen, DollarSign, BookOpen, ArrowRight, Rocket } from 'lucide-react'
import type { CatererSetup } from '../../types/modules.types'
import { calcStats } from '../../services/mock/modulesMock'

interface ReadinessGate {
  id: string
  label: string
  subtitle: string
  icon: React.ReactNode
  color: string
  ready: boolean
  blockers: string[]
}

function buildGates(setup: CatererSetup): ReadinessGate[] {
  const stats = calcStats(setup)
  const pricedAll = stats.priced === stats.active
  const active = setup.modules.filter(m => m.status !== 'inactive')
  const missingDates = active.filter(m => !m.effectiveDate)
  const ruleIssues = setup.rules.filter(r => r.status === 'warning' || r.status === 'error')

  return [
    {
      id: 'generation',
      label: 'Contract Generation',
      subtitle: 'Template merge-ready with all required fields',
      icon: <FileText size={18} strokeWidth={1.6} />,
      color: '#60a5fa',
      ready: stats.active > 0 && !!setup.terms.startDate,
      blockers: [
        ...(stats.active === 0 ? ['No modules activated'] : []),
        ...(!setup.terms.startDate ? ['Contract start date missing'] : []),
      ],
    },
    {
      id: 'dropbox',
      label: 'Dropbox Sign Dispatch',
      subtitle: 'All merge fields populated, signatory confirmed',
      icon: <Pen size={18} strokeWidth={1.6} />,
      color: '#a78bfa',
      ready: pricedAll && stats.active > 0,
      blockers: [
        ...(!pricedAll ? [`${stats.active - stats.priced} module${stats.active - stats.priced > 1 ? 's' : ''} missing pricing`] : []),
        ...(['Signatory name & email must be confirmed before dispatch']),
      ].filter(b => !pricedAll || b.includes('Signatory')),
    },
    {
      id: 'fees',
      label: 'Fee Schedule',
      subtitle: 'All modules priced, founding partner applied',
      icon: <DollarSign size={18} strokeWidth={1.6} />,
      color: '#4ade80',
      ready: pricedAll,
      blockers: [
        ...(!pricedAll ? [`${active.filter(m => m.monthlyRate === null).map(m => m.name).join(', ')} — pricing incomplete`] : []),
      ],
    },
    {
      id: 'annexes',
      label: 'Module Annexes',
      subtitle: 'Effective dates and operational rules per module',
      icon: <BookOpen size={18} strokeWidth={1.6} />,
      color: '#fbbf24',
      ready: missingDates.length === 0 && ruleIssues.length === 0,
      blockers: [
        ...(missingDates.length > 0 ? [`${missingDates.map(m => m.shortName).join(', ')} — missing effective date`] : []),
        ...(ruleIssues.length > 0 ? [`${ruleIssues.length} operational rule${ruleIssues.length > 1 ? 's' : ''} need configuration`] : []),
      ],
    },
  ]
}

export function ContractReadinessScreen({ setup }: { setup: CatererSetup }) {
  const gates = buildGates(setup)
  const ready = gates.filter(g => g.ready).length
  const total = gates.length
  const allReady = ready === total

  const stats = calcStats(setup)
  const grossMonthly = setup.modules.filter(m => m.status !== 'inactive').reduce((s, m) => s + (m.monthlyRate ?? 0), 0)
  const fpDiscount = setup.foundingPartner.enabled ? grossMonthly * (setup.foundingPartner.discountPct / 100) : 0
  const netMonthly = grossMonthly - fpDiscount

  return (
    <div className="flex flex-col gap-5">
      {/* Go/no-go banner */}
      <div className="rounded-2xl p-5 flex items-center gap-5"
        style={{
          background: allReady ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.07)',
          border: `2px solid ${allReady ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.30)'}`,
        }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: allReady ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.12)', border: `1px solid ${allReady ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.28)'}` }}>
          {allReady ? <Rocket size={22} strokeWidth={1.5} style={{ color: '#4ade80' }} />
                    : <XCircle size={22} strokeWidth={1.5} style={{ color: '#f87171' }} />}
        </div>
        <div className="flex-1">
          <p className="text-[16px] font-black mb-0.5" style={{ color: allReady ? '#4ade80' : '#f87171' }}>
            {allReady ? 'GO — Contract Ready to Generate' : `NOT READY — ${total - ready} Gate${total - ready > 1 ? 's' : ''} Blocking`}
          </p>
          <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>
            {allReady
              ? `${setup.name} · ${stats.active} modules · $${Math.round(netMonthly).toLocaleString()}/mo · ${setup.terms.termMonths}mo term`
              : `Resolve all blocking issues before generating the contract for ${setup.name}.`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[28px] font-black" style={{ color: allReady ? '#4ade80' : '#f87171' }}>{ready}/{total}</p>
          <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>gates passed</p>
        </div>
      </div>

      {/* Gates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gates.map(gate => (
          <div key={gate.id} className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${gate.ready ? 'var(--border-default)' : 'rgba(248,113,113,0.25)'}`,
            }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: gate.color + '15', color: gate.color, border: `1px solid ${gate.color}28` }}>
                  {gate.icon}
                </div>
                <div>
                  <p className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{gate.label}</p>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>{gate.subtitle}</p>
                </div>
              </div>
              <div className="shrink-0">
                {gate.ready
                  ? <CheckCircle2 size={18} strokeWidth={2} style={{ color: '#4ade80' }} />
                  : <XCircle size={18} strokeWidth={2} style={{ color: '#f87171' }} />}
              </div>
            </div>

            {gate.blockers.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {gate.blockers.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl px-3 py-2"
                    style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.20)' }}>
                    <AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#f87171' }} />
                    <p className="text-[11.5px]" style={{ color: '#f87171' }}>{b}</p>
                  </div>
                ))}
              </div>
            )}

            {gate.ready && (
              <div className="flex items-center gap-2" style={{ color: '#4ade80' }}>
                <CheckCircle2 size={12} strokeWidth={2} />
                <span className="text-[12px] font-medium">All requirements met</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contract summary */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-4" style={{ color: 'var(--text-4)' }}>Contract Summary</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Caterer',         value: setup.name },
            { label: 'Active Modules',  value: String(stats.active) },
            { label: 'Monthly Net',     value: `$${Math.round(netMonthly).toLocaleString()}` },
            { label: 'Setup Fees',      value: `$${stats.setup.toLocaleString()}` },
            { label: 'Term',            value: setup.terms.startDate ? `${setup.terms.termMonths}mo` : '—' },
            { label: 'Start Date',      value: setup.terms.startDate ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-3 py-3 text-center"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
              <p className="text-[10px] uppercase tracking-[0.11em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>{label}</p>
              <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-1)' }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 flex items-center gap-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            disabled={!allReady}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all"
            style={{
              background: allReady ? 'var(--accent)' : 'var(--bg-inner)',
              color: allReady ? '#07070a' : 'var(--text-4)',
              border: `1px solid ${allReady ? 'transparent' : 'var(--border-strong)'}`,
              cursor: allReady ? 'pointer' : 'not-allowed',
            }}>
            <Rocket size={14} strokeWidth={2} />
            Generate Contract
            <ArrowRight size={12} strokeWidth={2.5} />
          </button>
          {!allReady && (
            <p className="text-[12px]" style={{ color: 'var(--text-4)' }}>
              Resolve {total - ready} blocking {total - ready === 1 ? 'issue' : 'issues'} to unlock
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
