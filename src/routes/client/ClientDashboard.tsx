import {
  Briefcase, CreditCard, MapPin, UtensilsCrossed,
  Layers, FolderLock, ClipboardCheck, Flag, ArrowRight,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { CircularProgress } from '../../shared/ui/CircularProgress'
import { StatusPill } from '../../shared/ui/StatusPill'

/* ── Types ─────────────────────────────────────────────── */
type SectionStatus = 'en-cours' | 'a-faire' | 'complete'

interface OnboardingSection {
  id: string
  icon: ReactNode
  title: string
  progress: number
  status: SectionStatus
}

/* ── Data ───────────────────────────────────────────────── */
const SECTIONS: OnboardingSection[] = [
  { id: 'profil',          icon: <Briefcase      size={20} strokeWidth={1.6} />, title: 'Profil',                       progress: 80, status: 'en-cours' },
  { id: 'banques',         icon: <CreditCard     size={20} strokeWidth={1.6} />, title: 'Banques & informations bancaires', progress: 20, status: 'a-faire' },
  { id: 'mes-clients',     icon: <MapPin         size={20} strokeWidth={1.6} />, title: 'Mes clients',                  progress: 60, status: 'en-cours' },
  { id: 'menus',           icon: <UtensilsCrossed size={20} strokeWidth={1.6} />, title: 'Menus & Forfaits',            progress: 15, status: 'a-faire' },
  { id: 'modules',         icon: <Layers         size={20} strokeWidth={1.6} />, title: 'Modules',                     progress: 30, status: 'a-faire' },
  { id: 'document-vault',  icon: <FolderLock     size={20} strokeWidth={1.6} />, title: 'Document Vault',              progress: 55, status: 'en-cours' },
  { id: 'validation',      icon: <ClipboardCheck size={20} strokeWidth={1.6} />, title: 'Validation',                  progress: 0,  status: 'a-faire' },
  { id: 'go-live',         icon: <Flag           size={20} strokeWidth={1.6} />, title: 'Go-live',                     progress: 0,  status: 'a-faire' },
]

const GLOBAL_PROGRESS = Math.round(
  SECTIONS.reduce((s, c) => s + c.progress, 0) / SECTIONS.length
)

/* ── Status pill ────────────────────────────────────────── */
function SectionStatusPill({ status }: { status: SectionStatus }) {
  if (status === 'en-cours')
    return <StatusPill label="En cours" bg="rgba(96,165,250,0.12)" color="#60a5fa" border="rgba(96,165,250,0.22)" dot />

  if (status === 'complete')
    return <StatusPill label="Complété" bg="rgba(74,222,128,0.12)" color="#4ade80" border="rgba(74,222,128,0.22)" dot />

  return <StatusPill label="À faire" bg="var(--bg-inner)" color="var(--text-3)" border="var(--border-strong)" dot dotColor="var(--text-4)" />
}

/* ── Progress bar ───────────────────────────────────────── */
function ProgressBar({ value, status }: { value: number; status: SectionStatus }) {
  const filled = status === 'en-cours' ? '#3b82f6' : 'var(--border-strong)'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9.5px] uppercase tracking-[0.12em] font-semibold" style={{ color: 'var(--text-4)' }}>
          Progression
        </span>
        <span className="text-[11px] font-semibold" style={{ color: value > 0 ? 'var(--text-2)' : 'var(--text-4)' }}>
          {value}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: filled }}
        />
      </div>
    </div>
  )
}

/* ── Section card ───────────────────────────────────────── */
function SectionCard({ section }: { section: OnboardingSection }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-colors cursor-pointer card-float"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
    >
      {/* Icon + badge */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-3)' }}>
          {section.icon}
        </div>
        <SectionStatusPill status={section.status} />
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
        {section.title}
      </h3>

      {/* Progress */}
      <ProgressBar value={section.progress} status={section.status} />

      {/* Link */}
      <button
        className="flex items-center gap-1.5 text-[12.5px] cursor-pointer transition-colors w-fit"
        style={{ color: 'var(--text-3)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-2)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
      >
        Continuer <ArrowRight size={12} strokeWidth={2} />
      </button>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export function ClientDashboard() {
  return (
    <div className="p-7">
      {/* Welcome hero card */}
      <div
        className="rounded-2xl p-7 mb-6 flex items-center justify-between gap-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <div className="flex-1 min-w-0">
          {/* Progress badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(163,230,53,0.10)', border: '1px solid rgba(163,230,53,0.22)' }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
            <span className="text-[11.5px] font-semibold" style={{ color: 'var(--accent)' }}>
              Onboarding · {GLOBAL_PROGRESS}% complétée
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[34px] font-bold leading-tight mb-3 tracking-tight">
            <span style={{ color: 'var(--text-1)' }}>Bienvenue,&nbsp;</span>
            <span style={{ color: 'var(--accent)' }}>Concept Gourmet</span>
          </h1>

          {/* Description */}
          <p className="text-[13px] leading-relaxed max-w-xl" style={{ color: 'var(--text-3)' }}>
            Complétez les sections ci-dessous pour activer votre compte sur la plateforme
            PRS EcoLunch. Le moteur Smart Import peut préremplir jusqu'à 70% de vos informations.
          </p>
        </div>

        {/* Circular progress */}
        <CircularProgress value={GLOBAL_PROGRESS} size={118} stroke={10} label="GLOBAL" />
      </div>

      {/* Section cards grid */}
      <div className="grid grid-cols-3 gap-3.5">
        {SECTIONS.map(s => <SectionCard key={s.id} section={s} />)}
      </div>
    </div>
  )
}
