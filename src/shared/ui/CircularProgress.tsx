interface CircularProgressProps {
  value: number   // 0-100
  size?: number
  stroke?: number
  label?: string
  color?: string
}

export function CircularProgress({
  value,
  size = 110,
  stroke = 9,
  label = 'GLOBAL',
  color = '#a3e635',
}: CircularProgressProps) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  const glowId = `glow-${label}`

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={stroke}
        />
        {/* Progress glow layer */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke + 2}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          opacity={0.25}
          filter={`url(#${glowId})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {/* Centre text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[22px] font-black leading-none tracking-tight" style={{ color: 'var(--text-1)' }}>
          {value}%
        </span>
        <span className="text-[8.5px] uppercase tracking-[0.16em] font-bold mt-1" style={{ color: 'var(--text-4)' }}>
          {label}
        </span>
      </div>
    </div>
  )
}
