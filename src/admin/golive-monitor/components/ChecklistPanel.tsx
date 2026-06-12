import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import type { ChecklistItem } from '../types/golive.types'

const STATUS_META: Record<ChecklistItem['status'], { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  complete:   {
    icon: <CheckCircle2 size={14} strokeWidth={2} style={{ color: '#4ade80' }} />,
    color: '#4ade80', bg: 'rgba(74,222,128,0.07)',  border: 'rgba(74,222,128,0.18)',
  },
  incomplete: {
    icon: <AlertTriangle size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />,
    color: 'var(--text-4)', bg: 'transparent', border: 'transparent',
  },
  blocked: {
    icon: <XCircle size={14} strokeWidth={2} style={{ color: '#f87171' }} />,
    color: '#f87171', bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.18)',
  },
}

export function ChecklistPanel({ items }: { items: ChecklistItem[] }) {
  const complete   = items.filter(i => i.status === 'complete').length
  const incomplete = items.filter(i => i.status === 'incomplete').length
  const blocked    = items.filter(i => i.status === 'blocked').length

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
          Readiness Checklist
        </p>
        <div className="flex items-center gap-3 text-[11px]">
          <span style={{ color: '#4ade80' }}>{complete} done</span>
          {blocked > 0 && <span style={{ color: '#f87171' }}>{blocked} blocked</span>}
          {incomplete > 0 && <span style={{ color: 'var(--text-4)' }}>{incomplete} pending</span>}
        </div>
      </div>

      {/* Items */}
      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {items.map((item, _i) => {
          const m = STATUS_META[item.status]
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 transition-all"
              style={{
                background: item.status !== 'incomplete' ? m.bg : 'transparent',
                borderLeft: item.status !== 'incomplete' ? `2px solid ${m.color}` : '2px solid transparent',
              }}
            >
              <div className="shrink-0">{m.icon}</div>
              <span className="text-[12.5px] font-medium flex-1" style={{ color: item.status === 'complete' ? 'var(--text-2)' : item.status === 'blocked' ? '#f87171' : 'var(--text-4)' }}>
                {item.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold shrink-0"
                style={{
                  background: item.status === 'complete' ? 'rgba(74,222,128,0.12)' : item.status === 'blocked' ? 'rgba(248,113,113,0.10)' : 'var(--bg-inner)',
                  color: item.status === 'complete' ? '#4ade80' : item.status === 'blocked' ? '#f87171' : 'var(--text-4)',
                  border: `1px solid ${item.status === 'complete' ? 'rgba(74,222,128,0.25)' : item.status === 'blocked' ? 'rgba(248,113,113,0.22)' : 'var(--border-strong)'}`,
                }}>
                {item.status === 'complete' ? '✓ Done' : item.status === 'blocked' ? 'Blocked' : 'Pending'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
