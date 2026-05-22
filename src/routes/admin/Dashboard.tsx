import {
  LayoutGrid, Users, ExternalLink, MessageCircle, Clock,
  UserCheck, ClipboardCheck, FolderInput, FolderLock, SlidersHorizontal,
} from 'lucide-react'
import { StatCard } from '../../features/dashboard/components/StatCard'
import { FeatureCard } from '../../features/dashboard/components/FeatureCard'
import { PageBadge } from '../../shared/ui/PageBadge'

const STATS = [
  { label: 'Traiteurs en onboarding', value: 3, icon: <Users size={16} strokeWidth={1.6} />, valueColor: 'lime' as const },
  { label: 'Validations ouvertes',    value: 5, icon: <ExternalLink size={16} strokeWidth={1.6} />, valueColor: 'lime' as const },
  { label: 'Tickets EcoLoop',         value: 3, icon: <MessageCircle size={16} strokeWidth={1.6} />, valueColor: 'blue' as const },
  { label: 'Go-live bloqués',         value: 2, icon: <Clock size={16} strokeWidth={1.6} />, valueColor: 'red'  as const },
]

const FEATURE_CARDS = [
  { icon: <UserCheck size={20} strokeWidth={1.6} />,       title: 'Onboarding · Traiteurs',    description: "3 traiteurs en cours d'embarquement" },
  { icon: <ClipboardCheck size={20} strokeWidth={1.6} />,  title: 'Centre de validation',       description: '5 éléments en attente de revue' },
  { icon: <FolderInput size={20} strokeWidth={1.6} />,     title: "Centre d'Import",            description: "13 types d'import disponibles" },
  { icon: <FolderLock size={20} strokeWidth={1.6} />,      title: 'Document Vault',             description: 'Coffre-fort centralisé multi-traiteurs' },
  { icon: <MessageCircle size={20} strokeWidth={1.6} />,   title: 'EcoLoop',                    description: '3 ticket(s) ouvert(s) — 2 bloquants' },
  { icon: <SlidersHorizontal size={20} strokeWidth={1.6} />, title: 'Modules / Configurations', description: '6 catégories : Finance, Accounting, Operations…' },
]

export function Dashboard() {
  return (
    <div className="p-7">
      <div className="mb-8">
        <PageBadge icon={<LayoutGrid size={13} strokeWidth={2.5} />} label="EcoLunch Admin" />
        <h1 className="text-[38px] font-bold tracking-tight leading-tight mb-3" style={{ color: 'var(--text-1)' }}>
          Dashboard
        </h1>
        <p className="text-[13px] leading-relaxed max-w-2xl" style={{ color: 'var(--text-3)' }}>
          Vue d'ensemble du moteur d'onboarding EcoLunch / PRS — traiteurs, validations,
          tickets et configurations.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-4">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        {FEATURE_CARDS.slice(0, 3).map(c => <FeatureCard key={c.title} {...c} />)}
      </div>
      <div className="grid grid-cols-3 gap-3.5">
        {FEATURE_CARDS.slice(3).map(c => <FeatureCard key={c.title} {...c} />)}
      </div>
    </div>
  )
}
