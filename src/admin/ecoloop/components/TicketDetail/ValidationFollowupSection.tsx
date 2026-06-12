import { ClipboardCheck, ExternalLink, Calendar, User } from 'lucide-react'
import type { ValidationFollowup } from '../../types/ecoloop.types'

export function ValidationFollowupSection({ items }: { items: ValidationFollowup[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <ClipboardCheck size={11} strokeWidth={2} style={{ color: '#a78bfa' }} />
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Validation Follow-ups</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {items.length === 0 ? (
          <p className="text-[12.5px] text-center py-8" style={{ color: 'var(--text-4)' }}>No validation follow-ups linked.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {items.map(item => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3.5">
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{item.item}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                      <User size={10} strokeWidth={2} />
                      <span className="text-[11.5px]">{item.assignedAdmin}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                      <Calendar size={10} strokeWidth={2} />
                      <span className="text-[11.5px]">Due {item.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: 'rgba(167,139,250,0.10)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
                    {item.status}
                  </span>
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer"
                    style={{ background: 'rgba(167,139,250,0.10)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
                    <ExternalLink size={10} strokeWidth={2} />Open Validation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
