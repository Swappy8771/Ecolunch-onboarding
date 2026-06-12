import type { ReactNode } from 'react'
import { PageBadge } from '../ui/PageBadge'

interface PageHeaderProps {
  badge: { icon: ReactNode; label: string }
  title: string
  subtitle?: string
  right?: ReactNode
  /**
   * hero — large dashboard title, lg breakpoint, glow decoration (default)
   * page — standard inner-page title, sm breakpoint, no glow
   */
  size?: 'hero' | 'page'
  glowColor?: string
}

export function PageHeader({
  badge,
  title,
  subtitle,
  right,
  size = 'hero',
  glowColor = 'rgba(163,230,53,0.06)',
}: PageHeaderProps) {
  const isHero = size === 'hero'

  return (
    <div className={`relative ${isHero ? 'mb-8' : 'mb-7'}`}>
      {isHero && (
        <div
          className="absolute -top-4 -left-4 w-64 h-32 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 70%)` }}
        />
      )}

      <PageBadge icon={badge.icon} label={badge.label} />

      <div
        className={`flex flex-col gap-3 mt-2 ${
          isHero
            ? 'lg:flex-row lg:items-end lg:justify-between'
            : 'sm:flex-row sm:items-start sm:justify-between sm:gap-6'
        }`}
      >
        <div className="min-w-0">
          <h1
            className={`font-black tracking-tight leading-tight ${
              isHero
                ? 'text-[28px] sm:text-[36px] lg:text-[40px]'
                : 'text-[28px] sm:text-[34px] mb-2'
            }`}
            style={{
              background: 'linear-gradient(135deg, var(--text-1) 50%, var(--text-3) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] leading-relaxed mt-1 max-w-2xl" style={{ color: 'var(--text-3)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  )
}
