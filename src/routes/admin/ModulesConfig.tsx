import { useState, type ReactNode } from 'react'
import {
  DollarSign, BookOpen, Truck, MessageCircle,
  Users, BarChart2, SlidersHorizontal, Power, Settings, Zap,
} from 'lucide-react'
import { StatusPill } from '../../shared/ui/StatusPill'
import { useLang } from '../../shared/context/LangContext'

/* ── Types ──────────────────────────────────────────────── */
type ModuleStatus = 'active' | 'inactive' | 'configured' | 'todo'
type GoLive       = 'high' | 'medium' | 'low'

interface Module {
  id: string
  name: string
  status: ModuleStatus
  optional?: boolean
  golive: GoLive
}

interface Category {
  id: string
  label: string
  icon: ReactNode
  modules: Module[]
}

/* ── Data ───────────────────────────────────────────────── */
const CATEGORIES: Category[] = [
  {
    id: 'finance', label: 'Finance', icon: <DollarSign size={16} strokeWidth={1.8} />,
    modules: [
      { id: 'paysafe',      name: 'Paysafe',                    status: 'active',     golive: 'high'   },
      { id: 'sezzle',       name: 'Sezzle — Paiement échelonné',status: 'inactive',   optional: true,  golive: 'low'    },
      { id: 'payout',       name: 'Payout rules',               status: 'configured', golive: 'high'   },
      { id: 'cutoff',       name: 'Cutoff rules',               status: 'todo',       golive: 'medium' },
      { id: 'ledger',       name: 'Ledger',                     status: 'active',     golive: 'high'   },
      { id: 'credit',       name: 'Credit rules',               status: 'todo',       optional: true,  golive: 'medium' },
    ],
  },
  {
    id: 'accounting', label: 'Accounting', icon: <BookOpen size={16} strokeWidth={1.8} />,
    modules: [
      { id: 'acomba',       name: 'Acomba',              status: 'active',     optional: true,  golive: 'low'    },
      { id: 'quickbooks',   name: 'QuickBooks',           status: 'inactive',   optional: true,  golive: 'low'    },
      { id: 'acc-exports',  name: 'Accounting exports',   status: 'configured', golive: 'medium' },
      { id: 'taxes',        name: 'Taxes',                status: 'configured', golive: 'high'   },
      { id: 'acc-codes',    name: 'Accounting codes',     status: 'todo',       golive: 'medium' },
    ],
  },
  {
    id: 'operations', label: 'Operations', icon: <Truck size={16} strokeWidth={1.8} />,
    modules: [
      { id: 'school-orders',  name: 'School orders',       status: 'active',     golive: 'high'   },
      { id: 'daycare-orders', name: 'Daycare / CPE orders', status: 'active',    optional: true,  golive: 'medium' },
      { id: 'camp-orders',    name: 'Camp orders',          status: 'inactive',  optional: true,  golive: 'low'    },
      { id: 'production',     name: 'Production',           status: 'configured', golive: 'high'  },
      { id: 'labels',         name: 'Labels',               status: 'configured', golive: 'medium' },
      { id: 'menus',          name: 'Menus',                status: 'active',     golive: 'high'   },
      { id: 'packages',       name: 'Packages',             status: 'active',     golive: 'high'   },
      { id: 'calendars',      name: 'Calendars',            status: 'todo',       golive: 'high'   },
    ],
  },
  {
    id: 'communication', label: 'Communication', icon: <MessageCircle size={16} strokeWidth={1.8} />,
    modules: [
      { id: 'ecoloop',       name: 'EcoLoop',             status: 'active',     golive: 'medium' },
      { id: 'notifications', name: 'Notifications',       status: 'configured', golive: 'medium' },
      { id: 'corrections',   name: 'Correction requests', status: 'active',     golive: 'low'    },
      { id: 'client-msg',    name: 'Client messages',     status: 'todo',       optional: true,  golive: 'low' },
    ],
  },
  {
    id: 'parents', label: 'Parents', icon: <Users size={16} strokeWidth={1.8} />,
    modules: [
      { id: 'coparenting',  name: 'Co-parenting',        status: 'inactive',   optional: true, golive: 'low'  },
      { id: 'parent-acc',   name: 'Parent accounts',     status: 'active',     golive: 'high'  },
      { id: 'child-prof',   name: 'Child profiles',      status: 'active',     golive: 'high'  },
      { id: 'family-hist',  name: 'Family history',      status: 'todo',       optional: true, golive: 'low'  },
      { id: 'eco-balance',  name: 'Credits / ECO balance',status: 'inactive',  optional: true, golive: 'low'  },
    ],
  },
  {
    id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} strokeWidth={1.8} />,
    modules: [
      { id: 'reportiq',      name: 'ReportIQ',       status: 'configured', golive: 'low' },
      { id: 'statistics',    name: 'Statistics',     status: 'active',     golive: 'low' },
      { id: 'custom-reports',name: 'Custom reports', status: 'todo',       optional: true, golive: 'low' },
      { id: 'exports',       name: 'Exports',        status: 'active',     golive: 'low' },
    ],
  },
]

/* ── Status badge ───────────────────────────────────────── */
function ModuleStatusPill({ status }: { status: ModuleStatus }) {
  const { t } = useLang()
  const map: Record<ModuleStatus, { label: string; bg: string; color: string; border: string }> = {
    active:     { label: t.modules.statuses.enabled,    bg: 'rgba(74,222,128,0.12)',  color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
    inactive:   { label: t.modules.statuses.disabled,   bg: 'var(--bg-inner)',        color: 'var(--text-3)', border: 'var(--border-strong)' },
    configured: { label: t.modules.statuses.configured, bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa', border: 'rgba(96,165,250,0.22)' },
    todo:       { label: t.modules.statuses.todo,       bg: 'var(--bg-inner)',        color: 'var(--text-3)', border: 'var(--border-strong)' },
  }
  const s = map[status]
  return (
    <StatusPill label={s.label} bg={s.bg} color={s.color} border={s.border} size="sm" />
  )
}

/* ── Go-live tag ────────────────────────────────────────── */
const GOLIVE_COLOR: Record<GoLive, string> = {
  high:   '#f87171',
  medium: '#f59e0b',
  low:    'var(--text-4)',
}

function GoLiveTag({ level }: { level: GoLive }) {
  const { t } = useLang()
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
      style={{ background: 'var(--bg-base)', color: GOLIVE_COLOR[level] }}>
      {t.modules.goLiveLabel} {level}
    </span>
  )
}

/* ── Module card ────────────────────────────────────────── */
function ModuleCard({ mod }: { mod: Module }) {
  const { t } = useLang()
  const [status, setStatus] = useState<ModuleStatus>(mod.status)
  const isActive = status === 'active'

  function toggle() {
    setStatus(prev => prev === 'active' ? 'inactive' : 'active')
  }

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 card-float"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
    >
      {/* Name + status */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
          {mod.name}
        </span>
        <ModuleStatusPill status={status} />
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap min-h-[22px]">
        {mod.optional && (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
            {t.modules.optional}
          </span>
        )}
        <GoLiveTag level={mod.golive} />
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
          style={isActive
            ? { background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }
            : { background: 'var(--accent)', color: '#07070a' }
          }
        >
          {isActive
            ? <><Power size={12} strokeWidth={2} /> {t.modules.disable}</>
            : <><Zap  size={12} strokeWidth={2} /> {t.modules.enable}</>
          }
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer transition-opacity hover:opacity-70 shrink-0"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-4)' }}
        >
          <Settings size={13} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}

/* ── Category section ───────────────────────────────────── */
function CategorySection({ cat }: { cat: Category }) {
  const activeCount = cat.modules.filter(m => m.status === 'active').length

  return (
    <div
      className="rounded-2xl p-5 mb-4 card-float"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--accent)' }}>
          {cat.icon}
        </div>
        <div>
          <h2 className="text-[16px] font-bold leading-tight" style={{ color: 'var(--text-1)' }}>
            {cat.label}
          </h2>
          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            {cat.modules.length} module(s) · {activeCount} active(s)
          </p>
        </div>
      </div>

      {/* Modules grid */}
      <div className="grid grid-cols-3 gap-3">
        {cat.modules.map(mod => <ModuleCard key={mod.id} mod={mod} />)}
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export function ModulesConfig() {
  const { t } = useLang()
  return (
    <div className="p-7">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
            <SlidersHorizontal size={12} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--text-4)' }}>
            {t.modules.title}
          </span>
        </div>
        <h1 className="text-[34px] font-bold tracking-tight leading-tight mb-2" style={{ color: 'var(--text-1)' }}>
          {t.modules.subtitle}
        </h1>
        <p className="text-[13px] leading-relaxed max-w-3xl" style={{ color: 'var(--text-3)' }}>
          {t.modules.description}
        </p>
      </div>

      {/* Category sections */}
      {CATEGORIES.map(cat => <CategorySection key={cat.id} cat={cat} />)}
    </div>
  )
}
