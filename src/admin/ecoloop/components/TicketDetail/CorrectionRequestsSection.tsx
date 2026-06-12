import { ClipboardList, ExternalLink } from 'lucide-react'
import type { CorrectionRequest } from '../../types/ecoloop.types'

const STATUS_META: Record<CorrectionRequest['status'], { label: string; color: string; bg: string; border: string }> = {
  open:     { label: 'Open',     color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.26)' },
  resolved: { label: 'Resolved', color: '#4ade80', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.26)' },
  closed:   { label: 'Closed',   color: 'var(--text-4)', bg: 'var(--bg-inner)', border: 'var(--border-strong)'  },
}

export function CorrectionRequestsSection({ items }: { items: CorrectionRequest[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <ClipboardList size={11} strokeWidth={2} style={{ color: '#f87171' }} />
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Correction Requests</p>
        {items.filter(i => i.status === 'open').length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            {items.filter(i => i.status === 'open').length} open
          </span>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {items.length === 0 ? (
          <p className="text-[12.5px] text-center py-8" style={{ color: 'var(--text-4)' }}>No correction requests linked to this ticket.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {items.map(item => {
              const m = STATUS_META[item.status]
              return (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{item.item}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>Created {item.createdAt}</span>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--text-4)' }} />
                      <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>Linked: {item.linkedTicketId}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10.5px] font-bold shrink-0"
                    style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />{m.label}
                  </span>
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                    <ExternalLink size={10} strokeWidth={2} />Open
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
