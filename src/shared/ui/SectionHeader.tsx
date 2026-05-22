import { CircularProgress } from './CircularProgress'

type SectionStatus = 'en-cours' | 'a-faire' | 'complete'

interface SectionHeaderProps {
  title: string
  description: string
  progress: number
  status: SectionStatus
}

function SectionStatusBadge({ status }: { status: SectionStatus }) {
  if (status === 'en-cours')
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
        style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.22)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />En cours
      </span>
    )
  if (status === 'complete')
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
        style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.22)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />Complété
      </span>
    )
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
      style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-4)' }} />À faire
    </span>
  )
}

export function SectionHeader({ title, description, progress, status }: SectionHeaderProps) {
  return (
    <div className="rounded-2xl px-7 py-5 mb-5 flex items-center justify-between gap-6"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="flex-1 min-w-0">
        <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>
          Section
        </p>
        <h1 className="text-[26px] font-bold tracking-tight leading-tight mb-1.5" style={{ color: 'var(--text-1)' }}>
          {title}
        </h1>
        <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>{description}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <CircularProgress value={progress} size={64} stroke={7} label="" />
        <SectionStatusBadge status={status} />
      </div>
    </div>
  )
}
