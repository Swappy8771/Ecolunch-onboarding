import type { ReactNode } from 'react'

export function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="w-5 h-5 flex items-center justify-center mt-0.5 shrink-0" style={{ color: 'var(--text-4)' }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>
          {label}
        </div>
        <div className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>{value}</div>
      </div>
    </div>
  )
}
