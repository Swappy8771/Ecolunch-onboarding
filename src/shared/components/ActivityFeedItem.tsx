import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ColoredIconBox } from './ColoredIconBox'

interface ActivityFeedItemProps {
  icon: ReactNode
  color: string
  priorityLabel: string
  caterer: string
  eventType: string
  detail: string
  time: string
  action: string
  to: string
  isLast: boolean
}

export function ActivityFeedItem({
  icon,
  color,
  priorityLabel,
  caterer,
  eventType,
  detail,
  time,
  action,
  to,
  isLast,
}: ActivityFeedItemProps) {
  return (
    <div
      className="flex items-stretch transition-colors"
      style={{ borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {/* Priority left strip */}
      <div className="w-[3px] shrink-0 rounded-l-sm" style={{ background: color }} />

      <div className="flex-1 min-w-0 px-4 py-3 flex flex-col gap-1.5">
        {/* Row 1 */}
        <div className="flex items-center gap-2 flex-wrap">
          <ColoredIconBox icon={icon} color={color} />
          <span className="text-[14px] font-bold leading-tight shrink-0" style={{ color: 'var(--text-1)' }}>
            {caterer}
          </span>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0"
            style={{ background: color + '18', color, border: `1px solid ${color}30` }}
          >
            {eventType}
          </span>
          <span
            className="text-[10.5px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded shrink-0"
            style={{ background: color + '12', color }}
          >
            {priorityLabel}
          </span>
          <span className="ml-auto text-[11px] tabular-nums shrink-0" style={{ color: 'var(--text-4)' }}>
            {time}
          </span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-3 pl-0 sm:pl-8">
          <span className="text-[12.5px] flex-1 min-w-0 truncate" style={{ color: 'var(--text-3)' }}>
            {detail}
          </span>
          <Link
            to={to}
            className="flex items-center gap-1 shrink-0 text-[11.5px] font-semibold px-2.5 py-1 rounded-lg transition-all"
            style={{ background: color + '15', color, border: `1px solid ${color}30`, textDecoration: 'none' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = color + '28'
              el.style.borderColor = color + '55'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = color + '15'
              el.style.borderColor = color + '30'
            }}
          >
            {action}
            <ArrowRight size={10} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  )
}
