import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode; title: string; description: string; onOpen?: () => void
}

export function FeatureCard({ icon, title, description, onOpen }: FeatureCardProps) {
  return (
    <div
      className="flex-1 min-w-0 rounded-2xl p-6 flex flex-col gap-5 transition-colors cursor-default group card-float"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-3)' }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-[14px] font-semibold mb-1.5 leading-snug" style={{ color: 'var(--text-1)' }}>
          {title}
        </h3>
        <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-4)' }}>
          {description}
        </p>
      </div>
      <button
        onClick={onOpen}
        className="flex items-center gap-1.5 text-[12.5px] transition-colors cursor-pointer w-fit"
        style={{ color: 'var(--text-3)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-2)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
      >
        Ouvrir
        <ArrowRight size={13} strokeWidth={2} />
      </button>
    </div>
  )
}
