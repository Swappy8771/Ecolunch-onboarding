import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  FolderLock, Search, Download, Filter, ChevronDown, MoreHorizontal,
  Eye, MapPin, Clock, RotateCcw, Users, FileText, Scale, Landmark,
  Shield, ShieldCheck, Building2, UtensilsCrossed, Puzzle, Lock,
  Rocket, AlertTriangle, CheckCircle2, XCircle, MessageSquare,
  Send, History, FilePen, Tag, ArrowLeft, ChevronRight,
} from 'lucide-react'
import { PageBadge } from '../../../shared/ui/PageBadge'

/* ── Types ──────────────────────────────────────────────────────── */
type DocStatus = 'approved' | 'pending' | 'rejected' | 'correction'

interface CatererVault {
  id: string
  name: string
  location: string
  totalDocs: number
  pending: number
  corrections: number
  lastActivity: string
}

interface CategoryInfo {
  key: string
  label: string
  icon: ReactNode
  color: string
  totalDocs: number
  pending: number
}

interface VaultDocument {
  id: string
  name: string
  category: string
  status: DocStatus
  version: string
  uploadedBy: string
  uploadDate: string
}

/* ── Mock data ──────────────────────────────────────────────────── */
const CATERERS: CatererVault[] = [
  { id: '1', name: 'Concept Gourmet', location: 'Montréal, QC',   totalDocs: 142, pending: 4, corrections: 2, lastActivity: '2h ago'        },
  { id: '2', name: 'FL',              location: 'Lévis, QC',      totalDocs: 87,  pending: 6, corrections: 1, lastActivity: '4h ago'        },
  { id: '3', name: 'MSN',             location: 'Saguenay, QC',   totalDocs: 63,  pending: 0, corrections: 0, lastActivity: 'Yesterday'     },
  { id: '4', name: 'ABC Catering',    location: 'Québec, QC',     totalDocs: 115, pending: 2, corrections: 3, lastActivity: '1h ago'        },
  { id: '5', name: 'Brasserie Nord',  location: 'Laval, QC',      totalDocs: 94,  pending: 1, corrections: 0, lastActivity: '3h ago'        },
  { id: '6', name: 'Café Réseau',     location: 'Sherbrooke, QC', totalDocs: 78,  pending: 3, corrections: 1, lastActivity: '5h ago'        },
]

const CATEGORIES: CategoryInfo[] = [
  { key: 'profile',    label: 'Profile / General',       icon: <Users           size={15} strokeWidth={1.8} />, color: '#60a5fa', totalDocs: 12, pending: 1 },
  { key: 'legal',      label: 'Legal Information',       icon: <Scale           size={15} strokeWidth={1.8} />, color: '#a78bfa', totalDocs: 8,  pending: 2 },
  { key: 'banking',    label: 'Banks & Banking',         icon: <Landmark        size={15} strokeWidth={1.8} />, color: '#4ade80', totalDocs: 6,  pending: 1 },
  { key: 'compliance', label: 'Compliance & Permits',    icon: <Shield          size={15} strokeWidth={1.8} />, color: '#34d399', totalDocs: 9,  pending: 0 },
  { key: 'insurance',  label: 'Insurance',               icon: <ShieldCheck     size={15} strokeWidth={1.8} />, color: '#fbbf24', totalDocs: 5,  pending: 1 },
  { key: 'clients',    label: 'My Clients',              icon: <Building2       size={15} strokeWidth={1.8} />, color: '#22d3ee', totalDocs: 15, pending: 0 },
  { key: 'menus',      label: 'Menus & Packages',        icon: <UtensilsCrossed size={15} strokeWidth={1.8} />, color: '#fb923c', totalDocs: 18, pending: 2 },
  { key: 'modules',    label: 'Modules',                 icon: <Puzzle          size={15} strokeWidth={1.8} />, color: '#a3e635', totalDocs: 7,  pending: 0 },
  { key: 'contracts',  label: 'Contracts & Signatures',  icon: <FilePen         size={15} strokeWidth={1.8} />, color: '#a78bfa', totalDocs: 11, pending: 1 },
  { key: 'golive',     label: 'Go-live',                 icon: <Rocket          size={15} strokeWidth={1.8} />, color: '#fb923c', totalDocs: 4,  pending: 0 },
  { key: 'internal',   label: 'Internal Documents',      icon: <Lock            size={15} strokeWidth={1.8} />, color: '#60a5fa', totalDocs: 6,  pending: 0 },
]

const INSURANCE_DOCS: VaultDocument[] = [
  { id: 'd1', name: 'insurance_cert_v2.pdf',        category: 'Insurance', status: 'approved',    version: 'v2.1', uploadedBy: 'Elise Bouchard',  uploadDate: '2026-06-01' },
  { id: 'd2', name: 'liability_coverage_2026.pdf',  category: 'Insurance', status: 'pending',     version: 'v1.0', uploadedBy: 'Hugo Bernier',    uploadDate: '2026-06-03' },
  { id: 'd3', name: 'equipment_insurance.pdf',      category: 'Insurance', status: 'correction',  version: 'v1.2', uploadedBy: 'Sandrine Lavoie', uploadDate: '2026-05-28' },
  { id: 'd4', name: 'workers_comp_cert.pdf',        category: 'Insurance', status: 'approved',    version: 'v3.0', uploadedBy: 'Elise Bouchard',  uploadDate: '2026-05-15' },
  { id: 'd5', name: 'property_insurance_annex.pdf', category: 'Insurance', status: 'rejected',    version: 'v1.0', uploadedBy: 'Hugo Bernier',    uploadDate: '2026-05-20' },
  { id: 'd6', name: 'umbrella_policy_2026.pdf',     category: 'Insurance', status: 'pending',     version: 'v1.0', uploadedBy: 'Sandrine Lavoie', uploadDate: '2026-06-04' },
  { id: 'd7', name: 'vehicle_insurance.pdf',        category: 'Insurance', status: 'approved',    version: 'v2.0', uploadedBy: 'Elise Bouchard',  uploadDate: '2026-04-10' },
  { id: 'd8', name: 'general_liability_v3.pdf',     category: 'Insurance', status: 'pending',     version: 'v3.1', uploadedBy: 'Hugo Bernier',    uploadDate: '2026-06-05' },
]

/* ── Style maps ─────────────────────────────────────────────────── */
const STATUS_META: Record<DocStatus, { label: string; color: string; bg: string; border: string }> = {
  approved:   { label: 'Approved',            color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.30)'  },
  pending:    { label: 'Pending Review',       color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.30)'  },
  rejected:   { label: 'Rejected',            color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.30)' },
  correction: { label: 'Correction Req.',     color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)'  },
}

const CATEGORY_LABELS = CATEGORIES.map(c => c.label)

/* ── Small components ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: DocStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3 min-w-0"
      style={{ background: 'var(--bg-card)', border: `1px solid ${color}28` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[22px] font-black tabular-nums leading-none" style={{ color }}>{value}</div>
        <div className="text-[11px] font-medium mt-0.5 truncate" style={{ color: 'var(--text-4)' }}>{label}</div>
      </div>
    </div>
  )
}

function SelectFilter({ label, value, options, onChange }: {
  label: string; value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="relative shrink-0">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-2 rounded-xl text-[12.5px] font-medium outline-none cursor-pointer"
        style={{
          background: 'var(--bg-inner)',
          border: `1px solid ${value ? '#a3e63550' : 'var(--border-strong)'}`,
          color: value ? 'var(--text-1)' : 'var(--text-4)',
        }}>
        <option value="">{label}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={11} strokeWidth={2} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-4)' }} />
    </div>
  )
}

/* ── Row 3-dot menu ─────────────────────────────────────────────── */
const DOC_MENU_ACTIONS = [
  { label: 'Smart Import',             icon: <Tag          size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'Classify',                 icon: <Tag          size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'Reclassify',               icon: <RotateCcw    size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'View Extracted Fields',    icon: <FileText     size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'View Linked Section',      icon: <ChevronRight size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'View Validation Status',   icon: <CheckCircle2 size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'Approve',                  icon: <CheckCircle2 size={13} strokeWidth={1.8} />, color: '#4ade80' },
  { label: 'Reject',                   icon: <XCircle      size={13} strokeWidth={1.8} />, color: '#f87171' },
  { label: 'Request Correction',       icon: <MessageSquare size={13} strokeWidth={1.8} />, color: '#fbbf24' },
  { label: 'Send via EcoLoop',         icon: <Send         size={13} strokeWidth={1.8} />, color: '#60a5fa' },
  { label: 'View Version History',     icon: <History      size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'View Audit Trail',         icon: <FileText     size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
]

function DocRowMenu({ open, onToggle, onClose }: { open: boolean; onToggle: () => void; onClose: () => void }) {
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
      <button
        onClick={e => { e.stopPropagation(); onToggle() }}
        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
        style={{
          color: 'var(--text-4)',
          background: open ? 'var(--bg-inner)' : 'transparent',
          border: '1px solid transparent',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--bg-inner)'
          el.style.borderColor = 'var(--border-strong)'
        }}
        onMouseLeave={e => {
          if (!open) {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'transparent'
            el.style.borderColor = 'transparent'
          }
        }}>
        <MoreHorizontal size={14} strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-30 rounded-xl py-1.5 min-w-[210px]"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}>
          {DOC_MENU_ACTIONS.map((a, i) => (
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

/* ── Document table columns ─────────────────────────────────────── */
const DOC_TABLE_COLS = [
  { label: 'Document Name', width: 'auto'   },
  { label: 'Category',      width: '160px'  },
  { label: 'Status',        width: '168px'  },
  { label: 'Version',       width: '80px'   },
  { label: 'Uploaded By',   width: '150px'  },
  { label: 'Upload Date',   width: '110px'  },
  { label: 'Actions',       width: '110px'  },
]

/* ── Left panel — compact caterer list ──────────────────────────── */
function CatererSidePanel({
  caterers,
  selected,
  onSelect,
}: {
  caterers: CatererVault[]
  selected: CatererVault
  onSelect: (c: CatererVault) => void
}) {
  return (
    <div className="w-[280px] shrink-0 flex flex-col overflow-hidden rounded-2xl"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
      <div className="px-4 py-3.5 shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <p className="text-[10px] uppercase tracking-[0.14em] font-bold" style={{ color: 'var(--text-4)' }}>
          Caterers
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {caterers.map(c => {
          const isSelected = c.id === selected.id
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="w-full text-left px-3 py-2.5 cursor-pointer transition-colors"
              style={{
                borderLeft: isSelected ? '2px solid #a3e635' : '2px solid transparent',
                background: isSelected ? 'rgba(163,230,53,0.06)' : 'transparent',
                borderBottom: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={e => {
                if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)'
              }}
              onMouseLeave={e => {
                if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-[13px] font-semibold truncate"
                  style={{ color: isSelected ? '#a3e635' : 'var(--text-1)' }}>
                  {c.name}
                </span>
                {(c.pending > 0 || c.corrections > 0) && (
                  <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                    {c.pending + c.corrections}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={9} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                <span className="text-[11px] truncate" style={{ color: 'var(--text-4)' }}>{c.location}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Level 1 — Caterer vault cards grid ─────────────────────────── */
function CatererVaultGrid({
  caterers,
  searchQuery,
  onOpen,
}: {
  caterers: CatererVault[]
  searchQuery: string
  onOpen: (c: CatererVault) => void
}) {
  const filtered = caterers.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <FolderLock size={32} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
        <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>No caterers match your search.</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map(c => (
        <div key={c.id}
          className="rounded-2xl p-5 flex flex-col gap-3.5 transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', cursor: 'default' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(163,230,53,0.45)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 1px rgba(163,230,53,0.15)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>

          {/* Name + location */}
          <div>
            <p className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>{c.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>{c.location}</span>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              {c.totalDocs} docs
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: c.pending > 0 ? 'rgba(251,191,36,0.12)' : 'var(--bg-inner)',
                color: c.pending > 0 ? '#fbbf24' : 'var(--text-4)',
                border: `1px solid ${c.pending > 0 ? 'rgba(251,191,36,0.30)' : 'var(--border-strong)'}`,
              }}>
              {c.pending} pending
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: c.corrections > 0 ? 'rgba(248,113,113,0.12)' : 'var(--bg-inner)',
                color: c.corrections > 0 ? '#f87171' : 'var(--text-4)',
                border: `1px solid ${c.corrections > 0 ? 'rgba(248,113,113,0.30)' : 'var(--border-strong)'}`,
              }}>
              {c.corrections} correction{c.corrections !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Last activity */}
          <div className="flex items-center gap-1.5">
            <Clock size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
            <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Last activity {c.lastActivity}</span>
          </div>

          {/* Open button */}
          <button
            onClick={() => onOpen(c)}
            className="w-full py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
            style={{ background: 'rgba(163,230,53,0.12)', color: '#a3e635', border: '1px solid rgba(163,230,53,0.30)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(163,230,53,0.22)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(163,230,53,0.12)' }}>
            Open Vault →
          </button>
        </div>
      ))}
    </div>
  )
}

/* ── Level 2 — Category cards grid ─────────────────────────────── */
function CategoryGrid({
  caterer: _caterer,
  onSelectCategory,
}: {
  caterer: CatererVault
  onSelectCategory: (cat: CategoryInfo) => void
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {CATEGORIES.map(cat => (
        <button
          key={cat.key}
          onClick={() => onSelectCategory(cat)}
          className="text-left rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = cat.color + '55'
            el.style.boxShadow = `0 0 0 1px ${cat.color}20`
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border-default)'
            el.style.boxShadow = 'none'
          }}>
          {/* Icon + pending badge */}
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: cat.color + '18', color: cat.color }}>
              {cat.icon}
            </div>
            {cat.pending > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                {cat.pending}
              </span>
            )}
          </div>

          {/* Label */}
          <div>
            <p className="text-[13px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>{cat.label}</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>{cat.totalDocs} documents</p>
          </div>
        </button>
      ))}
    </div>
  )
}

/* ── Level 3 — Document table ───────────────────────────────────── */
function DocumentTable({
  caterer,
  category,
  openMenuId,
  onMenuToggle,
  onMenuClose,
}: {
  caterer: CatererVault
  category: CategoryInfo
  openMenuId: string | null
  onMenuToggle: (id: string) => void
  onMenuClose: () => void
}) {
  const docs = INSURANCE_DOCS.map(d => ({ ...d, category: category.label }))

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '860px' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
              {DOC_TABLE_COLS.map(col => (
                <th key={col.label}
                  className="text-left px-4 py-3"
                  style={{ width: col.width, minWidth: col.width !== 'auto' ? col.width : undefined }}>
                  <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                    {col.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, idx) => (
              <tr key={doc.id}
                className="transition-colors"
                style={{ borderBottom: idx < docs.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>

                {/* Document name */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <FileText size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                    <span className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>{doc.name}</span>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3.5">
                  <span className="text-[12px] font-medium" style={{ color: 'var(--text-3)' }}>{doc.category}</span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5"><StatusBadge status={doc.status} /></td>

                {/* Version */}
                <td className="px-4 py-3.5">
                  <span className="text-[12px] font-semibold tabular-nums px-2 py-0.5 rounded-md"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-3)' }}>
                    {doc.version}
                  </span>
                </td>

                {/* Uploaded by */}
                <td className="px-4 py-3.5">
                  <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{doc.uploadedBy}</span>
                </td>

                {/* Upload date */}
                <td className="px-4 py-3.5">
                  <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>{doc.uploadDate}</span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer"
                      style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = '#60a5fa50'
                        el.style.color = '#60a5fa'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = 'var(--border-strong)'
                        el.style.color = 'var(--text-2)'
                      }}>
                      <Eye size={12} strokeWidth={2} />View
                    </button>
                    <DocRowMenu
                      open={openMenuId === doc.id}
                      onToggle={() => onMenuToggle(doc.id)}
                      onClose={onMenuClose}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
          {docs.length} document{docs.length !== 1 ? 's' : ''} in {category.label}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>
          {caterer.name}
        </span>
      </div>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────── */
export function DocumentVault() {
  const [selectedCaterer,  setSelectedCaterer]  = useState<CatererVault | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null)

  // Header search (Level 1 caterer filter)
  const [headerSearch, setHeaderSearch] = useState('')

  // Level 1 filter bar state
  const [filterSearch,   setFilterSearch]   = useState('')
  const [filterStatus,   setFilterStatus]   = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterDate,     setFilterDate]     = useState('')
  const [applied, setApplied] = useState({ search: '', status: '', category: '', date: '' })

  // Doc row menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Stats derived from all caterers
  const totalCaterers  = CATERERS.length
  const totalDocuments = CATERERS.reduce((s, c) => s + c.totalDocs, 0)
  const totalPending   = CATERERS.reduce((s, c) => s + c.pending, 0)
  const totalCorrections = CATERERS.reduce((s, c) => s + c.corrections, 0)

  const hasFilter = applied.search || applied.status || applied.category || applied.date

  function applyFilters() {
    setApplied({ search: filterSearch, status: filterStatus, category: filterCategory, date: filterDate })
  }
  function resetFilters() {
    setFilterSearch(''); setFilterStatus(''); setFilterCategory(''); setFilterDate('')
    setApplied({ search: '', status: '', category: '', date: '' })
  }

  function openCaterer(c: CatererVault) {
    setSelectedCaterer(c)
    setSelectedCategory(null)
  }

  function goBackToList() {
    setSelectedCaterer(null)
    setSelectedCategory(null)
  }

  function goBackToCaterer() {
    setSelectedCategory(null)
  }

  const isLevel1 = selectedCaterer === null
  const isLevel2 = selectedCaterer !== null && selectedCategory === null
  const isLevel3 = selectedCaterer !== null && selectedCategory !== null

  return (
    <div className="p-4 lg:p-7 max-w-[1500px]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
        <div>
          <PageBadge icon={<FolderLock size={12} strokeWidth={2.5} />} label="Document Vault" />
          <h1
            className="text-[28px] sm:text-[32px] font-black tracking-tight leading-tight mb-1.5"
            style={{
              background: 'linear-gradient(135deg,var(--text-1) 55%,var(--text-3) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
            Document Vault by Caterer
          </h1>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
            Manage onboarding documents, classifications, approvals, versions, and storage references.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search size={13} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-4)' }} />
            <input
              value={headerSearch}
              onChange={e => setHeaderSearch(e.target.value)}
              placeholder="Search caterers…"
              className="pl-9 pr-3 py-2.5 rounded-xl text-[12.5px] outline-none w-[180px]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-2)' }} />
          </div>
          <button
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            <Download size={13} strokeWidth={2} />Export
          </button>
        </div>
      </div>

      {/* ── Summary stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Caterers"      value={totalCaterers}   color="#60a5fa" icon={<Users          size={15} strokeWidth={1.8} />} />
        <StatCard label="Total Documents"     value={totalDocuments}  color="#a3e635" icon={<FileText       size={15} strokeWidth={1.8} />} />
        <StatCard label="Pending Review"      value={totalPending}    color="#fbbf24" icon={<AlertTriangle  size={14} strokeWidth={1.8} />} />
        <StatCard label="Correction Required" value={totalCorrections} color="#f87171" icon={<XCircle       size={15} strokeWidth={1.8} />} />
      </div>

      {/* ── Filter bar (Level 1 only) ── */}
      {isLevel1 && (
        <div className="flex flex-wrap items-center gap-2.5 mb-5 rounded-2xl px-5 py-3.5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <Filter size={13} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />

          <div className="relative">
            <Search size={12} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-4)' }} />
            <input
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              placeholder="Search caterer…"
              className="pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none w-[160px] sm:w-[180px]"
              style={{
                background: 'var(--bg-inner)',
                border: `1px solid ${filterSearch ? '#a3e63550' : 'var(--border-strong)'}`,
                color: 'var(--text-2)',
              }} />
          </div>

          <SelectFilter
            label="Document Status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: 'approved',   label: 'Approved'            },
              { value: 'pending',    label: 'Pending Review'      },
              { value: 'rejected',   label: 'Rejected'            },
              { value: 'correction', label: 'Correction Required' },
            ]} />

          <SelectFilter
            label="Category"
            value={filterCategory}
            onChange={setFilterCategory}
            options={CATEGORY_LABELS.map(l => ({ value: l, label: l }))} />

          <SelectFilter
            label="Activity Date"
            value={filterDate}
            onChange={setFilterDate}
            options={[
              { value: 'today',      label: 'Today'      },
              { value: 'this_week',  label: 'This Week'  },
              { value: 'this_month', label: 'This Month' },
            ]} />

          <div className="flex items-center gap-2 flex-1 justify-end" style={{ minWidth: 'max-content' }}>
            {hasFilter && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-80"
                style={{ color: 'var(--text-3)', background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
                <RotateCcw size={12} strokeWidth={2} />Reset
              </button>
            )}
            <button
              onClick={applyFilters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
              style={{ background: '#a3e635', color: '#07070a' }}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* ── Content area ── */}
      {isLevel1 && (
        /* Level 1 — full-width caterer grid */
        <CatererVaultGrid
          caterers={CATERERS}
          searchQuery={headerSearch || applied.search}
          onOpen={openCaterer}
        />
      )}

      {(isLevel2 || isLevel3) && selectedCaterer && (
        /* Level 2 / 3 — split layout */
        <div className="flex gap-5 min-h-0">

          {/* Left panel */}
          <CatererSidePanel
            caterers={CATERERS}
            selected={selectedCaterer}
            onSelect={c => { setSelectedCaterer(c); setSelectedCategory(null) }}
          />

          {/* Right panel */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Caterer header */}
            <div className="rounded-2xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              {/* Back + breadcrumb */}
              <div className="flex items-center gap-2 mb-3.5">
                <button
                  onClick={goBackToList}
                  className="flex items-center gap-1.5 text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-75"
                  style={{ color: 'var(--text-3)' }}>
                  <ArrowLeft size={13} strokeWidth={2} />All Vaults
                </button>
                <ChevronRight size={11} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
                {isLevel3 ? (
                  <>
                    <button
                      onClick={goBackToCaterer}
                      className="text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-75"
                      style={{ color: 'var(--text-3)' }}>
                      {selectedCaterer.name}
                    </button>
                    <ChevronRight size={11} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--text-2)' }}>
                      {selectedCategory?.label}
                    </span>
                  </>
                ) : (
                  <span className="text-[12px] font-semibold" style={{ color: 'var(--text-2)' }}>
                    {selectedCaterer.name}
                  </span>
                )}
              </div>

              {/* Name + location */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--text-1)' }}>
                    {selectedCaterer.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={12} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
                    <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>{selectedCaterer.location}</span>
                  </div>
                </div>

                {/* Inline stats */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                    {selectedCaterer.totalDocs} docs
                  </span>
                  {selectedCaterer.pending > 0 && (
                    <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.30)' }}>
                      {selectedCaterer.pending} pending
                    </span>
                  )}
                  {selectedCaterer.corrections > 0 && (
                    <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.30)' }}>
                      {selectedCaterer.corrections} correction{selectedCaterer.corrections !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Level 2 — categories */}
            {isLevel2 && (
              <CategoryGrid
                caterer={selectedCaterer}
                onSelectCategory={setSelectedCategory}
              />
            )}

            {/* Level 3 — document table */}
            {isLevel3 && selectedCategory && (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goBackToCaterer}
                    className="flex items-center gap-1.5 text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-75"
                    style={{ color: 'var(--text-3)' }}>
                    <ArrowLeft size={12} strokeWidth={2} />Back to categories
                  </button>
                  <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>·</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: selectedCategory.color + '18', color: selectedCategory.color }}>
                      {selectedCategory.icon}
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>
                      {selectedCategory.label}
                    </span>
                  </div>
                </div>

                <DocumentTable
                  caterer={selectedCaterer}
                  category={selectedCategory}
                  openMenuId={openMenuId}
                  onMenuToggle={id => setOpenMenuId(openMenuId === id ? null : id)}
                  onMenuClose={() => setOpenMenuId(null)}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
