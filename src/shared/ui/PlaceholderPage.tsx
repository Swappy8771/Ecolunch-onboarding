import type { ReactNode } from 'react'

interface PlaceholderPageProps {
  badgeIcon: ReactNode; breadcrumb: string; title: string
  description: string; cardIcon: ReactNode
}

export function PlaceholderPage({ badgeIcon, breadcrumb, title, description, cardIcon }: PlaceholderPageProps) {
  return (
    <div className="p-7">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3.5">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}
          >
            <span style={{ color: 'var(--accent)' }}>{badgeIcon}</span>
          </div>
          <span className="text-[10.5px] uppercase tracking-[0.16em] font-bold" style={{ color: 'var(--accent)' }}>
            {breadcrumb}
          </span>
        </div>
        <h1 className="text-[38px] font-bold tracking-tight leading-tight mb-3" style={{ color: 'var(--text-1)' }}>
          {title}
        </h1>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{description}</p>
      </div>

      <div
        className="w-full rounded-2xl flex flex-col items-center justify-center py-24 px-8 text-center"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <div
          className="w-[68px] h-[68px] rounded-full flex items-center justify-center mb-6"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-4)' }}
        >
          <span className="scale-[1.4]">{cardIcon}</span>
        </div>

        <h2 className="text-[17px] font-bold mb-3 leading-snug" style={{ color: 'var(--text-1)' }}>
          Section à définir prochainement
        </h2>
        <p className="text-[13px] leading-relaxed max-w-sm mb-7" style={{ color: 'var(--text-3)' }}>
          This onboarding type will be defined in a later phase. La structure restera visible
          dans la sidebar pour préparer les futures phases du moteur d'onboarding.
        </p>

        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-4)' }} />
          <span className="text-[11.5px] font-medium" style={{ color: 'var(--text-3)' }}>
            Placeholder · phase 2
          </span>
        </div>
      </div>
    </div>
  )
}
