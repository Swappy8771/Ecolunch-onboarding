import { useState, useEffect, useRef } from 'react'
import type { ReactNode, ReactElement } from 'react'
import {
  FileSignature, Search, Download, Filter, RotateCcw,
  Eye, Send, RefreshCw, XCircle, FileDown, ExternalLink,
  DollarSign, History, FileText,
  X, Calendar, Mail, User, Hash, Layers,
  Puzzle, Clock, CheckCircle2, AlertTriangle, FilePen,
} from 'lucide-react'
import { PageHeader } from '../../../shared/components/PageHeader'
import { SelectFilter } from '../../../shared/components/SelectFilter'
import { DropdownMenu } from '../../../shared/components/DropdownMenu'

type ContractStatus =
  | 'draft'
  | 'ready'
  | 'sent'
  | 'viewed'
  | 'partially_signed'
  | 'signed'
  | 'declined'
  | 'expired'
  | 'cancelled'
  | 'error'

interface Contract {
  id: string
  name: string
  type: string
  template: string
  caterer: string
  signatoryName: string
  signatoryEmail: string
  dropboxRequestId: string
  status: ContractStatus
  sentDate: string | null
  viewedDate: string | null
  signedDate: string | null
  version: string
  linkedModules: string[]
  auditLog: { date: string; action: string; actor: string }[]
}

const CONTRACTS: Contract[] = [
  {
    id: 'c1',
    name: 'Master Service Agreement 2026',
    type: 'MSA',
    template: 'Template MSA v3.2',
    caterer: 'Concept Gourmet',
    signatoryName: 'Elise Bouchard',
    signatoryEmail: 'elise.bouchard@conceptgourmet.ca',
    dropboxRequestId: 'dbs_req_a1b2c3d4',
    status: 'signed',
    sentDate: '2026-05-10',
    viewedDate: '2026-05-11',
    signedDate: '2026-05-12',
    version: 'v3.2',
    linkedModules: ['Schools', 'Daycares', 'CSS'],
    auditLog: [
      { date: '2026-05-10 09:14', action: 'Contract sent for signature', actor: 'Admin' },
      { date: '2026-05-11 14:32', action: 'Document viewed by signatory', actor: 'Elise Bouchard' },
      { date: '2026-05-12 10:05', action: 'Document signed', actor: 'Elise Bouchard' },
    ],
  },
  {
    id: 'c2',
    name: 'Data Processing Agreement',
    type: 'DPA',
    template: 'Template DPA v1.1',
    caterer: 'Concept Gourmet',
    signatoryName: 'Elise Bouchard',
    signatoryEmail: 'elise.bouchard@conceptgourmet.ca',
    dropboxRequestId: 'dbs_req_b2c3d4e5',
    status: 'viewed',
    sentDate: '2026-06-01',
    viewedDate: '2026-06-03',
    signedDate: null,
    version: 'v1.1',
    linkedModules: ['Camps'],
    auditLog: [
      { date: '2026-06-01 11:00', action: 'Contract sent for signature', actor: 'Admin' },
      { date: '2026-06-03 16:20', action: 'Document viewed by signatory', actor: 'Elise Bouchard' },
    ],
  },
  {
    id: 'c3',
    name: 'Platform Subscription Contract',
    type: 'Subscription',
    template: 'Template Sub v2.0',
    caterer: 'FL',
    signatoryName: 'Hugo Bernier',
    signatoryEmail: 'hugo.bernier@fl.ca',
    dropboxRequestId: 'dbs_req_c3d4e5f6',
    status: 'partially_signed',
    sentDate: '2026-06-02',
    viewedDate: '2026-06-02',
    signedDate: null,
    version: 'v2.0',
    linkedModules: ['Schools'],
    auditLog: [
      { date: '2026-06-02 08:45', action: 'Contract sent for signature', actor: 'Admin' },
      { date: '2026-06-02 13:10', action: 'Document viewed by signatory', actor: 'Hugo Bernier' },
      { date: '2026-06-03 09:30', action: 'Partially signed by first signatory', actor: 'Hugo Bernier' },
    ],
  },
  {
    id: 'c4',
    name: 'Service Level Agreement',
    type: 'SLA',
    template: 'Template SLA v1.0',
    caterer: 'FL',
    signatoryName: 'Hugo Bernier',
    signatoryEmail: 'hugo.bernier@fl.ca',
    dropboxRequestId: 'dbs_req_d4e5f6g7',
    status: 'sent',
    sentDate: '2026-06-07',
    viewedDate: null,
    signedDate: null,
    version: 'v1.0',
    linkedModules: ['Daycares'],
    auditLog: [
      { date: '2026-06-07 10:00', action: 'Contract sent for signature', actor: 'Admin' },
    ],
  },
  {
    id: 'c5',
    name: 'Module Access Agreement',
    type: 'Module Agreement',
    template: 'Template MOD v1.3',
    caterer: 'MSN',
    signatoryName: 'Sandrine Lavoie',
    signatoryEmail: 'sandrine.lavoie@msn.ca',
    dropboxRequestId: 'dbs_req_e5f6g7h8',
    status: 'declined',
    sentDate: '2026-05-20',
    viewedDate: '2026-05-21',
    signedDate: null,
    version: 'v1.3',
    linkedModules: ['Schools', 'Camps'],
    auditLog: [
      { date: '2026-05-20 14:00', action: 'Contract sent for signature', actor: 'Admin' },
      { date: '2026-05-21 10:15', action: 'Document viewed by signatory', actor: 'Sandrine Lavoie' },
      { date: '2026-05-22 09:00', action: 'Document declined by signatory', actor: 'Sandrine Lavoie' },
    ],
  },
  {
    id: 'c6',
    name: 'Master Service Agreement 2026',
    type: 'MSA',
    template: 'Template MSA v3.2',
    caterer: 'ABC Catering',
    signatoryName: 'Luc Tremblay',
    signatoryEmail: 'luc.tremblay@abccatering.ca',
    dropboxRequestId: 'dbs_req_f6g7h8i9',
    status: 'draft',
    sentDate: null,
    viewedDate: null,
    signedDate: null,
    version: 'v3.2',
    linkedModules: ['Daycares', 'CSS'],
    auditLog: [
      { date: '2026-06-08 11:30', action: 'Draft created', actor: 'Admin' },
    ],
  },
  {
    id: 'c7',
    name: 'Platform Subscription Contract',
    type: 'Subscription',
    template: 'Template Sub v2.0',
    caterer: 'Brasserie Nord',
    signatoryName: 'Marie-Claire Fontaine',
    signatoryEmail: 'mcfontaine@brasserienord.ca',
    dropboxRequestId: 'dbs_req_g7h8i9j0',
    status: 'signed',
    sentDate: '2026-04-15',
    viewedDate: '2026-04-16',
    signedDate: '2026-04-17',
    version: 'v2.0',
    linkedModules: ['Schools', 'Daycares'],
    auditLog: [
      { date: '2026-04-15 09:00', action: 'Contract sent for signature', actor: 'Admin' },
      { date: '2026-04-16 14:00', action: 'Document viewed by signatory', actor: 'Marie-Claire Fontaine' },
      { date: '2026-04-17 11:20', action: 'Document signed', actor: 'Marie-Claire Fontaine' },
    ],
  },
  {
    id: 'c8',
    name: 'Data Processing Agreement',
    type: 'DPA',
    template: 'Template DPA v1.1',
    caterer: 'Brasserie Nord',
    signatoryName: 'Marie-Claire Fontaine',
    signatoryEmail: 'mcfontaine@brasserienord.ca',
    dropboxRequestId: 'dbs_req_h8i9j0k1',
    status: 'expired',
    sentDate: '2026-03-01',
    viewedDate: '2026-03-02',
    signedDate: null,
    version: 'v1.0',
    linkedModules: [],
    auditLog: [
      { date: '2026-03-01 10:00', action: 'Contract sent for signature', actor: 'Admin' },
      { date: '2026-03-02 09:45', action: 'Document viewed by signatory', actor: 'Marie-Claire Fontaine' },
      { date: '2026-04-01 00:00', action: 'Contract expired (30-day limit)', actor: 'System' },
    ],
  },
  {
    id: 'c9',
    name: 'Go-live Readiness Agreement',
    type: 'Go-live',
    template: 'Template GL v1.0',
    caterer: 'ABC Catering',
    signatoryName: 'Luc Tremblay',
    signatoryEmail: 'luc.tremblay@abccatering.ca',
    dropboxRequestId: 'dbs_req_i9j0k1l2',
    status: 'ready',
    sentDate: null,
    viewedDate: null,
    signedDate: null,
    version: 'v1.0',
    linkedModules: ['CSS'],
    auditLog: [
      { date: '2026-06-09 08:00', action: 'Contract marked ready to send', actor: 'Admin' },
    ],
  },
  {
    id: 'c10',
    name: 'Module Access Agreement',
    type: 'Module Agreement',
    template: 'Template MOD v1.3',
    caterer: 'MSN',
    signatoryName: 'Sandrine Lavoie',
    signatoryEmail: 'sandrine.lavoie@msn.ca',
    dropboxRequestId: 'dbs_req_j0k1l2m3',
    status: 'error',
    sentDate: '2026-06-06',
    viewedDate: null,
    signedDate: null,
    version: 'v1.3',
    linkedModules: ['Schools'],
    auditLog: [
      { date: '2026-06-06 12:00', action: 'Contract send attempted', actor: 'Admin' },
      { date: '2026-06-06 12:01', action: 'Send failed — Dropbox Sign API error', actor: 'System' },
    ],
  },
]

const STATUS_META: Record<ContractStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:            { label: 'Draft',             color: 'var(--text-3)', bg: 'var(--bg-inner)',            border: 'var(--border-strong)'         },
  ready:            { label: 'Ready to Send',     color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)',      border: 'rgba(96,165,250,0.28)'        },
  sent:             { label: 'Sent',              color: '#a78bfa',       bg: 'rgba(167,139,250,0.12)',     border: 'rgba(167,139,250,0.28)'       },
  viewed:           { label: 'Viewed',            color: '#22d3ee',       bg: 'rgba(34,211,238,0.12)',      border: 'rgba(34,211,238,0.28)'        },
  partially_signed: { label: 'Partially Signed',  color: '#fb923c',       bg: 'rgba(251,146,60,0.12)',      border: 'rgba(251,146,60,0.28)'        },
  signed:           { label: 'Signed',            color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',      border: 'rgba(74,222,128,0.28)'        },
  declined:         { label: 'Declined',          color: '#f87171',       bg: 'rgba(248,113,113,0.12)',     border: 'rgba(248,113,113,0.28)'       },
  expired:          { label: 'Expired',           color: '#94a3b8',       bg: 'rgba(148,163,184,0.12)',     border: 'rgba(148,163,184,0.28)'       },
  cancelled:        { label: 'Cancelled',         color: '#94a3b8',       bg: 'rgba(148,163,184,0.12)',     border: 'rgba(148,163,184,0.28)'       },
  error:            { label: 'Error',             color: '#f43f5e',       bg: 'rgba(244,63,94,0.12)',       border: 'rgba(244,63,94,0.28)'         },
}

const CONTRACT_TYPES = ['MSA', 'DPA', 'Subscription', 'SLA', 'Module Agreement', 'Go-live']

const CATERERS_LIST = ['Concept Gourmet', 'FL', 'MSN', 'ABC Catering', 'Brasserie Nord']

function StatusBadge({ status }: { status: ContractStatus }) {
  const m = STATUS_META[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: ReactNode }) {
  return (
    <div
      className="relative rounded-2xl px-5 pt-4 pb-4 overflow-hidden flex items-center gap-4"
      style={{ background: 'var(--bg-card)', border: `1px solid ${color}28` }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg,${color}90,transparent)` }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[26px] font-black tabular-nums leading-none" style={{ color }}>{value}</div>
        <div className="text-[11.5px] font-medium mt-0.5 truncate" style={{ color: 'var(--text-4)' }}>{label}</div>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="w-5 h-5 flex items-center justify-center mt-0.5 shrink-0" style={{ color: 'var(--text-4)' }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{label}</div>
        <div className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>{value}</div>
      </div>
    </div>
  )
}

function SlideOver({ contract, onClose }: { contract: Contract; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={ref}
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: 'min(520px, 100vw)',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-default)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-default)' }}
        >
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.14em] font-bold mb-1.5" style={{ color: 'var(--accent)' }}>
              Contract Detail
            </div>
            <h2 className="text-[17px] font-black leading-snug" style={{ color: 'var(--text-1)' }}>
              {contract.name}
            </h2>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>{contract.caterer}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)' }}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {/* Status badge */}
          <div className="flex items-center gap-3">
            <StatusBadge status={contract.status} />
            <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              {contract.version}
            </span>
          </div>

          {/* Contract details */}
          <div className="rounded-2xl px-4 pt-1 pb-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <DetailRow icon={<FilePen size={13} strokeWidth={1.8} />} label="Contract Name" value={contract.name} />
            <DetailRow icon={<Layers size={13} strokeWidth={1.8} />} label="Contract Type" value={contract.type} />
            <DetailRow icon={<FileText size={13} strokeWidth={1.8} />} label="Template Used" value={contract.template} />
            <DetailRow icon={<User size={13} strokeWidth={1.8} />} label="Signatory Name" value={contract.signatoryName} />
            <DetailRow icon={<Mail size={13} strokeWidth={1.8} />} label="Signatory Email" value={
              <a href={`mailto:${contract.signatoryEmail}`} className="hover:underline" style={{ color: '#60a5fa' }}>
                {contract.signatoryEmail}
              </a>
            } />
            <DetailRow icon={<Hash size={13} strokeWidth={1.8} />} label="Dropbox Sign Request ID" value={
              <span className="font-mono text-[12px]">{contract.dropboxRequestId}</span>
            } />
          </div>

          {/* Dates */}
          <div className="rounded-2xl px-4 pt-1 pb-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <DetailRow icon={<Send size={13} strokeWidth={1.8} />} label="Sent Date" value={contract.sentDate ?? '—'} />
            <DetailRow icon={<Eye size={13} strokeWidth={1.8} />} label="Viewed Date" value={contract.viewedDate ?? '—'} />
            <DetailRow icon={<CheckCircle2 size={13} strokeWidth={1.8} />} label="Signed Date" value={contract.signedDate ?? '—'} />
          </div>

          {/* Linked modules */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Puzzle size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
              <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                Linked Modules
              </span>
            </div>
            {contract.linkedModules.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {contract.linkedModules.map(mod => (
                  <span key={mod}
                    className="text-[12px] font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(163,230,53,0.12)', color: '#a3e635', border: '1px solid rgba(163,230,53,0.28)' }}>
                    {mod}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>No linked modules</span>
            )}
          </div>

          {/* Audit history */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
              <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                Audit History
              </span>
            </div>
            <div className="flex flex-col gap-0 rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              {contract.auditLog.map((entry, idx) => (
                <div key={idx}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{ borderBottom: idx < contract.auditLog.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--accent)' }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{entry.action}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{entry.actor}</span>
                      <span style={{ color: 'var(--text-4)' }}>·</span>
                      <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-4)' }}>{entry.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 shrink-0 flex flex-wrap gap-2"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
          {(contract.status === 'ready' || contract.status === 'draft') && (
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: '#a3e635', color: '#07070a' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}>
              <Send size={13} strokeWidth={2} />Send for Signature
            </button>
          )}
          {(contract.status === 'sent' || contract.status === 'viewed') && (
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.30)' }}>
              <RefreshCw size={13} strokeWidth={2} />Resend / Remind
            </button>
          )}
          {contract.status === 'signed' && (
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.28)' }}>
              <FileDown size={13} strokeWidth={2} />Download Signed
            </button>
          )}
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
            <FileDown size={13} strokeWidth={2} />Audit Trail
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
            <ExternalLink size={13} strokeWidth={2} />Open in Dropbox
          </button>
        </div>
      </div>
    </>
  )
}

const TABLE_COLS = [
  { label: 'Contract Name', width: 'auto'  },
  { label: 'Caterer',       width: '160px' },
  { label: 'Type',          width: '130px' },
  { label: 'Signatory',     width: '160px' },
  { label: 'Status',        width: '160px' },
  { label: 'Sent Date',     width: '110px' },
  { label: 'Actions',       width: '60px'  },
]

export function ContractManagement() {
  const [search, setSearch]               = useState('')
  const [filterCaterer, setFilterCaterer] = useState('')
  const [filterStatus, setFilterStatus]   = useState('')
  const [filterType, setFilterType]       = useState('')
  const [openMenuId, setOpenMenuId]       = useState<string | null>(null)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  const total          = CONTRACTS.length
  const pending        = CONTRACTS.filter(c => ['sent', 'viewed', 'partially_signed', 'ready'].includes(c.status)).length
  const signed         = CONTRACTS.filter(c => c.status === 'signed').length
  const declinedExpired = CONTRACTS.filter(c => ['declined', 'expired', 'cancelled', 'error'].includes(c.status)).length

  const filtered = CONTRACTS.filter(c => {
    if (filterCaterer && c.caterer !== filterCaterer) return false
    if (filterStatus  && c.status  !== filterStatus)  return false
    if (filterType    && c.type    !== filterType)    return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.caterer.toLowerCase().includes(q) &&
        !c.signatoryName.toLowerCase().includes(q) &&
        !c.type.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  const hasFilter = search || filterCaterer || filterStatus || filterType

  function resetFilters() {
    setSearch('')
    setFilterCaterer('')
    setFilterStatus('')
    setFilterType('')
  }

  function rowActions(c: Contract) {
    const actions: { label: string; icon: ReactElement; color?: string }[] = [
      { label: 'View Detail',           icon: <Eye        size={13} strokeWidth={1.8} /> },
      { label: 'Link to Module',        icon: <Puzzle     size={13} strokeWidth={1.8} /> },
      { label: 'Link to Fee Schedule',  icon: <DollarSign size={13} strokeWidth={1.8} /> },
      { label: 'View Audit',            icon: <History    size={13} strokeWidth={1.8} /> },
    ]
    if (c.status === 'ready' || c.status === 'draft') {
      actions.splice(1, 0, { label: 'Send for Signature', icon: <Send size={13} strokeWidth={1.8} /> })
    }
    if (c.status === 'sent' || c.status === 'viewed') {
      actions.splice(1, 0, { label: 'Resend / Remind', icon: <RefreshCw size={13} strokeWidth={1.8} /> })
    }
    if (!['draft', 'cancelled', 'expired'].includes(c.status)) {
      actions.push({ label: 'Cancel Contract', icon: <XCircle size={13} strokeWidth={1.8} />, color: '#f87171' })
    }
    if (c.status === 'signed') {
      actions.push({ label: 'Download Signed Doc', icon: <FileDown    size={13} strokeWidth={1.8} /> })
    }
    actions.push({ label: 'Open in Dropbox', icon: <ExternalLink size={13} strokeWidth={1.8} /> })
    return actions
  }

  return (
    <div className="p-4 lg:p-7 max-w-[1500px]">
      <PageHeader
        badge={{ icon: <FileSignature size={12} strokeWidth={2.5} />, label: 'Contract Management' }}
        title="Contract Management"
        subtitle="Manage Dropbox Sign contracts, track signature status, and link agreements to caterer modules."
        size="page"
        glowColor="rgba(163,230,53,0.06)"
        right={
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}>
            <Download size={13} strokeWidth={2} />Export
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Contracts"      value={total}          color="#60a5fa" icon={<FileText      size={16} strokeWidth={1.8} />} />
        <StatCard label="Pending Signature"    value={pending}        color="#fb923c" icon={<Clock         size={16} strokeWidth={1.8} />} />
        <StatCard label="Signed"               value={signed}         color="#4ade80" icon={<CheckCircle2  size={16} strokeWidth={1.8} />} />
        <StatCard label="Declined / Expired"   value={declinedExpired} color="#f87171" icon={<AlertTriangle size={15} strokeWidth={1.8} />} />
      </div>

      {/* Filter bar */}
      <div
        className="flex flex-wrap items-center gap-2.5 mb-5 rounded-2xl px-5 py-3.5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <Filter size={13} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />

        <div className="relative">
          <Search
            size={12} strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-4)' }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contracts…"
            className="pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none w-[180px]"
            style={{
              background: 'var(--bg-inner)',
              border: `1px solid ${search ? '#a3e63550' : 'var(--border-strong)'}`,
              color: 'var(--text-2)',
            }}
          />
        </div>

        <SelectFilter
          label="All Caterers"
          value={filterCaterer}
          onChange={setFilterCaterer}
          options={CATERERS_LIST.map(c => ({ value: c, label: c }))}
        />
        <SelectFilter
          label="All Statuses"
          value={filterStatus}
          onChange={setFilterStatus}
          options={Object.entries(STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))}
        />
        <SelectFilter
          label="All Types"
          value={filterType}
          onChange={setFilterType}
          options={CONTRACT_TYPES.map(t => ({ value: t, label: t }))}
        />

        <div className="flex items-center gap-2 flex-1 justify-end" style={{ minWidth: 'max-content' }}>
          {hasFilter && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer"
              style={{ color: 'var(--text-3)', background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.75' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}>
              <RotateCcw size={12} strokeWidth={2} />Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '900px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
                {TABLE_COLS.map(col => (
                  <th
                    key={col.label}
                    className="text-left px-4 py-3"
                    style={{ width: col.width, minWidth: col.width !== 'auto' ? col.width : undefined }}
                  >
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
                  <td colSpan={TABLE_COLS.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileSignature size={30} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>No contracts match your filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr
                    key={c.id}
                    className="transition-colors cursor-pointer"
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                    onClick={() => setSelectedContract(c)}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    {/* Contract name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <FilePen size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{c.name}</span>
                      </div>
                    </td>

                    {/* Caterer */}
                    <td className="px-4 py-3.5">
                      <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{c.caterer}</span>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <span
                        className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}
                      >
                        {c.type}
                      </span>
                    </td>

                    {/* Signatory */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{c.signatoryName}</span>
                        <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{c.signatoryEmail}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>

                    {/* Sent date */}
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
                        {c.sentDate ?? '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <DropdownMenu
                        open={openMenuId === c.id}
                        onToggle={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                        onClose={() => setOpenMenuId(null)}
                        actions={rowActions(c)}
                        minWidth="210px"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
            {filtered.length} contract{filtered.length !== 1 ? 's' : ''}{hasFilter ? ` (filtered from ${total})` : ''}
          </span>
          <div className="flex items-center gap-1.5">
            <Calendar size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
            <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Last sync: just now</span>
          </div>
        </div>
      </div>

      {/* Slide-over panel */}
      {selectedContract && (
        <SlideOver contract={selectedContract} onClose={() => setSelectedContract(null)} />
      )}
    </div>
  )
}
