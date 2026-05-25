import {
  Briefcase, CreditCard, MapPin, UtensilsCrossed,
  Layers, FolderLock, ClipboardCheck, Flag, ArrowRight,
  Zap, CheckCircle2, Clock,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { CircularProgress } from '../../shared/ui/CircularProgress'
import { StatusPill } from '../../shared/ui/StatusPill'
import { useLang } from '../../shared/context/LangContext'

/* ── Types ─────────────────────────────────────────────── */
type SectionStatus = 'en-cours' | 'a-faire' | 'complete'

interface OnboardingSection {
  id: string
  icon: ReactNode
  title: string
  progress: number
  status: SectionStatus
  accentColor: string
}

/* ── Status pill ────────────────────────────────────────── */
function SectionStatusPill({ status }: { status: SectionStatus }) {
  if (status === 'en-cours')
    return <StatusPill label="En cours" bg="rgba(96,165,250,0.12)" color="#60a5fa" border="rgba(96,165,250,0.22)" dot />
  if (status === 'complete')
    return <StatusPill label="Complété" bg="rgba(74,222,128,0.12)" color="#4ade80" border="rgba(74,222,128,0.22)" dot />
  return <StatusPill label="À faire" bg="var(--bg-inner)" color="var(--text-3)" border="var(--border-strong)" dot dotColor="var(--text-4)" />
}

/* ── Progress bar ───────────────────────────────────────── */
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
          Progression
        </span>
        <span className="text-[11px] font-bold" style={{ color: value > 0 ? color : 'var(--text-4)' }}>
          {value}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            background: value > 0
              ? `linear-gradient(90deg, ${color}, ${color}bb)`
              : 'var(--border-default)',
          }}
        />
      </div>
    </div>
  )
}

/* ── Section card ───────────────────────────────────────── */
function SectionCard({ section, continueLabel }: { section: OnboardingSection; continueLabel: string }) {
  const { accentColor } = section
  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-4 cursor-pointer group card-float overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = accentColor + '55'
        el.style.boxShadow = `0 0 22px ${accentColor}18`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border-default)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Hover orb */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)` }}
      />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${accentColor}88, transparent)` }}
      />

      {/* Icon + badge */}
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`,
            border: `1px solid ${accentColor}30`,
            color: accentColor,
          }}
        >
          {section.icon}
        </div>
        <SectionStatusPill status={section.status} />
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
        {section.title}
      </h3>

      {/* Progress bar */}
      <ProgressBar value={section.progress} color={accentColor} />

      {/* Footer */}
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button
          className="flex items-center gap-1.5 text-[13px] font-medium cursor-pointer transition-all"
          style={{ color: accentColor }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.gap = '8px' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.gap = '6px' }}
        >
          {continueLabel}
          <ArrowRight size={12} strokeWidth={2.5} />
        </button>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor, opacity: 0.4 }} />
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export function ClientDashboard() {
  const { t } = useLang()

  const SECTIONS: OnboardingSection[] = [
    { id: 'profil',         icon: <Briefcase       size={20} strokeWidth={1.6} />, title: t.clientDashboard.sectionNames.profil,         progress: 80, status: 'en-cours', accentColor: '#a3e635' },
    { id: 'banques',        icon: <CreditCard      size={20} strokeWidth={1.6} />, title: t.clientDashboard.sectionNames.banques,        progress: 20, status: 'a-faire',  accentColor: '#fbbf24' },
    { id: 'mes-clients',    icon: <MapPin          size={20} strokeWidth={1.6} />, title: t.clientDashboard.sectionNames.mesClients,     progress: 60, status: 'en-cours', accentColor: '#60a5fa' },
    { id: 'menus',          icon: <UtensilsCrossed size={20} strokeWidth={1.6} />, title: t.clientDashboard.sectionNames.menus,          progress: 15, status: 'a-faire',  accentColor: '#f97316' },
    { id: 'modules',        icon: <Layers          size={20} strokeWidth={1.6} />, title: t.clientDashboard.sectionNames.modules,        progress: 30, status: 'a-faire',  accentColor: '#a78bfa' },
    { id: 'document-vault', icon: <FolderLock      size={20} strokeWidth={1.6} />, title: t.clientDashboard.sectionNames.documentVault,  progress: 55, status: 'en-cours', accentColor: '#34d399' },
    { id: 'validation',     icon: <ClipboardCheck  size={20} strokeWidth={1.6} />, title: t.clientDashboard.sectionNames.validation,     progress: 0,  status: 'a-faire',  accentColor: '#60a5fa' },
    { id: 'go-live',        icon: <Flag            size={20} strokeWidth={1.6} />, title: t.clientDashboard.sectionNames.goLive,         progress: 0,  status: 'a-faire',  accentColor: '#f87171' },
  ]

  const GLOBAL_PROGRESS = Math.round(SECTIONS.reduce((s, c) => s + c.progress, 0) / SECTIONS.length)
  const COMPLETE_COUNT  = SECTIONS.filter(s => s.status === 'complete').length
  const IN_PROGRESS_COUNT = SECTIONS.filter(s => s.status === 'en-cours').length

  return (
    <div className="p-4 lg:p-7 max-w-[1400px]">

      {/* Hero card */}
      <div
        className="relative rounded-2xl p-5 lg:p-7 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(163,230,53,0.05) 0%, transparent 60%)',
          }}
        />
        {/* Right glow */}
        <div
          className="absolute top-0 right-0 w-64 h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 100% 50%, rgba(251,191,36,0.04) 0%, transparent 70%)' }}
        />

        <div className="relative flex-1 min-w-0">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-4"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
            <span className="text-[13px] font-bold" style={{ color: 'var(--accent)' }}>
              {t.clientDashboard.badge.replace('{n}', String(GLOBAL_PROGRESS))}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[36px] font-black leading-tight mb-3 tracking-tight">
            <span style={{ color: 'var(--text-1)' }}>{t.clientDashboard.welcome}&nbsp;</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Concept Gourmet
            </span>
          </h1>

          <p className="text-[13px] leading-relaxed max-w-xl mb-6" style={{ color: 'var(--text-3)' }}>
            {t.clientDashboard.description}
          </p>

          {/* Quick stats row */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.20)' }}
            >
              <CheckCircle2 size={13} strokeWidth={2.5} style={{ color: '#4ade80' }} />
              <span className="text-[13px] font-semibold" style={{ color: '#4ade80' }}>
                {COMPLETE_COUNT} {t.clientDashboard.completed}
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.20)' }}
            >
              <Clock size={13} strokeWidth={2.5} style={{ color: '#60a5fa' }} />
              <span className="text-[13px] font-semibold" style={{ color: '#60a5fa' }}>
                {IN_PROGRESS_COUNT} {t.clientDashboard.inProgress}
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.20)' }}
            >
              <Zap size={13} strokeWidth={2.5} style={{ color: '#a3e635' }} />
              <span className="text-[13px] font-semibold" style={{ color: '#a3e635' }}>
                {t.clientDashboard.smartImport}
              </span>
            </div>
          </div>
        </div>

        {/* Circular progress */}
        <div className="relative shrink-0">
          <CircularProgress value={GLOBAL_PROGRESS} size={130} stroke={10} label="GLOBAL" color="#fbbf24" />
        </div>
      </div>

      {/* Section heading */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: 'var(--text-4)' }}>
          {t.clientDashboard.sectionsTitle}
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>
          {SECTIONS.length} {t.clientDashboard.sections}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        {SECTIONS.map(s => <SectionCard key={s.id} section={s} continueLabel={t.clientDashboard.continue} />)}
      </div>
    </div>
  )
}
