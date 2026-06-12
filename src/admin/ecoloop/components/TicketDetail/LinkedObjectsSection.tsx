import { useState } from 'react'
import { ChevronDown, ChevronRight, Link2, FileText, FileSignature, ShieldAlert, Cpu, ExternalLink } from 'lucide-react'
import type { LinkedObject, LinkedObjType } from '../../types/ecoloop.types'

const TYPE_META: Record<LinkedObjType, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  'validation':    { label: 'Validation',       icon: <Link2         size={13} strokeWidth={1.8} />, color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.25)' },
  'document':      { label: 'Document',         icon: <FileText      size={13} strokeWidth={1.8} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.25)'  },
  'smart-import':  { label: 'Smart Import',     icon: <Cpu           size={13} strokeWidth={1.8} />, color: '#4ade80', bg: 'rgba(74,222,128,0.10)',  border: 'rgba(74,222,128,0.25)'  },
  'contract':      { label: 'Contract',         icon: <FileSignature size={13} strokeWidth={1.8} />, color: '#fb923c', bg: 'rgba(251,146,60,0.10)',  border: 'rgba(251,146,60,0.25)'  },
  'golive-blocker':{ label: 'Go-live Blocker',  icon: <ShieldAlert   size={13} strokeWidth={1.8} />, color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
}

const SECTIONS: LinkedObjType[] = ['validation', 'document', 'smart-import', 'contract', 'golive-blocker']

export function LinkedObjectsSection({ objects }: { objects: LinkedObject[] }) {
  const [expanded, setExpanded] = useState<Set<LinkedObjType>>(new Set(['validation', 'document']))

  function toggle(t: LinkedObjType) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }

  const allEmpty = objects.length === 0

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
        Linked Objects
      </p>

      {allEmpty ? (
        <div className="rounded-2xl flex items-center justify-center py-10"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>No linked onboarding objects.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {SECTIONS.map(type => {
            const items = objects.filter(o => o.type === type)
            if (items.length === 0) return null
            const meta  = TYPE_META[type]
            const open  = expanded.has(type)
            return (
              <div key={type} className="rounded-xl overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                <button onClick={() => toggle(type)}
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                  style={{ background: open ? 'var(--bg-inner)' : 'transparent' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                      {meta.icon}
                    </div>
                    <span className="text-[12.5px] font-semibold" style={{ color: 'var(--text-2)' }}>{meta.label}</span>
                    <span className="text-[10.5px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: meta.bg, color: meta.color }}>{items.length}</span>
                  </div>
                  {open
                    ? <ChevronDown size={13} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
                    : <ChevronRight size={13} strokeWidth={2} style={{ color: 'var(--text-4)' }} />}
                </button>

                {open && (
                  <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                    {items.map(obj => (
                      <div key={obj.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-medium truncate" style={{ color: 'var(--text-1)' }}>{obj.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10.5px] font-mono" style={{ color: 'var(--text-4)' }}>{obj.refId}</span>
                            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--text-4)' }} />
                            <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{obj.status}</span>
                          </div>
                        </div>
                        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0"
                          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
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
