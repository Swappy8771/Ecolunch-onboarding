import {
  LayoutGrid, Users, ExternalLink, MessageCircle, Clock,
  UserCheck, ClipboardCheck, FolderLock, SlidersHorizontal,
  FileText, Rocket, Activity, Upload, CheckCircle2, FilePenLine,
  AlertTriangle, XCircle, Settings, ArrowRight, History,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'


import { StatCard } from '../../features/dashboard/components/StatCard'
import { FeatureCard } from '../../features/dashboard/components/FeatureCard'
import { useLang } from '../../shared/context/LangContext'
import { PageHeader } from '../../shared/components/PageHeader'
import { SectionDivider } from '../../shared/components/SectionDivider'
import { BlockerCard } from '../../shared/components/BlockerCard'
import { ActivityFeedItem } from '../../shared/components/ActivityFeedItem'

type Priority = 'success' | 'info' | 'warning' | 'critical'
type Group    = 'today' | 'yesterday' | 'earlier'

interface UpdateItem {
  icon: ReactNode
  priority: Priority
  group: Group
  time: string
  caterer: string
  eventType: string
  detail: string
  action: string
  to: string
}

const PRIORITY_META: Record<Priority, { color: string; label: string }> = {
  success:  { color: '#a3e635', label: 'Success'  },
  info:     { color: '#60a5fa', label: 'Info'     },
  warning:  { color: '#fbbf24', label: 'Warning'  },
  critical: { color: '#f87171', label: 'Critical' },
}

const GROUP_LABELS: Record<Group, string> = {
  today:     'Today',
  yesterday: 'Yesterday',
  earlier:   'Earlier',
}

const ALL_UPDATES: UpdateItem[] = [
  {
    icon: <FilePenLine size={13} strokeWidth={2} />,
    priority: 'success', group: 'today', time: '10 min ago',
    caterer: 'Concept Gourmet', eventType: 'Contract Signed',
    detail: 'Master services agreement signed via Dropbox Sign',
    action: 'View Contract', to: '/admin/contract-management',
  },
  {
    icon: <Upload size={13} strokeWidth={2} />,
    priority: 'info', group: 'today', time: '25 min ago',
    caterer: 'MSN', eventType: 'Document Uploaded',
    detail: 'Liability insurance certificate — v2',
    action: 'Open Document', to: '/admin/document-vault',
  },
  {
    icon: <CheckCircle2 size={13} strokeWidth={2} />,
    priority: 'success', group: 'today', time: '1h ago',
    caterer: 'FL', eventType: 'Validation Approved',
    detail: 'Profile section approved',
    action: 'Open Validation', to: '/admin/validation-center',
  },
  {
    icon: <MessageCircle size={13} strokeWidth={2} />,
    priority: 'warning', group: 'today', time: '2h ago',
    caterer: 'Concept Gourmet', eventType: 'Correction Requested',
    detail: 'Menu section — 3 items flagged for review',
    action: 'View Feedback', to: '/admin/validation-center',
  },
  {
    icon: <FileText size={13} strokeWidth={2} />,
    priority: 'info', group: 'yesterday', time: 'Yesterday · 16:42',
    caterer: 'Brasserie Nord', eventType: 'Contract Sent',
    detail: 'Annex B sent to caterer for signature',
    action: 'View Contract', to: '/admin/contract-management',
  },
  {
    icon: <Settings size={13} strokeWidth={2} />,
    priority: 'success', group: 'yesterday', time: 'Yesterday · 11:05',
    caterer: 'FL', eventType: 'Pricing Updated',
    detail: 'SaaS tier updated to Growth plan',
    action: 'Open Section', to: '/admin/modules-pricing',
  },
  {
    icon: <Rocket size={13} strokeWidth={2} />,
    priority: 'success', group: 'yesterday', time: 'Yesterday · 09:30',
    caterer: 'Concept Gourmet', eventType: 'Go-live Approved',
    detail: 'All checklist items validated — launch scheduled',
    action: 'View Go-live', to: '/admin/golive-monitor',
  },
  {
    icon: <CheckCircle2 size={13} strokeWidth={2} />,
    priority: 'success', group: 'earlier', time: '2d ago',
    caterer: 'Café Réseau', eventType: 'Validation Approved',
    detail: 'Banks & banking section approved',
    action: 'Open Validation', to: '/admin/validation-center',
  },
  {
    icon: <Upload size={13} strokeWidth={2} />,
    priority: 'info', group: 'earlier', time: '2d ago',
    caterer: 'Brasserie Nord', eventType: 'Document Uploaded',
    detail: 'Health permit — 2026 renewal certificate',
    action: 'Open Document', to: '/admin/document-vault',
  },
  {
    icon: <SlidersHorizontal size={13} strokeWidth={2} />,
    priority: 'success', group: 'earlier', time: '3d ago',
    caterer: 'MSN', eventType: 'Module Configured',
    detail: 'EcoOrder and EcoPay modules activated',
    action: 'Open Section', to: '/admin/modules-pricing',
  },
]

const VISIBLE_UPDATES = ALL_UPDATES.slice(0, 5)

interface BlockerItem {
  icon: ReactNode
  severity: 'critical' | 'warning'
  caterer: string
  category: string
  issue: string
  action: string
  to: string
}

const URGENT_BLOCKERS: BlockerItem[] = [
  {
    icon: <AlertTriangle size={14} strokeWidth={2} />,
    severity: 'critical',
    caterer: 'Concept Gourmet',
    category: 'Missing Document',
    issue: 'Liability insurance certificate absent — Go-live blocked',
    action: 'Open Vault',
    to: '/admin/document-vault',
  },
  {
    icon: <FilePenLine size={14} strokeWidth={2} />,
    severity: 'warning',
    caterer: 'FL',
    category: 'Awaiting Signature',
    issue: 'Master contract unsigned — 5 days without response',
    action: 'View Contract',
    to: '/admin/contract-management',
  },
  {
    icon: <XCircle size={14} strokeWidth={2} />,
    severity: 'critical',
    caterer: 'MSN',
    category: 'Validation Failed',
    issue: 'Banking validation rejected — IBAN format invalid',
    action: 'Resolve',
    to: '/admin/validation-center',
  },
  {
    icon: <Settings size={14} strokeWidth={2} />,
    severity: 'warning',
    caterer: 'ABC Catering',
    category: 'Pricing Incomplete',
    issue: 'SaaS pricing tier not configured — modules cannot activate',
    action: 'Open Section',
    to: '/admin/modules-pricing',
  },
  {
    icon: <XCircle size={14} strokeWidth={2} />,
    severity: 'critical',
    caterer: 'Café Réseau',
    category: 'Validation Failed',
    issue: 'Profile section incomplete — 3 required fields missing',
    action: 'Resolve',
    to: '/admin/validation-center',
  },
]

export function Dashboard() {
  const { t } = useLang()
  const now = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  const STATS = [
    { label: t.dashboard.stats.traiteurs,    value: 3, icon: <Users size={15} strokeWidth={2} />,       valueColor: 'lime' as const, trend: t.dashboard.stats.thisWeek },
    { label: t.dashboard.stats.validations,  value: 5, icon: <ExternalLink size={15} strokeWidth={2} />, valueColor: 'lime' as const, trend: t.dashboard.stats.urgent },
    { label: t.dashboard.stats.tickets,      value: 3, icon: <MessageCircle size={15} strokeWidth={2} />,valueColor: 'blue' as const, trend: t.dashboard.stats.new },
    { label: t.dashboard.stats.goLiveBlocked,value: 2, icon: <Clock size={15} strokeWidth={2} />,        valueColor: 'red'  as const, trend: t.dashboard.stats.actionRequired },
  ]

  const FEATURE_CARDS = [
    {
      icon: <UserCheck size={20} strokeWidth={1.8} />,
      title: t.dashboard.cards.onboarding,
      description: t.dashboard.cards.onboardingDesc,
      accentColor: '#a3e635',
      to: '/admin/caterers',
    },
    {
      icon: <ClipboardCheck size={20} strokeWidth={1.8} />,
      title: t.dashboard.cards.validation,
      description: t.dashboard.cards.validationDesc,
      accentColor: '#60a5fa',
      to: '/admin/validation-center',
    },
    {
      icon: <FolderLock size={20} strokeWidth={1.8} />,
      title: t.dashboard.cards.vault,
      description: t.dashboard.cards.vaultDesc,
      accentColor: '#fbbf24',
      to: '/admin/document-vault',
    },
    {
      icon: <FileText size={20} strokeWidth={1.8} />,
      title: t.dashboard.cards.contractManagement,
      description: t.dashboard.cards.contractManagementDesc,
      accentColor: '#a78bfa',
      to: '/admin/contract-management',
    },
    {
      icon: <SlidersHorizontal size={20} strokeWidth={1.8} />,
      title: t.dashboard.cards.modulesPricing,
      description: t.dashboard.cards.modulesPricingDesc,
      accentColor: '#34d399',
      to: '/admin/modules-pricing',
    },
    {
      icon: <Rocket size={20} strokeWidth={1.8} />,
      title: t.dashboard.cards.goLiveMonitor,
      description: t.dashboard.cards.goLiveMonitorDesc,
      accentColor: '#fb923c',
      to: '/admin/golive-monitor',
    },
    {
      icon: <MessageCircle size={20} strokeWidth={1.8} />,
      title: t.dashboard.cards.ecoloop,
      description: t.dashboard.cards.ecoloopDesc,
      accentColor: '#f87171',
      to: '/admin/ecoloop',
    },
  ]

  return (
    <div className="p-4 lg:p-7 max-w-[1400px]">

      <PageHeader
        badge={{ icon: <LayoutGrid size={13} strokeWidth={2.5} />, label: 'EcoLunch Admin' }}
        title={t.dashboard.title}
        subtitle={t.dashboard.subtitle}
        right={
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
          >
            <Activity size={13} strokeWidth={2} style={{ color: '#a3e635' }} />
            <span className="text-[13px] font-medium capitalize" style={{ color: 'var(--text-3)' }}>{now}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
          </div>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <SectionDivider label={t.dashboard.quickAccess} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {FEATURE_CARDS.map(c => <FeatureCard key={c.title} {...c} />)}
      </div>

      {/* Recent Updates — full-width activity feed */}
      <div className="mt-8">
        <SectionDivider
          label={t.dashboard.recentUpdates}
          rightLabel={t.dashboard.viewAll}
          className="mb-4"
        />

        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
        >
          {(() => {
            const rows: ReactNode[] = []
            let lastGroup: Group | null = null

            VISIBLE_UPDATES.forEach((item, i) => {
              const p = PRIORITY_META[item.priority]

              // Group divider
              if (item.group !== lastGroup) {
                lastGroup = item.group
                rows.push(
                  <div
                    key={`g-${item.group}`}
                    className="flex items-center gap-3 px-5 py-2"
                    style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-4)' }}>
                      {GROUP_LABELS[item.group]}
                    </span>
                  </div>
                )
              }

              rows.push(
                <ActivityFeedItem
                  key={i}
                  icon={item.icon}
                  color={p.color}
                  priorityLabel={p.label}
                  caterer={item.caterer}
                  eventType={item.eventType}
                  detail={item.detail}
                  time={item.time}
                  action={item.action}
                  to={item.to}
                  isLast={i === VISIBLE_UPDATES.length - 1}
                />
              )
            })

            return rows
          })()}

          {/* View All Activity footer */}
          <Link
            to="/admin/caterers"
            className="flex items-center justify-center gap-2 py-3 transition-colors"
            style={{
              textDecoration: 'none',
              borderTop: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-3)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <History size={13} strokeWidth={2} />
            <span className="text-[12.5px] font-semibold">View All Activity</span>
            <ArrowRight size={11} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Urgent Blockers */}
      <div className="mt-6">
        <SectionDivider
          label={t.dashboard.urgentBlockers}
          icon={<AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />}
          meta={
            <>
              <span
                className="text-[11px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}
              >
                {URGENT_BLOCKERS.filter(b => b.severity === 'critical').length} critical
              </span>
              <span
                className="text-[11px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
              >
                {URGENT_BLOCKERS.filter(b => b.severity === 'warning').length} warning
              </span>
            </>
          }
          rightLabel={t.dashboard.viewAll}
          className="mb-4"
        />

        {URGENT_BLOCKERS.length === 0 ? (
          <p className="text-[13px] px-1" style={{ color: 'var(--text-4)' }}>{t.dashboard.noBlockers}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {URGENT_BLOCKERS.map((item, i) => (
              <BlockerCard
                key={i}
                icon={item.icon}
                severity={item.severity}
                caterer={item.caterer}
                category={item.category}
                issue={item.issue}
                action={item.action}
                to={item.to}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
