import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface ChartRow {
  id: string
  label: string
  pct: number
  barColor: string
  badge: { label: string; color: string; bg: string; border: string; Icon: LucideIcon }
}

interface CompletionChartProps {
  title?: string
  overallPct: number
  filled: number
  total: number
  subtitle: string
  rows: ChartRow[]
}

const RING_R = 42
const RING_C = 2 * Math.PI * RING_R

let _cssInjected = false
function ensureCSS() {
  if (_cssInjected || typeof document === 'undefined') return
  const s = document.createElement('style')
  s.id = 'eco-chart-css'
  s.textContent = `
    @keyframes ecoWave {
      0%            { transform: translateX(-100%); }
      55%, 100%     { transform: translateX(280%); }
    }
    @keyframes ecoTrackPulse {
      0%, 100% { opacity: 0.5; }
      50%      { opacity: 1; }
    }
  `
  document.head.appendChild(s)
  _cssInjected = true
}

export function CompletionChart({
  title = 'Completion & Validation Status',
  overallPct,
  filled,
  total,
  subtitle,
  rows,
}: CompletionChartProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ensureCSS()
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const ringOffset = RING_C * (1 - overallPct / 100)
  const ringColor  = overallPct >= 80 ? '#4ade80' : overallPct >= 50 ? 'var(--accent)' : '#fbbf24'
  const ringGlow   = overallPct >= 80 ? 'rgba(74,222,128,0.4)' : overallPct >= 50 ? 'rgba(187,247,10,0.35)' : 'rgba(251,191,36,0.4)'

  return (
    <div className="rounded-2xl p-5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-5"
        style={{ color: 'var(--text-4)' }}>
        {title}
      </p>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">

        {/* ── Radial ring ───────────────────── */}
        <div className="shrink-0 flex flex-col items-center gap-2.5">
          <div className="relative" style={{ width: 112, height: 112 }}>
            <svg width="112" height="112" viewBox="0 0 112 112" style={{ overflow: 'visible' }}>
              {/* Glow filter */}
              <defs>
                <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Track */}
              <circle
                cx="56" cy="56" r={RING_R}
                fill="none"
                stroke="var(--bg-inner)"
                strokeWidth="9"
              />

              {/* Glow ring (blurred behind) */}
              {ready && (
                <circle
                  cx="56" cy="56" r={RING_R}
                  fill="none"
                  stroke={ringGlow}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 56 56)"
                  style={{
                    transition: 'stroke-dashoffset 1.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    filter: 'blur(4px)',
                  }}
                />
              )}

              {/* Main ring */}
              <circle
                cx="56" cy="56" r={RING_R}
                fill="none"
                stroke={ringColor}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={ready ? ringOffset : RING_C}
                transform="rotate(-90 56 56)"
                style={{
                  transition: 'stroke-dashoffset 1.3s cubic-bezier(0.23, 1, 0.32, 1), stroke 0.4s ease',
                }}
              />

              {/* Tick mark at start of ring */}
              {ready && overallPct > 0 && (
                <circle cx="56" cy="14" r="3" fill={ringColor}
                  style={{ transition: 'fill 0.4s ease' }} />
              )}
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
              <span
                className="text-[24px] font-black leading-none"
                style={{ color: ringColor, transition: 'color 0.4s ease' }}>
                {overallPct}%
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[11.5px] font-semibold" style={{ color: 'var(--text-4)' }}>{subtitle}</p>
            <p className="text-[12px] font-bold mt-0.5" style={{ color: ringColor }}>
              {filled} / {total} fields
            </p>
          </div>
        </div>

        {/* ── Per-row bars ──────────────────── */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-4">
          {rows.map((row, i) => {
            const delay = `${i * 0.09}s`
            return (
              <div key={row.id}>
                {/* Label + percentage + badge */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[12px] font-semibold truncate min-w-0"
                    style={{ color: 'var(--text-2)' }}>
                    {row.label}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11.5px] font-black tabular-nums"
                      style={{ color: 'var(--text-3)' }}>
                      {row.pct}%
                    </span>
                    <span
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: row.badge.bg, color: row.badge.color, border: `1px solid ${row.badge.border}` }}>
                      <row.badge.Icon size={8} strokeWidth={2.5} />
                      <span className="hidden xs:inline">{row.badge.label}</span>
                    </span>
                  </div>
                </div>

                {/* Bar track */}
                <div className="relative h-3 rounded-full overflow-hidden"
                  style={{ background: 'var(--bg-inner)' }}>
                  {/* Fill */}
                  <div
                    className="absolute top-0 left-0 h-full rounded-full overflow-hidden"
                    style={{
                      width: ready ? `${row.pct}%` : '0%',
                      background: `linear-gradient(90deg, ${row.barColor}cc, ${row.barColor})`,
                      transition: `width 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${delay}`,
                      boxShadow: `0 0 10px ${row.barColor}66`,
                    }}>
                    {/* Wave shimmer */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)',
                      animation: 'ecoWave 2.4s ease-in-out infinite',
                      animationDelay: `${1.1 + i * 0.12}s`,
                    }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
