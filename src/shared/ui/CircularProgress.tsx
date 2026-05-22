interface CircularProgressProps {
  value: number   // 0-100
  size?: number   // px
  stroke?: number // stroke width
  label?: string  // centre label under %
}

export function CircularProgress({ value, size = 110, stroke = 9, label = 'GLOBAL' }: CircularProgressProps) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {/* Centre text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[20px] font-bold leading-none" style={{ color: 'var(--text-1)' }}>
          {value}%
        </span>
        <span className="text-[9px] uppercase tracking-[0.14em] font-semibold mt-0.5" style={{ color: 'var(--text-4)' }}>
          {label}
        </span>
      </div>
    </div>
  )
}
