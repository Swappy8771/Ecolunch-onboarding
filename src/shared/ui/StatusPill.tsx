import type { ReactNode } from 'react'

type Size = 'sm' | 'md'

export interface StatusPillProps {
  label: string
  size?: Size
  dot?: boolean
  icon?: ReactNode
  bg: string
  color: string
  border?: string
  dotColor?: string
}

export function StatusPill({
  label,
  size = 'md',
  dot = false,
  icon,
  bg,
  color,
  border,
  dotColor,
}: StatusPillProps) {
  const padding = size === 'sm' ? '6px 10px' : '8px 12px'
  const fontSize = size === 'sm' ? '10.5px' : '11px'

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-semibold shrink-0"
      style={{
        padding,
        fontSize,
        background: bg,
        color,
        border: border ? `1px solid ${border}` : undefined,
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: dotColor ?? color }}
        />
      )}
      {icon}
      {label}
    </span>
  )
}

