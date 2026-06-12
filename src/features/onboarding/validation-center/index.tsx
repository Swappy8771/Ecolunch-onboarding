import { useState, useRef, useEffect } from 'react'
import {
  ClipboardCheck, Search, RefreshCw, Download, Filter,
  ChevronDown, MoreHorizontal, Eye, Check, X,
  AlertTriangle, MessageCircle, RotateCcw, History,
  FileText, Clock, User, Calendar, Tag, ChevronRight,
  Send, MessageSquare, XCircle, CheckCircle2,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { PageBadge } from '../../../shared/ui/PageBadge'
import { useLang } from '../../../shared/context/LangContext'

/* ── Types ──────────────────────────────────────────────── */
type VStatus  = 'pending' | 'approved' | 'rejected' | 'correction'
type Priority = 'critical' | 'high' | 'medium' | 'low'
type VType    = 'Document' | 'Contract' | 'Banking' | 'Menu' | 'Establishment' | 'Pricing' | 'Module' | 'Go-Live' | 'Smart Import'

interface ValidationItem {
  id: string
  title: string
  caterer: string
  type: VType
  status: VStatus
  priority: Priority
  created: string
  reviewer: string
  description: string
  sourceDoc?: string
}

/* ── Style maps ─────────────────────────────────────────── */
const STATUS_META: Record<VStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:    { label: 'Pending Review',       color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.30)'  },
  approved:   { label: 'Approved',             color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.30)'  },
  rejected:   { label: 'Rejected',             color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.30)' },
  correction: { label: 'Correction Requested', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)'  },
}

const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#f87171', bg: 'rgba(248,113,113,0.14)' },
  high:     { label: 'High',     color: '#fb923c', bg: 'rgba(251,146,60,0.14)'  },
  medium:   { label: 'Medium',   color: '#fbbf24', bg: 'rgba(251,191,36,0.14)'  },
  low:      { label: 'Low',      color: '#34d399', bg: 'rgba(52,211,153,0.14)'  },
}

const TYPE_META: Record<VType, { color: string; bg: string }> = {
  'Document':      { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'   },
  'Contract':      { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)'  },
  'Banking':       { color: '#4ade80', bg: 'rgba(74,222,128,0.12)'   },
  'Menu':          { color: '#fb923c', bg: 'rgba(251,146,60,0.12)'   },
  'Establishment': { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)'   },
  'Pricing':       { color: '#34d399', bg: 'rgba(52,211,153,0.12)'   },
  'Module':        { color: '#a3e635', bg: 'rgba(163,230,53,0.12)'   },
  'Go-Live':       { color: '#fb923c', bg: 'rgba(251,146,60,0.12)'   },
  'Smart Import':  { color: '#f472b6', bg: 'rgba(244,114,182,0.12)'  },
}

/* ── Mock data ──────────────────────────────────────────── */
const ALL_ITEMS: ValidationItem[] = [
  { id:'v1',  title:'Liability Insurance Certificate', caterer:'Concept Gourmet', type:'Document',     status:'pending',    priority:'critical', created:'2026-06-05', reviewer:'Elise Bouchard',  description:'Required liability insurance certificate for school service operations. Must be valid until end of current fiscal year and include establishment addresses.', sourceDoc:'insurance_cert_v1.pdf' },
  { id:'v2',  title:'Master Services Agreement',       caterer:'FL',              type:'Contract',     status:'correction', priority:'high',     created:'2026-06-04', reviewer:'Hugo Bernier',    description:'Primary master contract requires signature on page 4, section 3.2. The counterparty name differs from the registered business name.', sourceDoc:'MSA_FL_draft.pdf' },
  { id:'v3',  title:'IBAN Format Validation',          caterer:'MSN',             type:'Banking',      status:'rejected',   priority:'critical', created:'2026-06-03', reviewer:'Sandrine Lavoie', description:'IBAN provided does not match the expected CA format. Caterer must resubmit with correct 16-digit institution and transit numbers.' },
  { id:'v4',  title:'MAPAQ Permit 2026',               caterer:'Concept Gourmet', type:'Document',     status:'approved',   priority:'medium',   created:'2026-06-02', reviewer:'Elise Bouchard',  description:'Annual MAPAQ food safety permit reviewed and confirmed valid through December 2026.', sourceDoc:'MAPAQ_permit_2026.pdf' },
  { id:'v5',  title:'School Menu Cycle A — Week 1–4',  caterer:'ABC Catering',    type:'Menu',         status:'pending',    priority:'medium',   created:'2026-06-06', reviewer:'Hugo Bernier',    description:'4-week rotational menu for elementary school service. Requires allergen matrix and nutrition values per portion.' },
  { id:'v6',  title:'Pre-authorized Debit Form',       caterer:'Brasserie Nord',  type:'Banking',      status:'approved',   priority:'low',      created:'2026-06-05', reviewer:'Sandrine Lavoie', description:'PAD form completed and banking information validated against CRA registration.', sourceDoc:'PAD_form_signed.pdf' },
  { id:'v7',  title:'SaaS Pricing Configuration',      caterer:'FL',              type:'Pricing',      status:'pending',    priority:'high',     created:'2026-06-04', reviewer:'Elise Bouchard',  description:'SaaS pricing tier not configured. Blocks module activation and Go-live scheduling. Requires Growth plan selection confirmation.' },
  { id:'v8',  title:'EcoOrder Module Activation',      caterer:'Café Réseau',     type:'Module',       status:'correction', priority:'medium',   created:'2026-06-03', reviewer:'Hugo Bernier',    description:'EcoOrder module activation settings require review. The order cutoff time conflicts with kitchen preparation window.' },
  { id:'v9',  title:'Go-Live Checklist — Final Review',caterer:'Concept Gourmet', type:'Go-Live',      status:'pending',    priority:'high',     created:'2026-06-06', reviewer:'Sandrine Lavoie', description:'Final pre-launch checklist. 2 of 12 items still require admin sign-off before launch date can be confirmed.' },
  { id:'v10', title:'Establishment Profile — Schools', caterer:'MSN',             type:'Establishment',status:'pending',    priority:'low',      created:'2026-06-02', reviewer:'Elise Bouchard',  description:'School establishment registration details including address, capacity, and primary contact information.' },
  { id:'v11', title:'Acomba Import — Week 12 Data',    caterer:'Les Saveurs',     type:'Smart Import', status:'correction', priority:'medium',   created:'2026-06-01', reviewer:'Hugo Bernier',    description:'Smart Import mapping requires correction. 3 product codes not found in catalog. Must be remapped before import can proceed.', sourceDoc:'acomba_week12.csv' },
  { id:'v12', title:'Annex B — Service Terms',         caterer:'ABC Catering',    type:'Contract',     status:'pending',    priority:'high',     created:'2026-06-05', reviewer:'Sandrine Lavoie', description:'Service agreement annex covering liability, SLA, and data handling. Awaiting caterer countersignature.', sourceDoc:'annex_B_draft.pdf' },
]

const MOCK_HISTORY = [
  { actor: 'Elise Bouchard', action: 'Item submitted for review', time: '2026-06-05 · 09:14' },
  { actor: 'System',         action: 'Priority set to High by auto-classification', time: '2026-06-05 · 09:14' },
  { actor: 'Hugo Bernier',   action: 'Assigned to Sandrine Lavoie', time: '2026-06-05 · 11:30' },
]

/* ── Small components ───────────────────────────────────── */
function StatusBadge({ status }: { status: VStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const m = PRIORITY_META[priority]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-[0.08em]"
      style={{ background: m.bg, color: m.color }}>
      {priority === 'critical' && <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: m.color }} />}
      {m.label}
    </span>
  )
}

function TypeBadge({ type }: { type: VType }) {
  const m = TYPE_META[type]
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color }}>
      {type}
    </span>
  )
}

/* ── Stat card (compact horizontal) ────────────────────── */
function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3 min-w-0"
      style={{ background: 'var(--bg-card)', border: `1px solid ${color}28` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: color+'18', color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[22px] font-black tabular-nums leading-none" style={{ color }}>{value}</div>
        <div className="text-[11px] font-medium mt-0.5 truncate" style={{ color: 'var(--text-4)' }}>{label}</div>
      </div>
    </div>
  )
}

/* ── Select filter ──────────────────────────────────────── */
function SelectFilter({ label, value, options, onChange }: {
  label: string; value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="relative shrink-0">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-2 rounded-xl text-[12.5px] font-medium outline-none cursor-pointer"
        style={{ background: 'var(--bg-inner)', border: `1px solid ${value ? '#a3e63550' : 'var(--border-strong)'}`, color: value ? 'var(--text-1)' : 'var(--text-4)' }}>
        <option value="">{label}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={11} strokeWidth={2} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
    </div>
  )
}

/* ── Row 3-dot menu ─────────────────────────────────────── */
const SECONDARY_ACTIONS = [
  { label: 'Request Correction', icon: <MessageSquare size={13} strokeWidth={1.8} />, color: '#fbbf24' },
  { label: 'Reject',             icon: <XCircle       size={13} strokeWidth={1.8} />, color: '#f87171' },
  { label: 'Add Internal Note',  icon: <MessageCircle size={13} strokeWidth={1.8} />, color: 'var(--text-3)' },
  { label: 'Send via EcoLoop',   icon: <Send          size={13} strokeWidth={1.8} />, color: '#60a5fa'  },
  { label: 'View History',       icon: <History       size={13} strokeWidth={1.8} />, color: 'var(--text-3)' },
]

function RowMenu({ open, onToggle, onClose }: { open: boolean; onToggle: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, onClose])

  return (
    <div ref={ref} className="relative">
      <button onClick={e => { e.stopPropagation(); onToggle() }}
        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
        style={{ color: 'var(--text-4)', background: open ? 'var(--bg-inner)' : 'transparent', border: '1px solid transparent' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}
        onMouseLeave={e => { if (!open) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' } }}>
        <MoreHorizontal size={14} strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-30 rounded-xl py-1.5 min-w-[200px]"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}>
          {SECONDARY_ACTIONS.map((a, i) => (
            <button key={i}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12.5px] font-medium text-left cursor-pointer"
              style={{ color: a.color }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              {a.icon}{a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Detail drawer ──────────────────────────────────────── */
function DetailDrawer({ item, onClose }: { item: ValidationItem | null; onClose: () => void }) {
  const open = item !== null

  // Trap focus / keyboard close
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!item) return null
  const pm = PRIORITY_META[item.priority]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)', opacity: open ? 1 : 0, transition: 'opacity 220ms ease' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-[52px] bottom-0 z-50 flex flex-col w-full sm:w-[520px]"
        style={{
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-default)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '-12px 0 48px rgba(0,0,0,0.3)',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <TypeBadge type={item.type} />
              <StatusBadge status={item.status} />
            </div>
            <h2 className="text-[16px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>{item.title}</h2>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors mt-0.5"
            style={{ color: 'var(--text-4)', background: 'transparent', border: '1px solid transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Caterer',   value: item.caterer,  icon: <User size={12} strokeWidth={1.8} /> },
              { label: 'Type',      value: item.type,     icon: <Tag  size={12} strokeWidth={1.8} /> },
              { label: 'Created',   value: item.created,  icon: <Calendar size={12} strokeWidth={1.8} /> },
              { label: 'Reviewer',  value: item.reviewer, icon: <User size={12} strokeWidth={1.8} /> },
            ].map(m => (
              <div key={m.label} className="rounded-xl px-3.5 py-3"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-4)' }}>
                  {m.icon}
                  <span className="text-[10px] uppercase tracking-[0.12em] font-semibold">{m.label}</span>
                </div>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Priority */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>Priority</p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: pm.color }} />
              <span className="text-[13px] font-semibold" style={{ color: pm.color }}>{pm.label}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>Description</p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{item.description}</p>
          </div>

          {/* Source document */}
          {item.sourceDoc && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>Source Document</p>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl cursor-pointer"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#60a5fa50' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}>
                <FileText size={14} strokeWidth={1.8} style={{ color: '#60a5fa', flexShrink: 0 }} />
                <span className="text-[12.5px] font-medium" style={{ color: '#60a5fa' }}>{item.sourceDoc}</span>
                <ChevronRight size={12} strokeWidth={2} className="ml-auto" style={{ color: 'var(--text-4)' }} />
              </div>
            </div>
          )}

          {/* Smart Import data notice */}
          {item.type === 'Smart Import' && (
            <div className="rounded-xl px-4 py-3 flex items-center gap-2.5"
              style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.25)' }}>
              <Tag size={13} strokeWidth={1.8} style={{ color: '#f472b6', flexShrink: 0 }} />
              <p className="text-[12.5px]" style={{ color: '#f472b6' }}>Smart Import context available — view mapping in Import Center</p>
            </div>
          )}

          {/* Internal notes */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>Internal Notes</p>
            <textarea
              rows={3}
              placeholder="Add an internal note visible only to admins…"
              className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-1)' }}
              onFocus={e => { (e.target as HTMLElement).style.borderColor = '#a3e63560' }}
              onBlur={e => { (e.target as HTMLElement).style.borderColor = 'var(--border-default)' }}
            />
          </div>

          {/* History */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-3" style={{ color: 'var(--text-4)' }}>History</p>
            <div className="flex flex-col gap-0">
              {MOCK_HISTORY.map((h, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  {i < MOCK_HISTORY.length - 1 && (
                    <div className="absolute left-[7px] top-6 bottom-0 w-px" style={{ background: 'var(--border-subtle)' }} />
                  )}
                  <div className="w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5" style={{ background: 'var(--bg-inner)', borderColor: 'var(--border-default)' }} />
                  <div>
                    <p className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{h.action}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{h.actor} · {h.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer footer */}
        <div className="shrink-0 px-6 py-4 flex items-center gap-2.5"
          style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
            style={{ background: '#4ade8018', color: '#4ade80', border: '1px solid #4ade8030' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4ade8030' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#4ade8018' }}>
            <CheckCircle2 size={14} strokeWidth={2} />Approve
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: '#fbbf2418', color: '#fbbf24', border: '1px solid #fbbf2430' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fbbf2430' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fbbf2418' }}>
            <MessageSquare size={14} strokeWidth={2} />Correction
          </button>
          <button
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: '#f8717118', color: '#f87171', border: '1px solid #f8717130' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f8717130' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8717118' }}>
            <XCircle size={14} strokeWidth={2} />Reject
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Table columns ──────────────────────────────────────── */
const TABLE_COLS = [
  { label: 'Validation Item', width: 'auto'   },
  { label: 'Caterer',         width: '140px'  },
  { label: 'Type',            width: '128px'  },
  { label: 'Status',          width: '178px'  },
  { label: 'Priority',        width: '100px'  },
  { label: 'Created',         width: '106px'  },
  { label: 'Actions',         width: '148px'  },
]

/* ── Page ───────────────────────────────────────────────── */
export function ValidationCenter() {
  const { t } = useLang()

  // Filter state
  const [search,      setSearch]      = useState('')
  const [typeFilter,  setTypeFilter]  = useState('')
  const [statFilter,  setStatFilter]  = useState('')
  const [prioFilter,  setPrioFilter]  = useState('')
  const [catFilter,   setCatFilter]   = useState('')
  const [revFilter,   setRevFilter]   = useState('')
  const [applied,     setApplied]     = useState({ search:'', type:'', stat:'', prio:'', cat:'', rev:'' })

  // UI state
  const [openMenuId,  setOpenMenuId]  = useState<string | null>(null)
  const [drawerItem,  setDrawerItem]  = useState<ValidationItem | null>(null)

  // Derived
  const filtered = ALL_ITEMS.filter(item => {
    if (applied.search && !item.title.toLowerCase().includes(applied.search.toLowerCase()) && !item.caterer.toLowerCase().includes(applied.search.toLowerCase())) return false
    if (applied.type   && item.type     !== applied.type)   return false
    if (applied.stat   && item.status   !== applied.stat)   return false
    if (applied.prio   && item.priority !== applied.prio)   return false
    if (applied.cat    && item.caterer  !== applied.cat)    return false
    if (applied.rev    && item.reviewer !== applied.rev)    return false
    return true
  })

  const stats = {
    pending:      ALL_ITEMS.filter(i => i.status === 'pending').length,
    approved:     ALL_ITEMS.filter(i => i.status === 'approved').length,
    corrections:  ALL_ITEMS.filter(i => i.status === 'correction').length,
    critical:     ALL_ITEMS.filter(i => i.priority === 'critical').length,
  }

  const caterers  = Array.from(new Set(ALL_ITEMS.map(i => i.caterer)))
  const reviewers = Array.from(new Set(ALL_ITEMS.map(i => i.reviewer)))
  const hasFilter = Object.values(applied).some(v => v !== '')

  function apply() {
    setApplied({ search, type: typeFilter, stat: statFilter, prio: prioFilter, cat: catFilter, rev: revFilter })
  }
  function reset() {
    setSearch(''); setTypeFilter(''); setStatFilter(''); setPrioFilter(''); setCatFilter(''); setRevFilter('')
    setApplied({ search:'', type:'', stat:'', prio:'', cat:'', rev:'' })
  }

  return (
    <div className="p-4 lg:p-7 max-w-[1400px]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
        <div>
          <PageBadge icon={<ClipboardCheck size={12} strokeWidth={2.5} />} label="Validation Center" />
          <h1 className="text-[28px] sm:text-[32px] font-black tracking-tight leading-tight mb-1.5"
            style={{ background: 'linear-gradient(135deg,var(--text-1) 55%,var(--text-3) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            {t.centreValidation.title}
          </h1>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
            Review, approve, reject, and manage onboarding validation items.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <div className="relative">
            <Search size={13} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
            <input placeholder="Search items…"
              className="pl-9 pr-3 py-2.5 rounded-xl text-[12.5px] outline-none w-[180px]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-2)' }} />
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            <RefreshCw size={13} strokeWidth={2} />Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            <Download size={13} strokeWidth={2} />Export
          </button>
        </div>
      </div>

      {/* ── Compact stat row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Pending Review"        value={stats.pending}     color="#60a5fa" icon={<Clock         size={15} strokeWidth={1.8} />} />
        <StatCard label="Approved Today"        value={stats.approved}    color="#4ade80" icon={<CheckCircle2  size={15} strokeWidth={1.8} />} />
        <StatCard label="Corrections Requested" value={stats.corrections} color="#fbbf24" icon={<AlertTriangle size={14} strokeWidth={1.8} />} />
        <StatCard label="Critical Issues"       value={stats.critical}    color="#f87171" icon={<XCircle       size={15} strokeWidth={1.8} />} />
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5 rounded-2xl px-5 py-3.5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <Filter size={13} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />

        <div className="relative">
          <Search size={12} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search validation item…"
            className="pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none w-[180px]"
            style={{ background: 'var(--bg-inner)', border: `1px solid ${search ? '#a3e63550' : 'var(--border-strong)'}`, color: 'var(--text-2)' }} />
        </div>

        <SelectFilter label="All Types" value={typeFilter} onChange={setTypeFilter}
          options={(['Document','Contract','Banking','Menu','Establishment','Pricing','Module','Go-Live','Smart Import'] as VType[]).map(v => ({ value: v, label: v }))} />

        <SelectFilter label="All Statuses" value={statFilter} onChange={setStatFilter}
          options={Object.entries(STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))} />

        <SelectFilter label="All Priorities" value={prioFilter} onChange={setPrioFilter}
          options={Object.entries(PRIORITY_META).map(([v, m]) => ({ value: v, label: m.label }))} />

        <SelectFilter label="All Caterers" value={catFilter} onChange={setCatFilter}
          options={caterers.map(c => ({ value: c, label: c }))} />

        <SelectFilter label="All Reviewers" value={revFilter} onChange={setRevFilter}
          options={reviewers.map(r => ({ value: r, label: r }))} />

        <div className="flex items-center gap-2 flex-1 justify-end" style={{ minWidth: 'max-content' }}>
          {hasFilter && (
            <button onClick={reset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-80"
              style={{ color: 'var(--text-3)', background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
              <RotateCcw size={12} strokeWidth={2} />Reset
            </button>
          )}
          <button onClick={apply}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
            style={{ background: '#a3e635', color: '#07070a' }}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* ── Queue table ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '900px' }}>

            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
                {TABLE_COLS.map(col => (
                  <th key={col.label}
                    className={`text-left px-4 py-3 ${col.label === 'Validation Item' ? '' : 'whitespace-nowrap'}`}
                    style={{ width: col.width, minWidth: col.width !== 'auto' ? col.width : undefined }}>
                    <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                      {col.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardCheck size={28} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>{t.centreValidation.noResults}</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((item, idx) => (
                <tr key={item.id}
                  className="transition-colors group"
                  style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>

                  {/* Validation item */}
                  <td className="px-4 py-3.5">
                    <button
                      className="text-left w-full cursor-pointer"
                      onClick={() => setDrawerItem(item)}>
                      <div className="text-[13.5px] font-semibold leading-snug group-hover:underline"
                        style={{ color: 'var(--text-1)', textDecorationColor: 'var(--border-default)' }}>
                        {item.title}
                      </div>
                      <div className="text-[12px] mt-0.5 line-clamp-1 max-w-[320px]" style={{ color: 'var(--text-4)' }}>
                        {item.description}
                      </div>
                    </button>
                  </td>

                  {/* Caterer */}
                  <td className="px-4 py-3.5">
                    <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{item.caterer}</span>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3.5"><TypeBadge type={item.type} /></td>

                  {/* Status */}
                  <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>

                  {/* Priority */}
                  <td className="px-4 py-3.5"><PriorityBadge priority={item.priority} /></td>

                  {/* Created */}
                  <td className="px-4 py-3.5">
                    <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>{item.created}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {/* View */}
                      <button
                        onClick={() => setDrawerItem(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                        style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#60a5fa50'; el.style.color = '#60a5fa' }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-strong)'; el.style.color = 'var(--text-2)' }}>
                        <Eye size={12} strokeWidth={2} />View
                      </button>

                      {/* Approve (hidden if already approved) */}
                      {item.status !== 'approved' && (
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                          style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.28)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.22)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.12)' }}>
                          <Check size={12} strokeWidth={2.5} />Approve
                        </button>
                      )}

                      {/* 3-dot */}
                      <RowMenu
                        open={openMenuId === item.id}
                        onToggle={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                        onClose={() => setOpenMenuId(null)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
            {filtered.length} of {ALL_ITEMS.length} items
          </span>
          <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>
            {ALL_ITEMS.filter(i => i.status === 'pending').length} pending review
          </span>
        </div>
      </div>

      {/* ── Detail drawer ── */}
      <DetailDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />
    </div>
  )
}
