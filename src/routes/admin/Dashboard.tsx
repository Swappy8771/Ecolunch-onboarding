import {
  LayoutGrid, Users, ExternalLink, MessageCircle, Clock,
  UserCheck, ClipboardCheck, FolderInput, FolderLock, SlidersHorizontal,
  Activity,
} from 'lucide-react'
import { StatCard } from '../../features/dashboard/components/StatCard'
import { FeatureCard } from '../../features/dashboard/components/FeatureCard'
import { PageBadge } from '../../shared/ui/PageBadge'

const STATS = [
  { label: 'Traiteurs en onboarding', value: 3, icon: <Users size={15} strokeWidth={2} />, valueColor: 'lime' as const, trend: '+1 cette semaine' },
  { label: 'Validations ouvertes',    value: 5, icon: <ExternalLink size={15} strokeWidth={2} />, valueColor: 'lime' as const, trend: '2 urgentes' },
  { label: 'Tickets EcoLoop',         value: 3, icon: <MessageCircle size={15} strokeWidth={2} />, valueColor: 'blue' as const, trend: '1 nouveau' },
  { label: 'Go-live bloqués',         value: 2, icon: <Clock size={15} strokeWidth={2} />, valueColor: 'red' as const,  trend: 'Action requise' },
]

const FEATURE_CARDS = [
  {
    icon: <UserCheck size={20} strokeWidth={1.8} />,
    title: 'Onboarding · Traiteurs',
    description: "3 traiteurs en cours d'embarquement",
    accentColor: '#a3e635',
    to: '/admin/traiteurs',
  },
  {
    icon: <ClipboardCheck size={20} strokeWidth={1.8} />,
    title: 'Centre de validation',
    description: '5 éléments en attente de revue',
    accentColor: '#60a5fa',
    to: '/admin/centre-validation',
  },
  {
    icon: <FolderInput size={20} strokeWidth={1.8} />,
    title: "Centre d'Import",
    description: "13 types d'import disponibles",
    accentColor: '#a78bfa',
    to: '/admin/centre-import',
  },
  {
    icon: <FolderLock size={20} strokeWidth={1.8} />,
    title: 'Document Vault',
    description: 'Coffre-fort centralisé multi-traiteurs',
    accentColor: '#fbbf24',
    to: '/admin/document-vault',
  },
  {
    icon: <MessageCircle size={20} strokeWidth={1.8} />,
    title: 'EcoLoop',
    description: '3 ticket(s) ouvert(s) — 2 bloquants',
    accentColor: '#f87171',
    to: '/admin/ecoloop',
  },
  {
    icon: <SlidersHorizontal size={20} strokeWidth={1.8} />,
    title: 'Modules / Configurations',
    description: '6 catégories : Finance, Accounting, Operations…',
    accentColor: '#34d399',
    to: '/admin/modules',
  },
]

export function Dashboard() {
  const now = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-7 max-w-[1400px]">

      {/* Header */}
      <div className="mb-8 relative">
        {/* Background glow */}
        <div
          className="absolute -top-4 -left-4 w-64 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(163,230,53,0.06) 0%, transparent 70%)' }}
        />

        <PageBadge icon={<LayoutGrid size={13} strokeWidth={2.5} />} label="EcoLunch Admin" />

        <div className="flex items-end justify-between mt-2">
          <div>
            <h1
              className="text-[40px] font-black tracking-tight leading-tight"
              style={{
                background: 'linear-gradient(135deg, var(--text-1) 50%, var(--text-3) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Dashboard
            </h1>
            <p className="text-[13px] leading-relaxed mt-1 max-w-xl" style={{ color: 'var(--text-3)' }}>
              Vue d'ensemble du moteur d'onboarding EcoLunch / PRS — traiteurs, validations, tickets et configurations.
            </p>
          </div>

          {/* Live indicator */}
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl shrink-0 mb-1"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
          >
            <Activity size={13} strokeWidth={2} style={{ color: '#a3e635' }} />
            <span className="text-[13px] font-medium capitalize" style={{ color: 'var(--text-3)' }}>{now}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[13px] uppercase tracking-[0.15em] font-bold" style={{ color: 'var(--text-4)' }}>
          Accès rapide
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-4">
        {FEATURE_CARDS.map(c => <FeatureCard key={c.title} {...c} />)}
      </div>
    </div>
  )
}
