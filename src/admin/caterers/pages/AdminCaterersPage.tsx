import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Users, MapPin, User, Calendar, AlertTriangle, MessageCircle,
  Download, Plus, Search, ChevronDown,
  ExternalLink, ClipboardCheck, FolderLock, FileText, Rocket,
  ShieldCheck, CheckCircle2, X, Check, ChevronLeft, ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { useLang } from '@shared/context/LangContext'
import { PageHeader } from '@shared/components/PageHeader'
import { SelectFilter } from '@shared/components/SelectFilter'
import { DropdownMenu } from '@shared/components/DropdownMenu'
import { FilterBar } from '@shared/components/FilterBar'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { CATERERS } from '../services/mock/caterersMock'
import type { Status, Vertical, Caterer } from '../services/mock/caterersMock'

/* ── Style maps ─────────────────────────────────────────── */
const STATUS_META: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  'pre-onboarding': { label: 'Pre-onboarding', color: 'var(--text-3)', bg: 'var(--bg-inner)',           border: 'var(--border-strong)'       },
  'en-cours':       { label: 'In Progress',    color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)',     border: 'rgba(96,165,250,0.28)'      },
  'soumis':         { label: 'Submitted',      color: '#a78bfa',       bg: 'rgba(167,139,250,0.12)',    border: 'rgba(167,139,250,0.28)'     },
  'corrections':    { label: 'Needs Review',   color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)',     border: 'rgba(251,191,36,0.28)'      },
  'approuves':      { label: 'Approved',       color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',     border: 'rgba(74,222,128,0.28)'      },
  'go-live':        { label: 'Ready · Go-live',color: '#a3e635',       bg: 'rgba(163,230,53,0.12)',     border: 'rgba(163,230,53,0.28)'      },
}

const VERTICAL_META: Record<Vertical, { color: string; bg: string }> = {
  Schools:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.14)'  },
  Daycares: { color: '#a78bfa', bg: 'rgba(167,139,250,0.14)' },
  Camps:    { color: '#fb923c', bg: 'rgba(251,146,60,0.14)'  },
  CSS:      { color: '#34d399', bg: 'rgba(52,211,153,0.14)'  },
}

function progressColor(s: Status): string {
  if (s === 'corrections')                      return '#fbbf24'
  if (s === 'approuves' || s === 'go-live')     return '#a3e635'
  if (s === 'soumis')                           return '#a78bfa'
  return '#3b82f6'
}

/* ── Status pill ────────────────────────────────────────── */
function StatusPill({ status }: { status: Status }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

/* ── Row action definitions ─────────────────────────────── */
const ROW_ACTIONS = [
  { label: 'Open Onboarding',          icon: <ExternalLink   size={13} strokeWidth={1.8} /> },
  { label: 'Open Validation Items',    icon: <ClipboardCheck size={13} strokeWidth={1.8} /> },
  { label: 'Open Document Vault',      icon: <FolderLock     size={13} strokeWidth={1.8} /> },
  { label: 'Open Contract Management', icon: <FileText       size={13} strokeWidth={1.8} /> },
  { label: 'Open EcoLoop Thread',      icon: <MessageCircle  size={13} strokeWidth={1.8} /> },
  { label: 'Open Go-Live Blockers',    icon: <Rocket         size={13} strokeWidth={1.8} /> },
  { label: 'Open Support Access',      icon: <ShieldCheck    size={13} strokeWidth={1.8} /> },
]

/* ── New caterer modal ──────────────────────────────────── */
const ALL_VERTICALS: Vertical[] = ['Schools', 'Daycares', 'Camps', 'CSS']

function FormField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>{label}</label>
      <input placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
    </div>
  )
}

function NewCatererModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Set<Vertical>>(new Set(['Schools']))
  function toggle(v: Vertical) {
    setSelected(prev => { const n = new Set(prev); n.has(v) ? n.delete(v) : n.add(v); return n })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-[520px] rounded-2xl p-7 flex flex-col gap-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-1" style={{ color: '#a3e635' }}>Onboarding Queue</p>
            <h2 className="text-[18px] font-bold mb-1" style={{ color: 'var(--text-1)' }}>New Caterer</h2>
            <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>Launch a new onboarding. All fields can be completed later via the workspace.</p>
          </div>
          <button onClick={onClose} className="mt-0.5 cursor-pointer p-1 rounded-lg transition-colors"
            style={{ color: 'var(--text-4)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <FormField label="Business name *" placeholder="e.g. Concept Gourmet" />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Legal name"    placeholder="e.g. Concept Gourmet Inc." />
          <FormField label="City"          placeholder="e.g. Montréal, QC" />
        </div>

        <div>
          <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>Served verticals</label>
          <div className="flex items-center gap-2 flex-wrap">
            {ALL_VERTICALS.map(v => {
              const on = selected.has(v)
              return (
                <button key={v} onClick={() => toggle(v)}
                  className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-all"
                  style={on ? { background: '#a3e635', color: '#07070a' } : { background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                  {v}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Assigned admin</label>
            <div className="relative">
              <select defaultValue="Elise Bouchard"
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-2)' }}>
                <option>Elise Bouchard</option>
                <option>Hugo Bernier</option>
                <option>Sandrine Lavoie</option>
              </select>
              <ChevronDown size={11} strokeWidth={2} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
            </div>
          </div>
          <FormField label="Primary contact" placeholder="Full name" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Role"  placeholder="Director" />
          <FormField label="Email" placeholder="contact@caterer.ca" />
        </div>

        <div className="flex items-center justify-between gap-4 pt-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            You will be redirected to the workspace after creation.
          </p>
          <div className="flex items-center gap-2.5 shrink-0">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
              Cancel
            </button>
            <button
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
              style={{ background: '#a3e635', color: '#07070a' }}>
              <Check size={13} strokeWidth={2.5} />Create caterer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Caterer detail modal ───────────────────────────────── */
const WORKSPACE_SECTIONS = [
  { label: 'Onboarding',          icon: <ExternalLink   size={15} strokeWidth={1.8} />, color: '#60a5fa' },
  { label: 'Validation Items',    icon: <ClipboardCheck size={15} strokeWidth={1.8} />, color: '#a78bfa' },
  { label: 'Document Vault',      icon: <FolderLock     size={15} strokeWidth={1.8} />, color: '#34d399' },
  { label: 'Contract Management', icon: <FileText       size={15} strokeWidth={1.8} />, color: '#fb923c' },
  { label: 'EcoLoop Thread',      icon: <MessageCircle  size={15} strokeWidth={1.8} />, color: '#60a5fa' },
  { label: 'Go-Live Blockers',    icon: <Rocket         size={15} strokeWidth={1.8} />, color: '#a3e635' },
  { label: 'Support Access',      icon: <ShieldCheck    size={15} strokeWidth={1.8} />, color: '#f87171' },
]

function CatererDetailModal({ caterer, onClose }: { caterer: Caterer; onClose: () => void }) {
  const sm = STATUS_META[caterer.status]
  const bar = caterer.status === 'corrections' ? '#fbbf24'
    : caterer.status === 'approuves' || caterer.status === 'go-live' ? '#a3e635'
    : caterer.status === 'soumis' ? '#a78bfa' : '#3b82f6'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          zIndex: 9998,
          background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)',
        }}
      />
      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: 'min(560px, calc(100vw - 32px))',
        borderRadius: '16px', overflow: 'hidden',
        background: 'var(--bg-card)', border: '1px solid var(--border-default)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>

        {/* Header */}
        <div className="px-7 pt-6 pb-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-1" style={{ color: '#a3e635' }}>Caterer Workspace</p>
              <h2 className="text-[20px] font-black" style={{ color: 'var(--text-1)' }}>{caterer.name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
                <span className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>{caterer.city}</span>
              </div>
            </div>
            <button onClick={onClose} className="cursor-pointer p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-4)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              <X size={15} strokeWidth={2} />
            </button>
          </div>

          {/* Status + progress */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.color }} />
              {sm.label}
            </span>
            <div className="flex items-center gap-2 flex-1" style={{ minWidth: '160px' }}>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                <div className="h-full rounded-full" style={{ width: `${caterer.progress}%`, background: bar }} />
              </div>
              <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: bar }}>{caterer.progress}%</span>
            </div>
          </div>

          {/* Verticals */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {caterer.verticals.map(v => {
              const vm = VERTICAL_META[v]
              return (
                <span key={v} className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-md"
                  style={{ background: vm.bg, color: vm.color }}>{v}</span>
              )
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 divide-x" style={{ borderBottom: '1px solid var(--border-subtle)', borderColor: 'var(--border-subtle)' }}>
          {[
            { label: 'Assigned Admin', value: caterer.admin,                    icon: <User         size={12} strokeWidth={1.8} /> },
            { label: 'Validations',    value: String(caterer.validations),       icon: <AlertTriangle size={12} strokeWidth={1.8} />, color: caterer.validations > 0 ? '#fbbf24' : undefined },
            { label: 'Tickets',        value: String(caterer.tickets),           icon: <MessageCircle size={12} strokeWidth={1.8} />, color: caterer.tickets > 0 ? '#60a5fa' : undefined },
          ].map(s => (
            <div key={s.label} className="px-5 py-3.5">
              <div className="flex items-center gap-1.5 mb-0.5" style={{ color: s.color ?? 'var(--text-4)' }}>
                {s.icon}
                <span className="text-[9.5px] uppercase tracking-[0.12em] font-semibold">{s.label}</span>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: s.color ?? 'var(--text-2)' }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Workspace sections */}
        <div className="px-7 py-5">
          <p className="text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-3" style={{ color: 'var(--text-4)' }}>Workspace sections</p>
          <div className="grid grid-cols-2 gap-2">
            {WORKSPACE_SECTIONS.map(s => (
              <button key={s.label}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left cursor-pointer transition-all group"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = s.color + '60' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}>
                <div className="flex items-center gap-2.5">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{s.label}</span>
                </div>
                <ArrowRight size={12} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

/* ── Page ───────────────────────────────────────────────── */
const PAGE_SIZE_OPTIONS = [5, 10, 20]

const TABLE_COLS = [
  { label: 'Caterer',        width: '170px' },
  { label: 'Location',       width: '130px' },
  { label: 'Verticals',      width: '190px' },
  { label: 'Progress',       width: '130px' },
  { label: 'Status',         width: '148px' },
  { label: 'Validations',    width: '100px' },
  { label: 'Tickets',        width: '80px'  },
  { label: 'Assigned Admin', width: '140px' },
  { label: 'Last Update',    width: '110px' },
  { label: 'Actions',        width: '56px'  },
]

export function CaterersInOnboarding() {
  const { t } = useLang()

  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [vertFilter,   setVertFilter]   = useState('')
  const [adminFilter,  setAdminFilter]  = useState('')
  const [applied,      setApplied]      = useState({ search: '', status: '', vert: '', admin: '' })
  const [page,         setPage]         = useState(1)
  const [pageSize,     setPageSize]     = useState(10)
  const [showModal,       setShowModal]       = useState(false)
  const [openMenuId,      setOpenMenuId]      = useState<string | null>(null)
  const [selectedCaterer, setSelectedCaterer] = useState<Caterer | null>(null)

  const filtered = CATERERS.filter(c => {
    if (applied.search && !c.name.toLowerCase().includes(applied.search.toLowerCase())) return false
    if (applied.status && c.status !== applied.status) return false
    if (applied.vert   && !(c.verticals as string[]).includes(applied.vert)) return false
    if (applied.admin  && c.admin !== applied.admin) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems  = filtered.slice((page - 1) * pageSize, page * pageSize)

  const stats = {
    total:   CATERERS.length,
    inProg:  CATERERS.filter(c => c.status === 'en-cours' || c.status === 'soumis').length,
    blocked: CATERERS.filter(c => c.status === 'corrections').length,
    goLive:  CATERERS.filter(c => c.status === 'approuves' || c.status === 'go-live').length,
  }

  function apply() { setApplied({ search, status: statusFilter, vert: vertFilter, admin: adminFilter }); setPage(1) }
  function reset()  { setSearch(''); setStatusFilter(''); setVertFilter(''); setAdminFilter(''); setApplied({ search:'', status:'', vert:'', admin:'' }); setPage(1) }

  const hasFilter = applied.search || applied.status || applied.vert || applied.admin
  const admins    = Array.from(new Set(CATERERS.map(c => c.admin)))

  return (
    <div className="p-4 lg:p-7 max-w-[1400px]">

      <PageHeader
        size="page"
        badge={{ icon: <Users size={12} strokeWidth={2.5} />, label: 'Onboarding Queue' }}
        title={t.traiteurs.subtitle}
        subtitle={t.traiteurs.description}
        right={
          <div className="flex items-center gap-2.5">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}
            >
              <Download size={13} strokeWidth={2} />{t.traiteurs.export}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
              style={{ background: '#a3e635', color: '#07070a' }}
            >
              <Plus size={14} strokeWidth={2.5} />{t.traiteurs.newCaterer}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-7">
        <StatCard value={stats.total}   label="Total Caterers"    valueColor="blue"   trend="all active"    icon={<Users         size={16} strokeWidth={1.8} />} />
        <StatCard value={stats.inProg}  label="In Progress"       valueColor="purple" trend="onboarding"    icon={<Calendar      size={16} strokeWidth={1.8} />} />
        <StatCard value={stats.blocked} label="Needs Review"      valueColor="red"    trend="action needed" icon={<AlertTriangle size={15} strokeWidth={1.8} />} />
        <StatCard value={stats.goLive}  label="Ready for Go-Live" valueColor="lime"   trend="approved"      icon={<CheckCircle2  size={16} strokeWidth={1.8} />} />
      </div>

      <FilterBar onApply={apply} onReset={reset} hasFilter={!!hasFilter}>
        <div className="relative">
          <Search size={12} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search caterer…"
            className="pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none w-[160px] sm:w-[180px]"
            style={{ background: 'var(--bg-inner)', border: `1px solid ${search ? '#a3e63550' : 'var(--border-strong)'}`, color: 'var(--text-2)' }}
          />
        </div>
        <SelectFilter
          label="All Statuses"
          value={statusFilter}
          onChange={setStatusFilter}
          options={Object.entries(STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))}
        />
        <SelectFilter
          label="All Verticals"
          value={vertFilter}
          onChange={setVertFilter}
          options={(['Schools','Daycares','Camps','CSS'] as Vertical[]).map(v => ({ value: v, label: v }))}
        />
        <SelectFilter
          label="All Admins"
          value={adminFilter}
          onChange={setAdminFilter}
          options={admins.map(a => ({ value: a, label: a }))}
        />
      </FilterBar>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '1120px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
                {TABLE_COLS.map(col => (
                  <th key={col.label} className="text-left px-4 py-3" style={{ width: col.width, minWidth: col.width }}>
                    <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                      {col.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={28} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>{t.traiteurs.notFound}</span>
                    </div>
                  </td>
                </tr>
              ) : pageItems.map((c, idx) => {
                const bar = progressColor(c.status)
                const isLast = idx === pageItems.length - 1
                return (
                  <tr key={c.id} className="transition-colors"
                    style={{ borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <span className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{c.name}</span>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                        <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{c.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1 flex-wrap">
                        {c.verticals.map(v => {
                          const vm = VERTICAL_META[v]
                          return (
                            <span key={v} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
                              style={{ background: vm.bg, color: vm.color }}>
                              {v}
                            </span>
                          )
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)', minWidth: '60px' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${c.progress}%`, background: bar }} />
                        </div>
                        <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: bar, width: '36px', textAlign: 'right' }}>
                          {c.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}><StatusPill status={c.status} /></td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5"
                        style={{ color: c.validations > 0 ? '#fbbf24' : 'var(--text-4)' }}>
                        {c.validations > 0 && <AlertTriangle size={12} strokeWidth={2} />}
                        <span className="text-[12.5px] font-semibold tabular-nums">{c.validations}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5"
                        style={{ color: c.tickets > 0 ? '#60a5fa' : 'var(--text-4)' }}>
                        {c.tickets > 0 && <MessageCircle size={12} strokeWidth={2} />}
                        <span className="text-[12.5px] font-semibold tabular-nums">{c.tickets}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5">
                        <User size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                        <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{c.admin}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                        <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>{c.updatedAt}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <DropdownMenu
                        open={openMenuId === c.id}
                        onToggle={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                        onClose={() => setOpenMenuId(null)}
                        actions={ROW_ACTIONS}
                        minWidth="220px"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-3.5 flex-wrap"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
            {filtered.length === 0
              ? '0 records'
              : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length} caterers`}
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              <ChevronLeft size={13} strokeWidth={2} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-[12.5px] font-semibold transition-all"
                style={n === page
                  ? { background: '#a3e635', color: '#07070a' }
                  : { background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              <ChevronRight size={13} strokeWidth={2} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Per page</span>
            <div className="relative">
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                className="appearance-none pl-3 pr-6 py-1.5 rounded-lg text-[12px] font-semibold outline-none cursor-pointer"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-2)' }}>
                {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown size={10} strokeWidth={2} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
            </div>
          </div>
        </div>
      </div>

      {showModal && <NewCatererModal onClose={() => setShowModal(false)} />}
      {selectedCaterer && createPortal(
        <CatererDetailModal caterer={selectedCaterer} onClose={() => setSelectedCaterer(null)} />,
        document.body
      )}
    </div>
  )
}
