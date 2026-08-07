import { useNavigate } from 'react-router-dom'
import { XCircle, AlertTriangle, ArrowRight, Rocket } from 'lucide-react'
import type { ContractReadinessViewModel } from '@/features/adminModulesPricing/types/modulesPricing.types'

export function ContractReadinessScreen({ readiness, isLoading }: { readiness: ContractReadinessViewModel | undefined; isLoading: boolean }) {
  const navigate = useNavigate()

  if (isLoading || !readiness) {
    return <p className="text-[13px]" style={{ color: 'var(--text-4)' }}>Loading contract readiness…</p>
  }

  const { catererId, catererName, mergeFields, validationStatus, readyForContracts, moduleGatesComplete, blockers, warnings } = readiness

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl p-5 flex items-center gap-5"
        style={{ background: readyForContracts ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.07)', border: `2px solid ${readyForContracts ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.30)'}` }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: readyForContracts ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.12)', border: `1px solid ${readyForContracts ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.28)'}` }}>
          {readyForContracts ? <Rocket size={22} strokeWidth={1.5} style={{ color: '#4ade80' }} /> : <XCircle size={22} strokeWidth={1.5} style={{ color: '#f87171' }} />}
        </div>
        <div className="flex-1">
          <p className="text-[16px] font-black mb-0.5" style={{ color: readyForContracts ? '#4ade80' : '#f87171' }}>
            {readyForContracts ? 'GO — Ready to Generate Contracts' : 'NOT READY'}
          </p>
          <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>
            {readyForContracts ? `${catererName} — all module gates and validation checks pass.` : `Resolve blocking issues before generating contracts for ${catererName}.`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[13px] font-bold" style={{ color: moduleGatesComplete ? '#4ade80' : '#f87171' }}>{moduleGatesComplete ? 'Gates ✓' : 'Gates ✗'}</p>
          <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>modules/pricing configured</p>
        </div>
      </div>

      {(blockers.length > 0 || warnings.length > 0) && (
        <div className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>Blockers &amp; Warnings</p>
          {blockers.map((b, i) => (
            <div key={`b${i}`} className="flex items-start gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.20)' }}>
              <AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#f87171' }} />
              <p className="text-[11.5px]" style={{ color: '#f87171' }}>{b}</p>
            </div>
          ))}
          {warnings.map((w, i) => (
            <div key={`w${i}`} className="flex items-start gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.20)' }}>
              <AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <p className="text-[11.5px]" style={{ color: '#fbbf24' }}>{w}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-4" style={{ color: 'var(--text-4)' }}>
          Contract Merge Fields — as consumed by Contract Management
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(mergeFields).map(([key, value]) => (
            <div key={key} className="rounded-xl px-3 py-3" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
              <p className="text-[10px] uppercase tracking-[0.11em] font-bold mb-1 font-mono" style={{ color: 'var(--text-4)' }}>{key}</p>
              <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-1)' }}>{String(value ?? '—')}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 flex items-center gap-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            disabled={!readyForContracts}
            onClick={() => navigate(`/admin/contract-management?catererId=${catererId}`)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all disabled:cursor-not-allowed"
            style={{ background: readyForContracts ? 'var(--accent)' : 'var(--bg-inner)', color: readyForContracts ? '#07070a' : 'var(--text-4)', border: `1px solid ${readyForContracts ? 'transparent' : 'var(--border-strong)'}` }}>
            <Rocket size={14} strokeWidth={2} />Open in Contract Management<ArrowRight size={12} strokeWidth={2.5} />
          </button>
          {!readyForContracts && (
            <p className="text-[12px]" style={{ color: 'var(--text-4)' }}>Resolve {blockers.length} blocking issue{blockers.length !== 1 ? 's' : ''} to unlock</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>Module Validation Summary</p>
        <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>
          {validationStatus.readyModules} of {validationStatus.totalActiveModules} active modules ready — see the Validation tab for per-module detail.
        </p>
      </div>
    </div>
  )
}
