import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  accentColor?: string
  to?: string
}

export function FeatureCard({ icon, title, description, accentColor = '#a3e635', to }: FeatureCardProps) {
  const glowColor  = accentColor + '20'
  const borderHover = accentColor + '50'

  const inner = (
    <>
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      />
      <div
        className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`,
          border: `1px solid ${accentColor}30`,
          color: accentColor,
        }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-[15px] font-semibold mb-1.5 leading-snug" style={{ color: 'var(--text-1)' }}>
          {title}
        </h3>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <span
          className="flex items-center gap-1.5 text-[13px] font-medium transition-all group-hover:gap-2"
          style={{ color: accentColor }}
        >
          Ouvrir
          <ArrowRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
        </span>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor, opacity: 0.5 }} />
      </div>
    </>
  )

  const sharedClass = "relative flex-1 min-w-0 rounded-2xl p-6 flex flex-col gap-4 group card-float overflow-hidden"
  const sharedStyle = { background: 'var(--bg-card)', border: '1px solid var(--border-default)' }

  const handleEnter = (el: HTMLElement) => {
    el.style.borderColor = borderHover
    el.style.boxShadow = `0 0 24px ${glowColor}`
  }
  const handleLeave = (el: HTMLElement) => {
    el.style.borderColor = 'var(--border-default)'
    el.style.boxShadow = 'none'
  }

  if (to) {
    return (
      <Link
        to={to}
        className={sharedClass + ' cursor-pointer'}
        style={{ ...sharedStyle, textDecoration: 'none' }}
        onMouseEnter={e => handleEnter(e.currentTarget)}
        onMouseLeave={e => handleLeave(e.currentTarget)}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div
      className={sharedClass + ' cursor-default'}
      style={sharedStyle}
      onMouseEnter={e => handleEnter(e.currentTarget)}
      onMouseLeave={e => handleLeave(e.currentTarget)}
    >
      {inner}
    </div>
  )
}
