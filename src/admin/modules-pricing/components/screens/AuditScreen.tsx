import { useState } from 'react'
import { User } from 'lucide-react'
import { ModuleSelector } from '../ModuleSelector'
import { useModuleHistory } from '@/features/adminModulesPricing/hooks/useModuleHistory'
import type { CatererModuleViewModel } from '@/features/adminModulesPricing/types/modulesPricing.types'

/** Per-module audit trail — there's no caterer-wide audit endpoint in this backend module, only `GET .../modules/:moduleKey/history`. */
export function AuditScreen({ catererId, modules }: { catererId: string; modules: CatererModuleViewModel[] }) {
  const [selectedKey, setSelectedKey] = useState<string>(modules[0]?.key ?? '')
  const historyQuery = useModuleHistory(catererId, selectedKey, Boolean(selectedKey))
  const history = historyQuery.data ?? []

  return (
    <div className="flex flex-col gap-4">
      <ModuleSelector modules={modules} selectedKey={selectedKey} onChange={setSelectedKey} />

      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {historyQuery.isLoading ? (
          <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-4)' }}>Loading history…</p>
        ) : history.length === 0 ? (
          <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-4)' }}>No audit entries for this module yet.</p>
        ) : (
          history.map((entry, i) => (
            <div key={entry.id} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0" style={{ width: '20px' }}>
                <div className="w-3 h-3 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--accent)', border: '2px solid var(--bg-surface)' }} />
                {i < history.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: 'var(--border-subtle)' }} />}
              </div>
              <div className="flex-1 pb-5 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{entry.action}</p>
                  <span className="text-[11px] tabular-nums shrink-0" style={{ color: 'var(--text-4)' }}>{entry.createdAt.slice(0, 16).replace('T', ' ')}</span>
                </div>
                <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                  <User size={10} strokeWidth={2} />
                  <span className="text-[11.5px]">{entry.actorId ?? 'System'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
