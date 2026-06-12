import type { GoLiveStatus } from '../types/golive.types'

const META: Record<GoLiveStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  ready:     { label: 'Ready',     color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.30)',  dot: '#4ade80' },
  'not-ready': { label: 'Not Ready', color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.28)', dot: '#fbbf24' },
  blocked:   { label: 'Blocked',   color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.28)', dot: '#f87171' },
}

export function GoLiveStatusBadge({ status }: { status: GoLiveStatus }) {
  const m = META[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.dot }} />
      {m.label}
    </span>
  )
}

export const STATUS_META = META
