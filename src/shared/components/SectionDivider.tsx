import type { ReactNode } from 'react'

interface SectionDividerProps {
  label: string
  icon?: ReactNode
  rightLabel?: string
  meta?: ReactNode
  className?: string
}

export function SectionDivider({
  label,
  icon,
  rightLabel,
  meta,
  className = 'mb-5',
}: SectionDividerProps) {
  const hasExtras = !!meta
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${hasExtras ? 'flex-wrap' : ''} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}

      <span
        className="text-[13px] uppercase tracking-[0.15em] font-bold shrink-0"
        style={{ color: 'var(--text-4)' }}
      >
        {label}
      </span>

      {meta}

      <div
        className={`flex-1 h-px ${hasExtras ? 'hidden sm:block' : ''}`}
        style={{ background: 'var(--border-subtle)' }}
      />

      {rightLabel && (
        <span
          className="text-[12px] font-medium shrink-0 ml-auto sm:ml-0"
          style={{ color: 'var(--text-4)' }}
        >
          {rightLabel}
        </span>
      )}
    </div>
  )
}
