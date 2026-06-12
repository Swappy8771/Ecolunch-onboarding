import type { Priority } from '../services/mock/validationMock'

export const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#f87171', bg: 'rgba(248,113,113,0.14)' },
  high:     { label: 'High',     color: '#fb923c', bg: 'rgba(251,146,60,0.14)'  },
  medium:   { label: 'Medium',   color: '#fbbf24', bg: 'rgba(251,191,36,0.14)'  },
  low:      { label: 'Low',      color: '#34d399', bg: 'rgba(52,211,153,0.14)'  },
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const m = PRIORITY_META[priority]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-[0.08em]"
      style={{ background: m.bg, color: m.color }}
    >
      {priority === 'critical' && (
        <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: m.color }} />
      )}
      {m.label}
    </span>
  )
}
