import type { ReactNode } from 'react'
import { TrendingUp } from 'lucide-react'

const VALUE_COLORS = {
  lime:  { text: '#a3e635', glow: 'rgba(163,230,53,0.18)', border: 'rgba(163,230,53,0.30)', icon: 'rgba(163,230,53,0.12)' },
  blue:  { text: '#60a5fa', glow: 'rgba(96,165,250,0.18)',  border: 'rgba(96,165,250,0.30)',  icon: 'rgba(96,165,250,0.12)'  },
  red:   { text: '#f87171', glow: 'rgba(248,113,113,0.18)', border: 'rgba(248,113,113,0.30)', icon: 'rgba(248,113,113,0.12)' },
  amber: { text: '#fbbf24', glow: 'rgba(251,191,36,0.18)',  border: 'rgba(251,191,36,0.30)',  icon: 'rgba(251,191,36,0.12)'  },
}

interface StatCardProps {
  label: string; value: string | number; icon?: ReactNode | null
  valueColor?: 'lime' | 'blue' | 'red' | 'amber'
  trend?: string
}

export function StatCard({ label, value, icon, valueColor = 'lime', trend }: StatCardProps) {
  const c = VALUE_COLORS[valueColor]
  return (
    <div
      className="relative flex-1 min-w-0 rounded-2xl overflow-hidden card-float"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid var(--border-default)`,
        boxShadow: `0 0 0 0 ${c.glow}`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = c.border
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 28px ${c.glow}`
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-default)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 0 transparent'
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${c.text}88, transparent)` }} />

      <div className="px-5 pt-5 pb-5">
        <div className="flex items-start justify-between mb-5">
          <span
            className="text-[11.5px] uppercase tracking-[0.15em] font-bold leading-tight max-w-[130px]"
            style={{ color: 'var(--text-3)' }}
          >
            {label}
          </span>
          {icon && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: c.icon, color: c.text }}
            >
              {icon}
            </div>
          )}
        </div>

        <div
          className="text-[46px] font-black leading-none tracking-tighter"
          style={{
            color: c.text,
            textShadow: `0 0 32px ${c.glow}`,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>

        {trend && (
          <div className="mt-3 flex items-center gap-1">
            <TrendingUp size={11} strokeWidth={2.5} style={{ color: c.text }} />
            <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-3)' }}>{trend}</span>
          </div>
        )}
      </div>
    </div>
  )
}
