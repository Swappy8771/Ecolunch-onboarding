import { useState } from 'react'
import { CheckCircle2, AlertTriangle, Link2, Settings, Utensils, BarChart2, DollarSign, FileText } from 'lucide-react'
import type { CatererSetup, ModuleConfig, ModStatus } from '../../types/modules.types'

const CATEGORY_META = {
  meals:     { label: 'Meals',     color: '#60a5fa', icon: <Utensils   size={13} strokeWidth={1.8} /> },
  analytics: { label: 'Analytics', color: '#a78bfa', icon: <BarChart2  size={13} strokeWidth={1.8} /> },
  finance:   { label: 'Finance',   color: '#4ade80', icon: <DollarSign size={13} strokeWidth={1.8} /> },
  reporting: { label: 'Reporting', color: '#fbbf24', icon: <FileText   size={13} strokeWidth={1.8} /> },
}

const STATUS_META: Record<ModStatus, { label: string; color: string; bg: string; border: string }> = {
  active:     { label: 'Active',      color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.30)'  },
  configured: { label: 'Configured',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.30)'  },
  inactive:   { label: 'Inactive',    color: 'var(--text-4)', bg: 'var(--bg-inner)', border: 'var(--border-strong)' },
}

function ModuleCard({
  mod, allModules, onToggle,
}: { mod: ModuleConfig; allModules: ModuleConfig[]; onToggle: (id: string) => void }) {
  const cat  = CATEGORY_META[mod.category]
  const st   = STATUS_META[mod.status]
  const isOn = mod.status !== 'inactive'
  const unmetDeps = mod.dependencies.filter(depId => {
    const dep = allModules.find(m => m.id === depId)
    return dep?.status === 'inactive'
  })
  const missingPricing = isOn && mod.monthlyRate === null

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isOn ? st.border : 'var(--border-default)'}`,
        opacity: !isOn ? 0.7 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: cat.color + '18', color: cat.color, border: `1px solid ${cat.color}30` }}>
            {cat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-bold leading-snug truncate" style={{ color: 'var(--text-1)' }}>{mod.name}</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ background: cat.color + '15', color: cat.color }}>
              {cat.label}
            </span>
          </div>
        </div>
        {/* Toggle */}
        <button
          onClick={() => onToggle(mod.id)}
          className="relative w-10 h-5.5 rounded-full shrink-0 cursor-pointer transition-colors"
          style={{
            background: isOn ? 'var(--accent)' : 'var(--bg-inner)',
            border: `1px solid ${isOn ? 'var(--accent)' : 'var(--border-strong)'}`,
            width: '36px', height: '20px',
          }}
        >
          <span
            className="absolute top-[2px] rounded-full transition-all"
            style={{
              width: '14px', height: '14px',
              background: isOn ? '#07070a' : 'var(--text-4)',
              left: isOn ? '18px' : '2px',
            }}
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{mod.description}</p>

      {/* Meta row */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
          style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.color }} />
          {st.label}
        </span>
        {mod.effectiveDate && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            From {mod.effectiveDate}
          </span>
        )}
        {mod.dependencies.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(96,165,250,0.10)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
            <Link2 size={9} strokeWidth={2} />Requires {mod.dependencies.length} module{mod.dependencies.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Warnings */}
      {unmetDeps.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl px-3 py-2"
          style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.22)' }}>
          <AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#f87171' }} />
          <p className="text-[11px]" style={{ color: '#f87171' }}>
            Dependency not activated: {unmetDeps.join(', ')}
          </p>
        </div>
      )}
      {missingPricing && (
        <div className="flex items-start gap-2 rounded-xl px-3 py-2"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.22)' }}>
          <AlertTriangle size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
          <p className="text-[11px]" style={{ color: '#fbbf24' }}>Pricing not configured for this module</p>
        </div>
      )}
      {isOn && mod.monthlyRate !== null && (
        <div className="flex items-center gap-1 text-[12px]" style={{ color: '#4ade80' }}>
          <CheckCircle2 size={11} strokeWidth={2} />
          <span className="font-semibold">${mod.monthlyRate}/mo</span>
          {mod.setupFee !== null && <span style={{ color: 'var(--text-4)' }}>· ${mod.setupFee} setup</span>}
        </div>
      )}

      {/* Configure button */}
      {isOn && (
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer self-start mt-auto"
          style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
          <Settings size={12} strokeWidth={2} />Configure
        </button>
      )}
    </div>
  )
}

export function ModulesScreen({ setup }: { setup: CatererSetup }) {
  const [modules, setModules] = useState(setup.modules)
  const active = modules.filter(m => m.status !== 'inactive').length

  function toggle(id: string) {
    setModules(prev => prev.map(m =>
      m.id === id ? { ...m, status: m.status === 'inactive' ? 'configured' : 'inactive' } : m
    ))
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary row */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: 'Active', value: active, color: '#4ade80' },
          { label: 'Inactive', value: 7 - active, color: 'var(--text-4)' },
          { label: 'Pending Pricing', value: modules.filter(m => m.status !== 'inactive' && m.monthlyRate === null).length, color: '#fbbf24' },
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

      {/* Module grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {modules.map(mod => (
          <ModuleCard key={mod.id} mod={mod} allModules={modules} onToggle={toggle} />
        ))}
      </div>
    </div>
  )
}
