import { ChevronDown } from 'lucide-react'
import type { CatererModuleViewModel } from '@/features/adminModulesPricing/types/modulesPricing.types'

interface ModuleSelectorProps {
  modules: CatererModuleViewModel[]
  selectedKey: string
  onChange: (key: string) => void
}

/** Shared by Founding Partner / Commercial Terms / Operational Rules / Audit — all 4 are single-module detail screens (the backend stores pricing/terms/config/history per module, not caterer-wide). */
export function ModuleSelector({ modules, selectedKey, onChange }: ModuleSelectorProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-2xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <span className="text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>Module</span>
      <div className="relative">
        <select
          value={selectedKey}
          onChange={e => onChange(e.target.value)}
          className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-[12.5px] font-semibold outline-none cursor-pointer"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)', minWidth: '220px' }}>
          {modules.map(m => (
            <option key={m.key} value={m.key}>{m.name}{m.status !== 'active' ? ` (${m.status})` : ''}</option>
          ))}
        </select>
        <ChevronDown size={12} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
      </div>
    </div>
  )
}
