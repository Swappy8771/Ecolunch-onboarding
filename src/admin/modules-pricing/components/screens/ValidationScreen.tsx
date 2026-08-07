import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import type { ValidationStatusViewModel } from '@/features/adminModulesPricing/types/modulesPricing.types'

export function ValidationScreen({ validationStatus, isLoading }: { validationStatus: ValidationStatusViewModel | undefined; isLoading: boolean }) {
  if (isLoading || !validationStatus) {
    return <p className="text-[13px]" style={{ color: 'var(--text-4)' }}>Loading validation status…</p>
  }

  const { overallReady, totalActiveModules, readyModules, moduleValidations, blockers, warnings } = validationStatus
  const pct = totalActiveModules === 0 ? 100 : Math.round((readyModules / totalActiveModules) * 100)

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-5 mb-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" style={{ stroke: 'var(--bg-inner)' }} />
              <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 26}`} strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`} strokeLinecap="round"
                style={{ stroke: overallReady ? '#4ade80' : '#f87171', transition: 'stroke-dashoffset 0.5s ease' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[14px] font-black" style={{ color: overallReady ? '#4ade80' : '#f87171' }}>{pct}%</span>
            </div>
          </div>
          <div>
            <p className="text-[16px] font-bold mb-0.5" style={{ color: 'var(--text-1)' }}>
              {overallReady ? 'All Active Modules Ready' : `${totalActiveModules - readyModules} Module${totalActiveModules - readyModules !== 1 ? 's' : ''} Not Ready`}
            </p>
            <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>
              {readyModules} of {totalActiveModules} active modules ready · {blockers.length} blocker{blockers.length !== 1 ? 's' : ''} · {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: overallReady ? '#4ade80' : '#f87171' }} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {moduleValidations.length === 0 ? (
          <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-4)' }}>No active modules yet — activate a module to see its readiness here.</p>
        ) : moduleValidations.map(v => (
          <div key={v.moduleKey} className="flex items-start gap-4 rounded-2xl px-5 py-4"
            style={{ background: 'var(--bg-card)', border: `1px solid ${v.isReady ? 'var(--border-default)' : 'rgba(248,113,113,0.25)'}` }}>
            <div className="shrink-0 mt-0.5">
              {v.isReady ? <CheckCircle2 size={15} strokeWidth={2} style={{ color: '#4ade80' }} /> : <XCircle size={15} strokeWidth={2} style={{ color: '#f87171' }} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-bold mb-1" style={{ color: 'var(--text-1)' }}>{v.moduleName}</p>
              {v.blockers.map((b, i) => (
                <p key={`b${i}`} className="text-[12px] mb-0.5" style={{ color: '#f87171' }}>• {b}</p>
              ))}
              {v.warnings.map((w, i) => (
                <p key={`w${i}`} className="text-[12px] mb-0.5" style={{ color: '#fbbf24' }}>• {w}</p>
              ))}
              {v.blockers.length === 0 && v.warnings.length === 0 && (
                <p className="text-[12px]" style={{ color: '#4ade80' }}>All requirements met.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {(blockers.length > 0 || warnings.length > 0) && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>All Blockers &amp; Warnings</p>
          <div className="flex flex-col gap-1.5">
            {blockers.map((b, i) => <div key={`ab${i}`} className="flex items-start gap-2"><AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#f87171' }} /><p className="text-[12px]" style={{ color: '#f87171' }}>{b}</p></div>)}
            {warnings.map((w, i) => <div key={`aw${i}`} className="flex items-start gap-2"><AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#fbbf24' }} /><p className="text-[12px]" style={{ color: '#fbbf24' }}>{w}</p></div>)}
          </div>
        </div>
      )}
    </div>
  )
}
