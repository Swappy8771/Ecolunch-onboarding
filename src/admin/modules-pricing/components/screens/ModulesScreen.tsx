import { CheckCircle2, AlertTriangle, Settings, Utensils, BarChart2, DollarSign, FileText, Users } from 'lucide-react'
import { useConfigureModule } from '@/features/adminModulesPricing/hooks/useModuleMutations'
import type { CatererModuleViewModel, ModuleKey, ModuleStatus } from '@/features/adminModulesPricing/types/modulesPricing.types'

/** Decoration only (icon/color) — keyed on the real 7-value backend catalogue. Labels come from the backend's own `Module.name`, not hardcoded here. */
const MODULE_ICON: Record<ModuleKey, { color: string; icon: React.ReactNode }> = {
  school_meals:         { color: '#60a5fa', icon: <Utensils   size={15} strokeWidth={1.8} /> },
  daycare_meals:        { color: '#60a5fa', icon: <Utensils   size={15} strokeWidth={1.8} /> },
  camp_meals:           { color: '#60a5fa', icon: <Utensils   size={15} strokeWidth={1.8} /> },
  reportiq:             { color: '#a78bfa', icon: <BarChart2  size={15} strokeWidth={1.8} /> },
  accounting:           { color: '#4ade80', icon: <DollarSign size={15} strokeWidth={1.8} /> },
  parent_subscriptions: { color: '#fbbf24', icon: <Users      size={15} strokeWidth={1.8} /> },
  css_reporting:        { color: '#fbbf24', icon: <FileText   size={15} strokeWidth={1.8} /> },
}

const STATUS_META: Record<ModuleStatus, { label: string; color: string; bg: string; border: string }> = {
  active:   { label: 'Active',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.30)'  },
  pending:  { label: 'Pending',  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)'  },
  inactive: { label: 'Inactive', color: 'var(--text-4)', bg: 'var(--bg-inner)', border: 'var(--border-strong)'   },
}

function ModuleCard({ mod, catererId, onConfigure }: { mod: CatererModuleViewModel; catererId: string; onConfigure: () => void }) {
  const meta = MODULE_ICON[mod.key]
  const st = STATUS_META[mod.status]
  const isOn = mod.status !== 'inactive'
  const missingPricing = isOn && mod.pricing.monthlyPriceCents === null
  const configureMutation = useConfigureModule()

  function toggle() {
    configureMutation.mutate({ catererId, moduleKey: mod.key, status: isOn ? 'inactive' : 'active' })
  }

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 transition-all"
      style={{ background: 'var(--bg-card)', border: `1px solid ${isOn ? st.border : 'var(--border-default)'}`, opacity: !isOn ? 0.7 : 1 }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: meta.color + '18', color: meta.color, border: `1px solid ${meta.color}30` }}>
            {meta.icon}
          </div>
          <p className="text-[13.5px] font-bold leading-snug truncate" style={{ color: 'var(--text-1)' }}>{mod.name}</p>
        </div>
        <button
          onClick={toggle}
          disabled={configureMutation.isPending}
          className="relative shrink-0 rounded-full cursor-pointer transition-colors disabled:opacity-50"
          style={{ background: isOn ? 'var(--accent)' : 'var(--bg-inner)', border: `1px solid ${isOn ? 'var(--accent)' : 'var(--border-strong)'}`, width: '36px', height: '20px' }}>
          <span className="absolute top-[2px] rounded-full transition-all"
            style={{ width: '14px', height: '14px', background: isOn ? '#07070a' : 'var(--text-4)', left: isOn ? '18px' : '2px' }} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
          style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.color }} />
          {st.label}
        </span>
        {mod.effectiveDate && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            From {mod.effectiveDate.slice(0, 10)}
          </span>
        )}
      </div>

      {missingPricing && (
        <div className="flex items-start gap-2 rounded-xl px-3 py-2"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.22)' }}>
          <AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
          <p className="text-[11px]" style={{ color: '#fbbf24' }}>Pricing not configured for this module</p>
        </div>
      )}
      {isOn && mod.pricing.monthlyPriceCents !== null && (
        <div className="flex items-center gap-1 text-[12px]" style={{ color: '#4ade80' }}>
          <CheckCircle2 size={11} strokeWidth={2} />
          <span className="font-semibold">${(mod.pricing.monthlyPriceCents / 100).toFixed(2)}/mo</span>
          {mod.pricing.setupFeeCents !== null && <span style={{ color: 'var(--text-4)' }}>· ${(mod.pricing.setupFeeCents / 100).toFixed(2)} setup</span>}
        </div>
      )}

      {isOn && (
        <button onClick={onConfigure}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer self-start mt-auto"
          style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
          <Settings size={12} strokeWidth={2} />Configure Pricing
        </button>
      )}
    </div>
  )
}

export function ModulesScreen({ catererId, modules, onNavigate }: { catererId: string; modules: CatererModuleViewModel[]; onNavigate: (s: string) => void }) {
  const active = modules.filter(m => m.status !== 'inactive').length

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: 'Active', value: active, color: '#4ade80' },
          { label: 'Inactive', value: modules.length - active, color: 'var(--text-4)' },
          { label: 'Pending Pricing', value: modules.filter(m => m.status !== 'inactive' && m.pricing.monthlyPriceCents === null).length, color: '#fbbf24' },
        ].map(c => (
          <div key={c.label} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
            <span className="text-[12.5px] font-bold tabular-nums" style={{ color: c.color }}>{c.value}</span>
            <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{c.label}</span>
          </div>
        ))}
        <p className="text-[12px] ml-1" style={{ color: 'var(--text-4)' }}>
          Toggle a module to activate or deactivate it for this caterer.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {modules.map(mod => (
          <ModuleCard key={mod.key} mod={mod} catererId={catererId} onConfigure={() => onNavigate('pricing')} />
        ))}
      </div>
    </div>
  )
}
