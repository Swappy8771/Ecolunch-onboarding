import type { ReactNode } from 'react'

export function PageBadge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}
      >
        <span style={{ color: 'var(--accent)' }}>{icon}</span>
      </div>
      <span className="text-[10.5px] uppercase tracking-[0.16em] font-bold" style={{ color: 'var(--accent)' }}>
        {label}
      </span>
    </div>
  )
}

