import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ColoredIconBox } from './ColoredIconBox'

interface BlockerCardProps {
  icon: ReactNode
  severity: 'critical' | 'warning'
  caterer: string
  category: string
  issue: string
  action: string
  to: string
}

const SEVERITY_COLOR = {
  critical: '#f87171',
  warning:  '#fbbf24',
} as const

export function BlockerCard({ icon, severity, caterer, category, issue, action, to }: BlockerCardProps) {
  const color = SEVERITY_COLOR[severity]
  const isCritical = severity === 'critical'

  return (
    <div
      className="rounded-2xl flex flex-col gap-3 p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-card)', border: `1px solid ${color}30` }}
    >
      {/* Top accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${color}99, transparent)` }}
      />

      {/* Severity badge + category chip */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10.5px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-md"
          style={{ background: color + '18', color, border: `1px solid ${color}35` }}
        >
          {isCritical ? '⬤ Critical' : '▲ Warning'}
        </span>
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-md truncate"
          style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-subtle)' }}
        >
          {category}
        </span>
      </div>

      {/* Caterer name */}
      <div className="flex items-center gap-2">
        <ColoredIconBox icon={icon} color={color} />
        <span className="text-[14px] font-bold leading-tight" style={{ color: 'var(--text-1)' }}>
          {caterer}
        </span>
      </div>

      {/* Issue */}
      <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
        {issue}
      </p>

      {/* Action button */}
      <Link
        to={to}
        className="mt-auto flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-semibold transition-all"
        style={{ background: color + '18', color, border: `1px solid ${color}35`, textDecoration: 'none' }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = color + '30'
          el.style.borderColor = color + '60'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = color + '18'
          el.style.borderColor = color + '35'
        }}
      >
        {action}
        <ArrowRight size={12} strokeWidth={2.5} />
      </Link>
    </div>
  )
}
