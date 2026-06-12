import type { ReactNode } from 'react'

interface StatTileProps {
  label: string
  value: number
  color: string
  icon: ReactNode
}

export function StatTile({ label, value, color, icon }: StatTileProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 min-w-0"
      style={{ background: 'var(--bg-card)', border: `1px solid ${color}28` }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: color + '18', color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[22px] font-black tabular-nums leading-none" style={{ color }}>
          {value}
        </div>
        <div className="text-[11px] font-medium mt-0.5 truncate" style={{ color: 'var(--text-4)' }}>
          {label}
        </div>
      </div>
    </div>
  )
}
