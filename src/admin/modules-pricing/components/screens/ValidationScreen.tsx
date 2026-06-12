import { CheckCircle2, AlertTriangle, XCircle, Circle, ArrowRight } from 'lucide-react'
import type { CatererSetup, ValidationLevel } from '../../types/modules.types'
import { calcStats } from '../../services/mock/modulesMock'

interface Check {
  id: string
  label: string
  description: string
  status: ValidationLevel
  fixLabel?: string
  fixSection?: string
}

function buildChecks(setup: CatererSetup): Check[] {
  const stats = calcStats(setup)
  const pricedAll = stats.priced === stats.active
  const hasTerms  = !!setup.terms.startDate
  const activeMods = setup.modules.filter(m => m.status !== 'inactive')
  const missingDates = activeMods.filter(m => !m.effectiveDate)
  const warnings = setup.rules.filter(r => r.status === 'warning')

  return [
    {
      id: 'modules',
      label: 'At least one module activated',
      description: `${stats.active} module${stats.active !== 1 ? 's' : ''} currently active.`,
      status: stats.active > 0 ? 'pass' : 'error',
      fixLabel: 'Activate modules',
      fixSection: 'modules',
    },
    {
      id: 'pricing',
      label: 'All active modules have pricing',
      description: pricedAll
        ? `${stats.priced} active modules fully priced.`
        : `${stats.active - stats.priced} module${stats.active - stats.priced > 1 ? 's' : ''} missing monthly rate.`,
      status: pricedAll ? 'pass' : stats.priced > 0 ? 'warning' : 'error',
      fixLabel: 'Complete pricing',
      fixSection: 'pricing',
    },
    {
      id: 'terms',
      label: 'Contract start date set',
      description: hasTerms
        ? `Contract starts ${setup.terms.startDate}, ${setup.terms.termMonths} months.`
        : 'Contract start date is required to generate the contract.',
      status: hasTerms ? 'pass' : 'error',
      fixLabel: 'Set start date',
      fixSection: 'commercial-terms',
    },
    {
      id: 'fp',
      label: 'Founding partner status defined',
      description: setup.foundingPartner.enabled
        ? `Founding partner enabled — ${setup.foundingPartner.discountPct}% discount.`
        : 'Founding partner not enabled. Confirm this is intentional.',
      status: 'pass',
    },
    {
      id: 'rules',
      label: 'No critical rule issues',
      description: warnings.length > 0
        ? `${warnings.length} rule${warnings.length > 1 ? 's' : ''} need attention: ${warnings.map(r => r.label).join(', ')}.`
        : 'All operational rules configured.',
      status: warnings.length > 0 ? 'warning' : 'pass',
      fixLabel: 'Review rules',
      fixSection: 'operational-rules',
    },
    {
      id: 'dates',
      label: 'All effective dates set',
      description: missingDates.length > 0
        ? `${missingDates.length} module${missingDates.length > 1 ? 's' : ''} missing effective date: ${missingDates.map(m => m.shortName).join(', ')}.`
        : 'All active module dates are set.',
      status: missingDates.length > 0 ? 'warning' : 'pass',
      fixLabel: 'Set dates',
      fixSection: 'effective-dates',
    },
    {
      id: 'signatory',
      label: 'Signatory details available',
      description: 'Signatory name and email must be confirmed before Dropbox Sign dispatch.',
      status: 'pending',
    },
    {
      id: 'template',
      label: 'Contract template selected',
      description: 'A Dropbox Sign template must be linked for this caterer configuration.',
      status: 'pending',
    },
  ]
}

const ICON_MAP: Record<ValidationLevel, React.ReactNode> = {
  pass:    <CheckCircle2 size={15} strokeWidth={2} style={{ color: '#4ade80' }} />,
  warning: <AlertTriangle size={15} strokeWidth={2} style={{ color: '#fbbf24' }} />,
  error:   <XCircle size={15} strokeWidth={2} style={{ color: '#f87171' }} />,
  pending: <Circle size={15} strokeWidth={2} style={{ color: 'var(--text-4)' }} />,
}

const STATUS_LABEL: Record<ValidationLevel, string> = {
  pass:    'Pass',
  warning: 'Warning',
  error:   'Error',
  pending: 'Pending',
}

const STATUS_STYLE: Record<ValidationLevel, { bg: string; color: string; border: string }> = {
  pass:    { bg: 'rgba(74,222,128,0.10)',  color: '#4ade80',        border: 'rgba(74,222,128,0.28)'  },
  warning: { bg: 'rgba(251,191,36,0.10)', color: '#fbbf24',        border: 'rgba(251,191,36,0.26)' },
  error:   { bg: 'rgba(248,113,113,0.09)', color: '#f87171',       border: 'rgba(248,113,113,0.26)' },
  pending: { bg: 'var(--bg-inner)',        color: 'var(--text-4)', border: 'var(--border-strong)'  },
}

export function ValidationScreen({ setup, onNavigate }: { setup: CatererSetup; onNavigate?: (s: string) => void }) {
  const checks = buildChecks(setup)
  const pass    = checks.filter(c => c.status === 'pass').length
  const errors  = checks.filter(c => c.status === 'error').length
  const warns   = checks.filter(c => c.status === 'warning').length
  const pending = checks.filter(c => c.status === 'pending').length
  const pct     = Math.round((pass / checks.length) * 100)

  return (
    <div className="flex flex-col gap-5">
      {/* Score banner */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-5 mb-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" style={{ stroke: 'var(--bg-inner)' }} />
              <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ stroke: errors > 0 ? '#f87171' : warns > 0 ? '#fbbf24' : '#4ade80', transition: 'stroke-dashoffset 0.5s ease' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[14px] font-black" style={{ color: errors > 0 ? '#f87171' : warns > 0 ? '#fbbf24' : '#4ade80' }}>{pct}%</span>
            </div>
          </div>
          <div>
            <p className="text-[16px] font-bold mb-0.5" style={{ color: 'var(--text-1)' }}>
              {errors > 0 ? 'Validation Failed' : warns > 0 ? 'Validation Warnings' : pending > 0 ? 'Pending Checks' : 'All Checks Passed'}
            </p>
            <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>
              {pass} of {checks.length} checks passed · {errors} errors · {warns} warnings · {pending} pending
            </p>
          </div>
          <div className="ml-auto flex gap-2.5">
            {[
              { label: 'Pass',    n: pass,    color: '#4ade80' },
              { label: 'Warning', n: warns,   color: '#fbbf24' },
              { label: 'Error',   n: errors,  color: '#f87171' },
              { label: 'Pending', n: pending, color: 'var(--text-4)' },
            ].map(({ label, n, color }) => (
              <div key={label} className="flex flex-col items-center px-3 py-2 rounded-xl"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
                <span className="text-[18px] font-black" style={{ color }}>{n}</span>
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-4)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: errors > 0 ? '#f87171' : warns > 0 ? '#fbbf24' : '#4ade80' }} />
        </div>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-3">
        {checks.map(check => {
          const st = STATUS_STYLE[check.status]
          return (
            <div key={check.id} className="flex items-start gap-4 rounded-2xl px-5 py-4"
              style={{ background: 'var(--bg-card)', border: `1px solid ${check.status !== 'pass' ? st.border : 'var(--border-default)'}` }}>
              <div className="shrink-0 mt-0.5">{ICON_MAP[check.status]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-0.5">
                  <p className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{check.label}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold"
                    style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                    {STATUS_LABEL[check.status]}
                  </span>
                </div>
                <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>{check.description}</p>
              </div>
              {check.fixLabel && check.status !== 'pass' && (
                <button
                  onClick={() => onNavigate?.(check.fixSection!)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer shrink-0 transition-all"
                  style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                  {check.fixLabel} <ArrowRight size={11} strokeWidth={2.5} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
