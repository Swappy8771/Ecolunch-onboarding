import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import { StatCard } from '@/features/adminDashboard/components/StatCard'
import type { CatererModuleSetupViewModel, ValidationStatusViewModel } from '@/features/adminModulesPricing/types/modulesPricing.types'

function CheckItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: done ? 'rgba(74,222,128,0.15)' : 'var(--bg-inner)', border: `1px solid ${done ? 'rgba(74,222,128,0.4)' : 'var(--border-strong)'}` }}>
        {done ? <CheckCircle2 size={11} strokeWidth={2.5} style={{ color: '#4ade80' }} /> : <span className="w-2 h-2 rounded-full" style={{ background: 'var(--border-strong)' }} />}
      </div>
      <span className="text-[12.5px]" style={{ color: done ? 'var(--text-2)' : 'var(--text-4)' }}>{label}</span>
    </div>
  )
}

interface DashboardScreenProps {
  setup: CatererModuleSetupViewModel
  validationStatus: ValidationStatusViewModel | undefined
  onNavigate: (s: string) => void
}

export function DashboardScreen({ setup, validationStatus, onNavigate }: DashboardScreenProps) {
  const { summary, modules } = setup
  const catalogueSize = modules.length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <StatCard label="Activated Modules"  value={`${summary.activeCount}/${catalogueSize}`} valueColor="blue" trend="configured" icon={null} />
        <StatCard label="Monthly Total"      value={`$${(summary.monthlyTotalCents / 100).toLocaleString()}`} valueColor="lime" trend="net of discounts" icon={null} />
        <StatCard label="Setup Fees Total"   value={`$${(summary.setupFeesTotalCents / 100).toLocaleString()}`} valueColor="blue" trend="one-time" icon={null} />
        <StatCard label="Validation"         value={validationStatus?.overallReady ? 'Ready' : 'Not Ready'} valueColor={validationStatus?.overallReady ? 'lime' : 'amber'} trend={validationStatus ? `${validationStatus.readyModules}/${validationStatus.totalActiveModules} modules ready` : 'loading…'} icon={null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>Configuration Checklist</p>
          <CheckItem label="At least one module activated" done={summary.activeCount > 0} />
          <CheckItem label="All active modules priced (modules_configured gate)" done={summary.modulesConfigured} />
          <CheckItem label="Pricing set on all active modules (pricing_configured gate)" done={summary.pricingConfigured} />
          <CheckItem label="All module readiness checks pass" done={validationStatus?.overallReady ?? false} />
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>Blockers &amp; Warnings</p>
          {!validationStatus ? (
            <span className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Loading…</span>
          ) : validationStatus.blockers.length === 0 && validationStatus.warnings.length === 0 ? (
            <div className="flex items-center gap-2" style={{ color: '#4ade80' }}>
              <CheckCircle2 size={13} strokeWidth={2} />
              <span className="text-[12.5px] font-medium">No blockers or warnings</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {validationStatus.blockers.map((b, i) => (
                <div key={`b${i}`} className="flex items-start gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.20)' }}>
                  <AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#f87171' }} />
                  <p className="text-[11.5px]" style={{ color: '#f87171' }}>{b}</p>
                </div>
              ))}
              {validationStatus.warnings.map((w, i) => (
                <div key={`w${i}`} className="flex items-start gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.20)' }}>
                  <AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
                  <p className="text-[11.5px]" style={{ color: '#fbbf24' }}>{w}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate('modules')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
          style={{ background: 'var(--accent)', color: '#07070a' }}>
          Activate / Configure Modules <ArrowRight size={12} strokeWidth={2.5} />
        </button>
        <button onClick={() => onNavigate('validation')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
          style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
          View Full Validation
        </button>
      </div>
    </div>
  )
}
