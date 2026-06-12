import type { ReactNode } from 'react'

interface ColoredIconBoxProps {
  icon: ReactNode
  color: string
  size?: number
  radius?: string
}

export function ColoredIconBox({
  icon,
  color,
  size = 24,
  radius = 'rounded-md',
}: ColoredIconBoxProps) {
  return (
    <div
      className={`flex items-center justify-center shrink-0 ${radius}`}
      style={{ width: size, height: size, background: color + '18', color }}
    >
      {icon}
    </div>
  )
}
