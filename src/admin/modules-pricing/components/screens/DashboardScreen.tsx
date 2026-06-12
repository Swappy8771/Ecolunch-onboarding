import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, ArrowRight, Circle } from 'lucide-react'
import { StatCard } from '@/features/dashboard/components/StatCard'
import type { CatererSetup, ValidationLevel } from '../../types/modules.types'
import { calcStats } from '../../services/mock/modulesMock'

const VALIDATION_ICON: Record<ValidationLevel, React.ReactNode> = {
  pass:    <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />,
  warning: <AlertTriangle size={13} strokeWidth={2} style={{ color: '#fbbf24' }} />,
  error:   <XCircle size={13} strokeWidth={2} style={{ color: '#f87171' }} />,
  pending: <Circle size={13} strokeWidth={2} style={{ color: 'var(--text-4)' }} />,
}

function ProgressRow({ label, pct, status, note }: { label: string; pct: number; status: ValidationLevel; note: string }) {
  const color = status === 'pass' ? '#4ade80' : status === 'warning' ? '#fbbf24' : status === 'error' ? '#f87171' : 'var(--text-4)'
  return (
    <div className="flex flex-col gap-1.5 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {VALIDATION_ICON[status]}
          <span className="text-[13px] font-medium" style={{ color: 'var(--text-2)' }}>{label}</span>
        </div>
        <span className="text-[12px] font-bold tabular-nums" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{note}</p>
    </div>
  )
}

function CheckItem({ label, done, warn }: { label: string; done: boolean; warn?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: done ? 'rgba(74,222,128,0.15)' : warn ? 'rgba(251,191,36,0.12)' : 'var(--bg-inner)',
          border: `1px solid ${done ? 'rgba(74,222,128,0.4)' : warn ? 'rgba(251,191,36,0.35)' : 'var(--border-strong)'}`,
        }}>
        {done ? <CheckCircle2 size={11} strokeWidth={2.5} style={{ color: '#4ade80' }} />
               : warn ? <AlertTriangle size={10} strokeWidth={2.5} style={{ color: '#fbbf24' }} />
               : <span className="w-2 h-2 rounded-full" style={{ background: 'var(--border-strong)' }} />}
      </div>
      <span className="text-[12.5px]" style={{ color: done ? 'var(--text-2)' : 'var(--text-4)' }}>{label}</span>
    </div>
  )
}

export function DashboardScreen({ setup }: { setup: CatererSetup }) {
  const stats = calcStats(setup)
  const pricedAll = stats.priced === stats.active
  const hasTerms  = !!setup.terms.startDate
  const hasFP     = setup.foundingPartner.enabled

  const contractReadinessPct = Math.round(
    ([stats.active > 0, pricedAll, hasTerms, hasFP || true, stats.active > 0].filter(Boolean).length / 5) * 100
  )

  return (
    <div className="flex flex-col gap-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <StatCard label="Activated Modules"     value={`${stats.active}/7`}      valueColor="blue"  trend="configured"      icon={null} />
        <StatCard label="Pricing Configured"    value={`${stats.priced}/${stats.active || 1}`} valueColor={pricedAll ? 'lime' : 'amber'} trend={pricedAll ? 'complete' : 'incomplete'} icon={null} />
        <StatCard label="Commercial Exceptions" value={stats.exceptions}          valueColor="amber" trend="active exceptions" icon={null} />
        <StatCard label="Contract Readiness"    value={`${contractReadinessPct}%`} valueColor={contractReadinessPct === 100 ? 'lime' : 'amber'} trend="of checks passed" icon={null} />
        <StatCard label="Go-live Readiness"     value={setup.contractReady ? '100%' : '0%'} valueColor={setup.contractReady ? 'lime' : 'red'} trend={setup.contractReady ? 'ready' : 'not yet ready'} icon={null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Configuration progress */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Configuration Progress</p>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              Auto-saved {setup.lastSaved ?? '—'}
            </span>
          </div>
          <ProgressRow label="Activated Modules"    pct={Math.round((stats.active / 7) * 100)}  status={stats.active > 0 ? 'pass' : 'error'}   note={`${stats.active} of 7 available modules activated`} />
          <ProgressRow label="Pricing"              pct={stats.active ? Math.round((stats.priced / stats.active) * 100) : 0} status={pricedAll ? 'pass' : stats.priced > 0 ? 'warning' : 'error'} note={`${stats.priced} of ${stats.active} active modules priced`} />
          <ProgressRow label="Commercial Terms"     pct={hasTerms ? 90 : 0}  status={hasTerms ? 'pass' : 'error'}   note={hasTerms ? `Contract start: ${setup.terms.startDate}` : 'Contract start date missing'} />
          <ProgressRow label="Operational Rules"    pct={75}                  status="warning" note="1 rule needs configuration (auto-credit threshold)" />
          <ProgressRow label="Effective Dates"      pct={stats.active > 0 ? 85 : 0} status={stats.active > 0 ? 'warning' : 'error'} note="CSS Reporting end date not set" />
          <ProgressRow label="Validation"           pct={contractReadinessPct} status={contractReadinessPct === 100 ? 'pass' : 'warning'} note={`${5 - Math.ceil((100 - contractReadinessPct) / 20)} of 5 checks passed`} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Missing requirements */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>Missing Requirements</p>
            <div className="flex flex-col gap-2">
              {!pricedAll && (
                <div className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                  style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.20)' }}>
                  <AlertTriangle size={12} strokeWidth={2} className="mt-0.5 shrink-0" style={{ color: '#fbbf24' }} />
                  <div>
                    <p className="text-[12px] font-semibold" style={{ color: '#fbbf24' }}>CSS Reporting — Pricing missing</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>Monthly rate & setup fee required</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.20)' }}>
                <AlertTriangle size={12} strokeWidth={2} className="mt-0.5 shrink-0" style={{ color: '#fbbf24' }} />
                <div>
                  <p className="text-[12px] font-semibold" style={{ color: '#fbbf24' }}>Auto-credit rule not configured</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>Operational rules → Credit section</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent changes */}
          <div className="rounded-2xl p-5 flex-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>Recent Changes</p>
            <div className="flex flex-col gap-0">
              {setup.audit.slice(0, 5).map((e, i) => (
                <div key={e.id} className="flex items-start gap-2.5 py-2"
                  style={{ borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--accent)' }} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium truncate" style={{ color: 'var(--text-2)' }}>{e.action}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{e.user} · {e.ts.split(' ')[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration checklist */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Configuration Checklist</p>
          <div className="flex items-center gap-2">
            <TrendingUp size={12} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            <span className="text-[12px] font-semibold" style={{ color: 'var(--accent)' }}>
              {[stats.active > 0, pricedAll, hasTerms, true, true].filter(Boolean).length}/5 complete
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
          <CheckItem label="At least one module activated"    done={stats.active > 0} />
          <CheckItem label="All active modules priced"        done={pricedAll}        warn={!pricedAll && stats.priced > 0} />
          <CheckItem label="Contract start date set"          done={hasTerms} />
          <CheckItem label="Founding partner status defined"  done />
          <CheckItem label="Operational rules configured"     done warn />
          <CheckItem label="All effective dates set"          done={false} warn />
        </div>
        <div className="mt-4 pt-4 flex items-center gap-3 flex-wrap" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            Validate Configuration <ArrowRight size={12} strokeWidth={2.5} />
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
            Save Draft
          </button>
        </div>
      </div>
    </div>
  )
}
