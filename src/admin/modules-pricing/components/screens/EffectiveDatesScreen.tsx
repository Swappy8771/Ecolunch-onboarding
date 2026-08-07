import { CalendarDays, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useConfigureModule } from '@/features/adminModulesPricing/hooks/useModuleMutations'
import type { CatererModuleViewModel, ModuleStatus } from '@/features/adminModulesPricing/types/modulesPricing.types'

const STATUS_LABEL: Record<ModuleStatus, string> = { active: 'Active', inactive: 'Inactive', pending: 'Pending' }

export function EffectiveDatesScreen({ catererId, modules }: { catererId: string; modules: CatererModuleViewModel[] }) {
  const configureMutation = useConfigureModule()
  const active = modules.filter(m => m.status !== 'inactive')
  const missingDates = active.filter(m => !m.effectiveDate)

  function setDate(moduleKey: string, field: 'effectiveDate' | 'endDate', value: string) {
    configureMutation.mutate({ catererId, moduleKey, [field]: value || null })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Active Modules', value: active.length, color: '#60a5fa' },
          { label: 'Dates Set',      value: active.length - missingDates.length, color: '#4ade80' },
          { label: 'Missing Dates',  value: missingDates.length, color: missingDates.length > 0 ? '#f87171' : '#4ade80' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl px-4 py-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <p className="text-[10px] uppercase tracking-[0.12em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{label}</p>
            <p className="text-[22px] font-black" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {missingDates.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl px-5 py-3.5" style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.22)' }}>
          <AlertTriangle size={14} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#f87171' }} />
          <div>
            <p className="text-[12.5px] font-bold" style={{ color: '#f87171' }}>Missing effective dates</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              {missingDates.map(m => m.name).join(', ')} — effective date is required for all active modules (blocks the `modules_configured` go-live gate).
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="px-5 py-3.5 flex items-center gap-2" style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
          <CalendarDays size={13} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Module Dates</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '620px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                {['Module', 'Status', 'Effective Date', 'End Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3"><span className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>{h}</span></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, idx) => (
                <tr key={mod.key} style={{ borderBottom: idx < modules.length - 1 ? '1px solid var(--border-subtle)' : 'none', opacity: mod.status === 'inactive' ? 0.5 : 1 }}>
                  <td className="px-4 py-3.5"><span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{mod.name}</span></td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: mod.status === 'active' ? 'rgba(74,222,128,0.12)' : 'var(--bg-inner)', color: mod.status === 'active' ? '#4ade80' : 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
                      {STATUS_LABEL[mod.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <input type="date" defaultValue={mod.effectiveDate?.slice(0, 10) ?? ''} onBlur={e => setDate(mod.key, 'effectiveDate', e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg text-[12.5px] outline-none" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
                      {mod.status !== 'inactive' && (mod.effectiveDate ? <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} /> : <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <input type="date" defaultValue={mod.endDate?.slice(0, 10) ?? ''} onBlur={e => setDate(mod.key, 'endDate', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg text-[12.5px] outline-none" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
