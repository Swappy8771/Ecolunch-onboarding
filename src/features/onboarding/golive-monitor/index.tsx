import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Rocket, CheckCircle2, XCircle, AlertTriangle, Search,
  ChevronRight, Send, MessageCircle, History, ShieldCheck,
  Power, X, Users, FolderLock, FileText, SlidersHorizontal,
  UtensilsCrossed, Building2, ClipboardCheck, Zap,
} from 'lucide-react'
import { PageHeader } from '../../../shared/components/PageHeader'
import { SelectFilter } from '../../../shared/components/SelectFilter'

/* ── Types ──────────────────────────────────────────────────────── */
type CheckStatus = 'done' | 'missing' | 'partial'
type CatStatus   = 'ready' | 'blocked' | 'in-progress' | 'activated'

interface CheckItem {
  key: string
  label: string
  icon: ReactNode
  status: CheckStatus
  detail: string
}

interface Caterer {
  id: string
  name: string
  city: string
  status: CatStatus
  progress: number
  items: CheckItem[]
  admin: string
  targetDate: string
}

/* ── Check item templates ───────────────────────────────────────── */
function makeItems(overrides: Partial<CheckItem>[]): CheckItem[] {
  const base: Omit<CheckItem, 'status' | 'detail'>[] = [
    { key: 'account',       label: 'Account created',                    icon: <Users           size={13} strokeWidth={1.8} /> },
    { key: 'profile',       label: 'Profile validated',                  icon: <ShieldCheck     size={13} strokeWidth={1.8} /> },
    { key: 'banking',       label: 'Banking information validated',       icon: <FileText        size={13} strokeWidth={1.8} /> },
    { key: 'establishments',label: 'Establishments confirmed',            icon: <Building2       size={13} strokeWidth={1.8} /> },
    { key: 'menus',         label: 'Menus / Packages validated',          icon: <UtensilsCrossed size={13} strokeWidth={1.8} /> },
    { key: 'documents',     label: 'Required documents approved',         icon: <FolderLock      size={13} strokeWidth={1.8} /> },
    { key: 'contracts',     label: 'Required contracts signed',           icon: <FileText        size={13} strokeWidth={1.8} /> },
    { key: 'modules',       label: 'Modules configured',                  icon: <SlidersHorizontal size={13} strokeWidth={1.8} /> },
    { key: 'pricing',       label: 'Pricing configured',                  icon: <Zap             size={13} strokeWidth={1.8} /> },
    { key: 'corrections',   label: 'Corrections closed',                  icon: <ClipboardCheck  size={13} strokeWidth={1.8} /> },
    { key: 'ecoloop',       label: 'EcoLoop blockers closed',             icon: <MessageCircle   size={13} strokeWidth={1.8} /> },
  ]
  return base.map((b, i) => ({ ...b, status: 'done', detail: 'Completed', ...overrides[i] }))
}

/* ── Mock data ──────────────────────────────────────────────────── */
const INITIAL_CATERERS: Caterer[] = [
  {
    id: '1', name: 'Brasserie Nord', city: 'Laval, QC', status: 'activated', progress: 100, admin: 'Hugo Bernier', targetDate: '2026-07-01',
    items: makeItems(Array(11).fill({ status: 'done' as CheckStatus, detail: 'Completed' })),
  },
  {
    id: '2', name: 'NutriServ', city: 'Longueuil, QC', status: 'ready', progress: 100, admin: 'Elise Bouchard', targetDate: '2026-09-01',
    items: makeItems(Array(11).fill({ status: 'done' as CheckStatus, detail: 'Completed' })),
  },
  {
    id: '3', name: 'Concept Gourmet', city: 'Montréal, QC', status: 'in-progress', progress: 82, admin: 'Elise Bouchard', targetDate: '2026-09-01',
    items: makeItems([
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'partial', detail: '1 of 2 contracts signed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'partial', detail: '1 correction still open' },
      { status: 'missing', detail: '1 EcoLoop blocker open' },
    ]),
  },
  {
    id: '4', name: 'ABC Catering', city: 'Québec, QC', status: 'in-progress', progress: 73, admin: 'Sandrine Lavoie', targetDate: '2026-10-01',
    items: makeItems([
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'partial', detail: 'Awaiting banking confirmation letter' },
      { status: 'done',    detail: 'Completed' },
      { status: 'partial', detail: 'Daycare menu week 3–4 pending review' },
      { status: 'done',    detail: 'Completed' },
      { status: 'missing', detail: 'MSA not yet sent' },
      { status: 'done',    detail: 'Completed' },
      { status: 'missing', detail: 'Pricing not configured' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
    ]),
  },
  {
    id: '5', name: 'Café Réseau', city: 'Sherbrooke, QC', status: 'in-progress', progress: 64, admin: 'Hugo Bernier', targetDate: '2026-10-01',
    items: makeItems([
      { status: 'done',    detail: 'Completed' },
      { status: 'partial', detail: 'Profile correction requested' },
      { status: 'done',    detail: 'Completed' },
      { status: 'missing', detail: '3 establishments not confirmed' },
      { status: 'missing', detail: 'Menus not submitted' },
      { status: 'partial', detail: '2 documents missing — insurance & MAPAQ' },
      { status: 'missing', detail: 'No contracts sent' },
      { status: 'partial', detail: 'School Meals only configured' },
      { status: 'missing', detail: 'Pricing not configured' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
    ]),
  },
  {
    id: '6', name: 'FL', city: 'Lévis, QC', status: 'blocked', progress: 38, admin: 'Hugo Bernier', targetDate: '2026-11-01',
    items: makeItems([
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'missing', detail: 'IBAN format invalid — rejected' },
      { status: 'missing', detail: 'Schools not confirmed' },
      { status: 'missing', detail: 'Menus not submitted' },
      { status: 'missing', detail: '5 required documents missing' },
      { status: 'missing', detail: 'Contracts not sent' },
      { status: 'missing', detail: 'Modules not configured' },
      { status: 'missing', detail: 'Pricing not configured' },
      { status: 'missing', detail: '4 open corrections' },
      { status: 'missing', detail: '3 EcoLoop blockers open' },
    ]),
  },
  {
    id: '7', name: 'Les Saveurs', city: 'Gatineau, QC', status: 'blocked', progress: 45, admin: 'Sandrine Lavoie', targetDate: '2026-11-01',
    items: makeItems([
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'partial', detail: '2 establishments pending confirmation' },
      { status: 'missing', detail: 'Camp menus not submitted' },
      { status: 'partial', detail: '1 document in correction' },
      { status: 'missing', detail: 'Module annex not signed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'partial', detail: 'Camp Meals pricing missing' },
      { status: 'missing', detail: '5 open corrections — critical' },
      { status: 'done',    detail: 'Completed' },
    ]),
  },
  {
    id: '8', name: 'MSN', city: 'Saguenay, QC', status: 'in-progress', progress: 55, admin: 'Elise Bouchard', targetDate: '2026-12-01',
    items: makeItems([
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
      { status: 'partial', detail: 'Cycle B menus pending approval' },
      { status: 'partial', detail: '1 document pending review' },
      { status: 'done',    detail: 'Completed' },
      { status: 'missing', detail: 'ReportIQ not configured' },
      { status: 'missing', detail: 'ReportIQ pricing missing' },
      { status: 'done',    detail: 'Completed' },
      { status: 'done',    detail: 'Completed' },
    ]),
  },
]

/* ── Style maps ─────────────────────────────────────────────────── */
const STATUS_META: Record<CatStatus, { label: string; color: string; bg: string; border: string }> = {
  activated:   { label: 'Activated',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
  ready:       { label: 'Ready',       color: '#a3e635', bg: 'rgba(163,230,53,0.12)',  border: 'rgba(163,230,53,0.28)'  },
  'in-progress':{ label: 'In Progress', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.28)'  },
  blocked:     { label: 'Blocked',     color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.28)' },
}

/* ── Small components ───────────────────────────────────────────── */
function CheckIcon({ status }: { status: CheckStatus }) {
  if (status === 'done')    return <CheckCircle2 size={14} strokeWidth={2} style={{ color: '#4ade80', flexShrink: 0 }} />
  if (status === 'partial') return <AlertTriangle size={14} strokeWidth={2} style={{ color: '#fbbf24', flexShrink: 0 }} />
  return <XCircle size={14} strokeWidth={2} style={{ color: '#f87171', flexShrink: 0 }} />
}

function StatusBadge({ status }: { status: CatStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

function ProgressBar({ value, status }: { value: number; status: CatStatus }) {
  const color = status === 'blocked' ? '#f87171' : status === 'activated' || status === 'ready' ? '#4ade80' : '#60a5fa'
  return (
    <div className="w-full rounded-full h-1.5" style={{ background: 'var(--bg-inner)' }}>
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

function GlobalStat({ value, label, color, icon }: { value: number; label: string; color: string; icon: ReactNode }) {
  return (
    <div className="relative rounded-2xl px-5 pt-5 pb-4 overflow-hidden"
      style={{ background: 'var(--bg-card)', border: `1px solid ${color}28` }}>
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg,${color}90,transparent)` }} />
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: color + '18', color }}>{icon}</div>
      <div className="text-[36px] font-black tabular-nums leading-none tracking-tighter" style={{ color }}>{value}</div>
      <div className="text-[12px] font-medium mt-1.5" style={{ color: 'var(--text-3)' }}>{label}</div>
    </div>
  )
}

/* ── Slide-over panel ───────────────────────────────────────────── */
function SlideOver({ cat, onClose, onValidate, onBlock }: {
  cat: Caterer
  onClose: () => void
  onValidate: () => void
  onBlock: () => void
}) {
  const allDone = cat.items.every(i => i.status === 'done')

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-default)' }}>

        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>{cat.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={cat.status} />
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>{cat.progress}% complete · {cat.city}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-3)' }}>
            <X size={13} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ProgressBar value={cat.progress} status={cat.status} />
          <div className="mt-5 space-y-2">
            {cat.items.map(item => (
              <div key={item.key} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                <CheckIcon status={item.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'var(--text-4)', flexShrink: 0 }}>{item.icon}</span>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{item.label}</span>
                  </div>
                  <p className="text-[11.5px] mt-0.5" style={{ color: item.status === 'missing' ? '#f87171' : item.status === 'partial' ? '#fbbf24' : 'var(--text-4)' }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 flex gap-2 flex-wrap shrink-0" style={{ borderTop: '1px solid var(--border-default)' }}>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            <Send size={12} strokeWidth={2} /> Send Reminder
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            <MessageCircle size={12} strokeWidth={2} /> Via EcoLoop
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            <History size={12} strokeWidth={2} /> Audit
          </button>
          <div className="flex-1" />
          {cat.status !== 'activated' && (
            <button onClick={onBlock}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold cursor-pointer"
              style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.28)' }}>
              <XCircle size={12} strokeWidth={2} /> Block Go-live
            </button>
          )}
          {allDone && cat.status === 'ready' && (
            <button onClick={onValidate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold cursor-pointer"
              style={{ background: 'var(--accent)', color: '#07070a' }}>
              <Power size={12} strokeWidth={2} /> Validate Go-live
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Caterer card ───────────────────────────────────────────────── */
function CatererCard({ cat, onOpen }: { cat: Caterer; onOpen: () => void }) {
  const blocking = cat.items.filter(i => i.status === 'missing')
  const partial  = cat.items.filter(i => i.status === 'partial')

  return (
    <div className="rounded-2xl p-5 cursor-pointer transition-all hover:border-[var(--border-strong)]"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      onClick={onOpen}>

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>{cat.name}</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>{cat.city} · {cat.admin}</div>
        </div>
        <StatusBadge status={cat.status} />
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>Progress</span>
          <span className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--text-2)' }}>{cat.progress}%</span>
        </div>
        <ProgressBar value={cat.progress} status={cat.status} />
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {cat.items.map(item => (
          <div key={item.key} className="flex items-center gap-1.5">
            <CheckIcon status={item.status} />
            <span className="text-[11px] truncate" style={{ color: item.status === 'missing' ? '#f87171' : item.status === 'partial' ? '#fbbf24' : 'var(--text-4)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {(blocking.length > 0 || partial.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {blocking.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold"
              style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
              <XCircle size={10} strokeWidth={2} /> {blocking.length} blocking
            </span>
          )}
          {partial.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold"
              style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
              <AlertTriangle size={10} strokeWidth={2} /> {partial.length} partial
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>Target: {cat.targetDate}</span>
        <button className="flex items-center gap-1 text-[12px] font-medium cursor-pointer"
          style={{ color: 'var(--accent)' }}>
          View detail <ChevronRight size={12} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */
export function GoLiveMonitor() {
  const [caterers, setCaterers] = useState<Caterer[]>(INITIAL_CATERERS)
  const [search, setSearch]     = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<Caterer | null>(null)

  const activated   = caterers.filter(c => c.status === 'activated').length
  const ready       = caterers.filter(c => c.status === 'ready').length
  const blocked     = caterers.filter(c => c.status === 'blocked').length
  const inProgress  = caterers.filter(c => c.status === 'in-progress').length

  const filtered = caterers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || c.status === filterStatus
    return matchSearch && matchStatus
  })

  function handleValidate() {
    if (!selected) return
    setCaterers(prev => prev.map(c => c.id === selected.id ? { ...c, status: 'activated' as CatStatus, progress: 100 } : c))
    setSelected(null)
  }

  function handleBlock() {
    if (!selected) return
    setCaterers(prev => prev.map(c => c.id === selected.id ? { ...c, status: 'blocked' as CatStatus } : c))
    setSelected(null)
  }

  const statusOptions = [
    { value: 'activated',   label: 'Activated'   },
    { value: 'ready',       label: 'Ready'        },
    { value: 'in-progress', label: 'In Progress'  },
    { value: 'blocked',     label: 'Blocked'      },
  ]

  return (
    <div className="p-4 lg:p-7 max-w-[1400px]">
      <PageHeader
        badge={{ icon: <Rocket size={13} strokeWidth={2.5} />, label: 'Go-live Monitor' }}
        title="Go-live Monitor"
        subtitle="Track activation readiness across all caterers in onboarding. All 11 required items must be complete before Go-live can be validated."
        size="hero"
        glowColor="rgba(251,146,60,0.06)"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <GlobalStat value={activated}  label="Activated"   color="#4ade80" icon={<ShieldCheck size={16} strokeWidth={2} />} />
        <GlobalStat value={ready}      label="Ready"        color="#a3e635" icon={<CheckCircle2 size={16} strokeWidth={2} />} />
        <GlobalStat value={inProgress} label="In Progress"  color="#60a5fa" icon={<Rocket      size={16} strokeWidth={2} />} />
        <GlobalStat value={blocked}    label="Blocked"      color="#f87171" icon={<XCircle     size={16} strokeWidth={2} />} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={13} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-4)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search caterers…"
            className="w-full pl-8 pr-3 py-2 rounded-xl text-[13px] outline-none"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
        </div>
        <SelectFilter label="All statuses" value={filterStatus} options={statusOptions} onChange={setFilterStatus} />
        {(search || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterStatus('') }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            <X size={11} strokeWidth={2} /> Reset
          </button>
        )}
        <span className="ml-auto text-[12px]" style={{ color: 'var(--text-4)' }}>{filtered.length} caterers</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(cat => (
          <CatererCard key={cat.id} cat={cat} onOpen={() => setSelected(cat)} />
        ))}
      </div>

      {selected && (
        <SlideOver
          cat={selected}
          onClose={() => setSelected(null)}
          onValidate={handleValidate}
          onBlock={handleBlock}
        />
      )}
    </div>
  )
}
