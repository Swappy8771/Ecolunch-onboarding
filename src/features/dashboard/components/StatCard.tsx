import type { ReactNode } from 'react'

const VALUE_COLORS = {
  lime:  '#a3e635',
  blue:  '#60a5fa',
  red:   '#f87171',
  amber: '#fbbf24',
}

interface StatCardProps {
  label: string; value: string | number; icon?: ReactNode | null
  valueColor?: 'lime' | 'blue' | 'red' | 'amber'
}

export function StatCard({ label, value, icon, valueColor = 'lime' }: StatCardProps) {
  return (
    <div
      className="flex-1 min-w-0 rounded-2xl px-5 py-5 card-float"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className="text-[10px] uppercase tracking-[0.13em] font-semibold leading-tight max-w-[120px]"
          style={{ color: 'var(--text-4)' }}
        >
          {label}
        </span>
        {icon && <span style={{ color: 'var(--border-strong)', flexShrink: 0 }}>{icon}</span>}
      </div>
      <div className="text-[42px] font-bold leading-none tracking-tight" style={{ color: VALUE_COLORS[valueColor] }}>
        {value}
      </div>
    </div>
  )
}
