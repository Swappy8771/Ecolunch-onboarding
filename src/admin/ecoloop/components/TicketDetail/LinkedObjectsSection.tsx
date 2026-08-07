import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { LinkedItemViewModel, LinkedModule } from '@/features/adminEcoloop/types/ecoloop.types'
import { LINKED_MODULE_META } from '../TicketStatusBadge'

/** Same "which admin page owns this" reasoning as Go-Live Monitor's `MODULE_ROUTE` map — Smart
 *  Import has no dedicated admin page yet, so it falls back to Caterers like Go-Live's own map does. */
const MODULE_ROUTE: Record<LinkedModule, string> = {
  validation: '/admin/validation-center',
  documents: '/admin/document-vault',
  contracts: '/admin/contract-management',
  'modules-pricing': '/admin/modules-pricing',
  'go-live': '/admin/golive-monitor',
  corrections: '/admin/validation-center',
  'smart-import': '/admin/caterers',
  school_meals: '/admin/modules-pricing',
  daycare_meals: '/admin/modules-pricing',
  camp_meals: '/admin/modules-pricing',
  accounting: '/admin/modules-pricing',
  reportiq: '/admin/modules-pricing',
}

const MODULES: LinkedModule[] = [
  'validation', 'documents', 'contracts', 'modules-pricing', 'go-live', 'corrections', 'smart-import',
  'school_meals', 'daycare_meals', 'camp_meals', 'accounting', 'reportiq',
]

interface LinkedObjectsSectionProps {
  items: LinkedItemViewModel[]
  catererId: string
  onLinkNew: (module: LinkedModule) => void
}

export function LinkedObjectsSection({ items, catererId, onLinkNew }: LinkedObjectsSectionProps) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<Set<LinkedModule>>(new Set(['validation', 'documents']))

  function toggle(m: LinkedModule) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(m)) next.delete(m)
      else next.add(m)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
          Linked Objects
        </p>
        <button onClick={() => onLinkNew('documents')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer"
          style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
          <Plus size={11} strokeWidth={2.5} />Link Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl flex items-center justify-center py-10"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>No linked onboarding objects.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {MODULES.map(module => {
            const groupItems = items.filter(o => o.module === module)
            if (groupItems.length === 0) return null
            const meta = LINKED_MODULE_META[module]
            const open = expanded.has(module)
            return (
              <div key={module} className="rounded-xl overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                <button onClick={() => toggle(module)}
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                  style={{ background: open ? 'var(--bg-inner)' : 'transparent' }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[12.5px] font-semibold" style={{ color: 'var(--text-2)' }}>{meta.label}</span>
                    <span className="text-[10.5px] px-1.5 py-0.5 rounded-full font-bold" style={{ color: meta.color }}>{groupItems.length}</span>
                  </div>
                  {open ? <ChevronDown size={13} strokeWidth={2} style={{ color: 'var(--text-4)' }} /> : <ChevronRight size={13} strokeWidth={2} style={{ color: 'var(--text-4)' }} />}
                </button>

                {open && (
                  <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                    {groupItems.map(item => (
                      <div key={`${item.module}-${item.entityId}`} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-medium truncate" style={{ color: 'var(--text-1)' }}>{item.label ?? 'Untitled item'}</p>
                          <span className="text-[10.5px] font-mono" style={{ color: 'var(--text-4)' }}>{item.entityId}</span>
                        </div>
                        <button
                          onClick={() => navigate(`${MODULE_ROUTE[module]}?catererId=${catererId}`)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0"
                          style={{ color: meta.color, border: '1px solid var(--border-strong)' }}>
                          <ExternalLink size={10} strokeWidth={2} />Open
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
