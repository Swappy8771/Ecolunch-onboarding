import { useState } from 'react'
import {
  MessageCircle, CheckCircle2, Clock, AlertTriangle,
  Rocket, FileText, ClipboardEdit, BookOpen, Baby,
  Calculator, FileBarChart2, Building2, Scale, FilePen,
  ShieldCheck, User2, ChevronDown, ChevronUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────

type ConvStatus       = 'open' | 'waiting' | 'closed'
type DocLinkStatus    = 'approved' | 'under-review' | 'missing' | 'pending'
type CorrPriority     = 'critical' | 'high' | 'medium' | 'low'
type InitiatedBy      = 'caterer' | 'ecolunch'

interface LinkedDoc    { name: string; status: DocLinkStatus }
interface LinkedCorr   { title: string; priority: CorrPriority }
interface LinkedModule { label: string; color: string; Icon: LucideIcon }

interface Conversation {
  id: string
  name: string
  status: ConvStatus
  initiatedDate: string
  lastUpdated: string
  initiatedBy: InitiatedBy
  linkedModule: LinkedModule | null
  linkedDocument: LinkedDoc | null
  linkedCorrection: LinkedCorr | null
  isGoLiveBlocker: boolean
}

// ─── Meta maps ────────────────────────────────────────────────

const CONV_STATUS_META: Record<ConvStatus, {
  label: string; color: string; bg: string; border: string
}> = {
  open:    { label: 'Action Required',     color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.28)'  },
  waiting: { label: 'Awaiting Review',     color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.28)'  },
  closed:  { label: 'Resolved',            color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
}

const DOC_STATUS_META: Record<DocLinkStatus, { label: string; color: string }> = {
  approved:      { label: 'Approved',      color: '#4ade80' },
  'under-review':{ label: 'Under Review',  color: '#60a5fa' },
  missing:       { label: 'Missing',       color: '#f87171' },
  pending:       { label: 'Pending',       color: '#fbbf24' },
}

const CORR_PRIORITY_META: Record<CorrPriority, { label: string; color: string }> = {
  critical: { label: 'Critical', color: '#f87171' },
  high:     { label: 'High',     color: '#fb923c' },
  medium:   { label: 'Medium',   color: '#fbbf24' },
  low:      { label: 'Low',      color: '#60a5fa' },
}

const LEFT_BORDER: Record<ConvStatus, string> = {
  open:    '#fbbf24',
  waiting: '#60a5fa',
  closed:  '#4ade80',
}

// ─── Module definitions ───────────────────────────────────────

const MOD = {
  schoolMeals: { label: 'School Meals',   color: '#4ade80', Icon: BookOpen      },
  daycare:     { label: 'Daycare / CPE',  color: '#60a5fa', Icon: Baby          },
  accounting:  { label: 'Accounting',     color: '#fb923c', Icon: Calculator    },
  reportiq:    { label: 'ReportIQ',       color: '#a3e635', Icon: FileBarChart2 },
  banking:     { label: 'Banking',        color: '#a78bfa', Icon: Building2     },
  legal:       { label: 'Legal',          color: '#60a5fa', Icon: Scale         },
  compliance:  { label: 'Compliance',     color: '#fbbf24', Icon: ShieldCheck   },
  contracts:   { label: 'Contracts',      color: '#c084fc', Icon: FilePen       },
  profile:     { label: 'Profile',        color: '#a78bfa', Icon: User2         },
} as const

// ─── Conversations data ───────────────────────────────────────

const CONVERSATIONS: Conversation[] = [
  // ── Open — caterer action required ──────────────────────────
  {
    id: 'el1',
    name: 'Allergen Protocol — Format Clarification',
    status: 'open', initiatedBy: 'ecolunch',
    initiatedDate: '2025-09-08', lastUpdated: '2025-09-10',
    linkedModule: MOD.schoolMeals,
    linkedDocument: { name: 'Allergen Protocol — Schools', status: 'missing' },
    linkedCorrection: { title: 'Format does not match EcoLunch template', priority: 'critical' },
    isGoLiveBlocker: true,
  },
  {
    id: 'el2',
    name: 'Annual Financial Report — File Format',
    status: 'open', initiatedBy: 'ecolunch',
    initiatedDate: '2025-09-06', lastUpdated: '2025-09-09',
    linkedModule: MOD.accounting,
    linkedDocument: { name: 'Annual Financial Report', status: 'missing' },
    linkedCorrection: { title: 'Must be a native digital PDF, not an image scan', priority: 'high' },
    isGoLiveBlocker: true,
  },
  {
    id: 'el3',
    name: 'Infant Nutrition Protocol — Age Range Labels',
    status: 'open', initiatedBy: 'ecolunch',
    initiatedDate: '2025-09-05', lastUpdated: '2025-09-08',
    linkedModule: MOD.daycare,
    linkedDocument: { name: 'Infant Nutrition Protocol', status: 'missing' },
    linkedCorrection: { title: 'Age range labels missing for 6–12 month category', priority: 'high' },
    isGoLiveBlocker: true,
  },
  {
    id: 'el4',
    name: 'Rotating Cycle — Required File Format',
    status: 'open', initiatedBy: 'ecolunch',
    initiatedDate: '2025-09-07', lastUpdated: '2025-09-07',
    linkedModule: MOD.schoolMeals,
    linkedDocument: { name: 'Rotating Cycle Document', status: 'missing' },
    linkedCorrection: { title: 'File must be PDF or XLSX, not an image', priority: 'high' },
    isGoLiveBlocker: true,
  },
  {
    id: 'el5',
    name: 'Banking Authorization Letter — Signature',
    status: 'open', initiatedBy: 'ecolunch',
    initiatedDate: '2025-09-04', lastUpdated: '2025-09-06',
    linkedModule: MOD.banking,
    linkedDocument: { name: 'Banking Authorization Letter', status: 'under-review' },
    linkedCorrection: { title: 'Signature missing on page 3', priority: 'medium' },
    isGoLiveBlocker: false,
  },
  {
    id: 'el6',
    name: 'Closure Calendar Submission — CPE Arc-en-Ciel',
    status: 'open', initiatedBy: 'ecolunch',
    initiatedDate: '2025-09-03', lastUpdated: '2025-09-05',
    linkedModule: MOD.daycare,
    linkedDocument: { name: 'CPE Arc-en-Ciel Closure Calendar', status: 'missing' },
    linkedCorrection: null,
    isGoLiveBlocker: false,
  },

  // ── Waiting — awaiting EcoLunch review ──────────────────────
  {
    id: 'el7',
    name: 'Articles of Association — Updated Version',
    status: 'waiting', initiatedBy: 'caterer',
    initiatedDate: '2025-08-28', lastUpdated: '2025-09-09',
    linkedModule: MOD.legal,
    linkedDocument: { name: 'Articles of Association', status: 'under-review' },
    linkedCorrection: null,
    isGoLiveBlocker: false,
  },
  {
    id: 'el8',
    name: 'CPE Service Agreement — Countersignature',
    status: 'waiting', initiatedBy: 'caterer',
    initiatedDate: '2025-08-26', lastUpdated: '2025-09-08',
    linkedModule: MOD.daycare,
    linkedDocument: { name: 'CPE Service Agreement', status: 'under-review' },
    linkedCorrection: { title: 'Missing countersignature from CPE director', priority: 'medium' },
    isGoLiveBlocker: false,
  },
  {
    id: 'el9',
    name: 'Health Inspection Certificate — Renewal',
    status: 'waiting', initiatedBy: 'caterer',
    initiatedDate: '2025-08-20', lastUpdated: '2025-09-06',
    linkedModule: MOD.compliance,
    linkedDocument: { name: 'Health Inspection Certificate', status: 'under-review' },
    linkedCorrection: { title: 'Certificate was expired — renewal submitted', priority: 'high' },
    isGoLiveBlocker: false,
  },
  {
    id: 'el10',
    name: 'Master Service Agreement — Signature Process',
    status: 'waiting', initiatedBy: 'caterer',
    initiatedDate: '2025-09-06', lastUpdated: '2025-09-09',
    linkedModule: MOD.contracts,
    linkedDocument: null,
    linkedCorrection: null,
    isGoLiveBlocker: true,
  },

  // ── Closed ───────────────────────────────────────────────────
  {
    id: 'el11',
    name: 'NDA — Signing Process',
    status: 'closed', initiatedBy: 'ecolunch',
    initiatedDate: '2025-08-18', lastUpdated: '2025-08-22',
    linkedModule: MOD.contracts,
    linkedDocument: { name: 'Non-Disclosure Agreement', status: 'approved' },
    linkedCorrection: null,
    isGoLiveBlocker: false,
  },
  {
    id: 'el12',
    name: 'Company Logo — Resolution Requirement',
    status: 'closed', initiatedBy: 'ecolunch',
    initiatedDate: '2025-08-10', lastUpdated: '2025-08-14',
    linkedModule: MOD.profile,
    linkedDocument: { name: 'Company Logo', status: 'approved' },
    linkedCorrection: null,
    isGoLiveBlocker: false,
  },
  {
    id: 'el13',
    name: 'RIB — Legibility Correction',
    status: 'closed', initiatedBy: 'ecolunch',
    initiatedDate: '2025-08-12', lastUpdated: '2025-08-16',
    linkedModule: MOD.banking,
    linkedDocument: { name: 'RIB — Relevé d\'Identité Bancaire', status: 'approved' },
    linkedCorrection: { title: 'Bank details illegible in original scan', priority: 'medium' },
    isGoLiveBlocker: false,
  },
  {
    id: 'el14',
    name: 'KBIS Extract — Date Update',
    status: 'closed', initiatedBy: 'ecolunch',
    initiatedDate: '2025-08-15', lastUpdated: '2025-08-19',
    linkedModule: MOD.legal,
    linkedDocument: { name: 'KBIS Extract', status: 'approved' },
    linkedCorrection: { title: 'Extract was more than 3 months old', priority: 'high' },
    isGoLiveBlocker: false,
  },
  {
    id: 'el15',
    name: 'ReportIQ Integration Setup',
    status: 'closed', initiatedBy: 'caterer',
    initiatedDate: '2025-08-25', lastUpdated: '2025-09-03',
    linkedModule: MOD.reportiq,
    linkedDocument: null,
    linkedCorrection: null,
    isGoLiveBlocker: false,
  },
  {
    id: 'el16',
    name: 'School Menu Format Questions',
    status: 'closed', initiatedBy: 'caterer',
    initiatedDate: '2025-08-30', lastUpdated: '2025-09-02',
    linkedModule: MOD.schoolMeals,
    linkedDocument: null,
    linkedCorrection: null,
    isGoLiveBlocker: false,
  },
]

// ─── Conversation card ────────────────────────────────────────

function ConversationCard({ conv }: { conv: Conversation }) {
  const sm  = CONV_STATUS_META[conv.status]
  const isClosed = conv.status === 'closed'

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${LEFT_BORDER[conv.status]}`,
        opacity: isClosed ? 0.88 : 1,
      }}>
      <div className="px-5 py-4 flex flex-col gap-3">

        {/* ── Header row ─────────────────── */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3 min-w-0">
            {/* Status dot */}
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: sm.bg, border: `1px solid ${sm.border}` }}>
              {conv.status === 'open'    && <AlertTriangle  size={13} strokeWidth={2}   style={{ color: sm.color }} />}
              {conv.status === 'waiting' && <Clock          size={12} strokeWidth={2}   style={{ color: sm.color }} />}
              {conv.status === 'closed'  && <CheckCircle2   size={13} strokeWidth={1.8} style={{ color: sm.color }} />}
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-black leading-snug" style={{ color: 'var(--text-1)' }}>
                {conv.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap text-[11px]" style={{ color: 'var(--text-4)' }}>
                <span>
                  {conv.initiatedBy === 'ecolunch' ? 'Raised by EcoLunch' : 'Raised by you'}
                </span>
                <span style={{ color: 'var(--border-strong)' }}>·</span>
                <span>Started {conv.initiatedDate}</span>
                <span style={{ color: 'var(--border-strong)' }}>·</span>
                <span>Updated {conv.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
            style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}>
            {sm.label}
          </span>
        </div>

        {/* ── Linked items ───────────────── */}
        {(conv.linkedModule || conv.linkedDocument || conv.linkedCorrection || conv.isGoLiveBlocker) && (
          <div className="flex items-start gap-2 flex-wrap pt-0.5">

            {/* Module */}
            {conv.linkedModule && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl"
                style={{
                  background: `${conv.linkedModule.color}14`,
                  color: conv.linkedModule.color,
                  border: `1px solid ${conv.linkedModule.color}28`,
                }}>
                <conv.linkedModule.Icon size={11} strokeWidth={2} />
                {conv.linkedModule.label}
              </span>
            )}

            {/* Linked Document */}
            {conv.linkedDocument && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl"
                style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
                <FileText size={11} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                <span className="truncate max-w-[160px]">{conv.linkedDocument.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-px rounded shrink-0"
                  style={{
                    background: `${DOC_STATUS_META[conv.linkedDocument.status].color}18`,
                    color: DOC_STATUS_META[conv.linkedDocument.status].color,
                  }}>
                  {DOC_STATUS_META[conv.linkedDocument.status].label}
                </span>
              </span>
            )}

            {/* Linked Correction */}
            {conv.linkedCorrection && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl"
                style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
                <ClipboardEdit size={11} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                <span className="truncate max-w-[160px]">{conv.linkedCorrection.title}</span>
                <span className="text-[10px] font-bold px-1.5 py-px rounded shrink-0"
                  style={{
                    background: `${CORR_PRIORITY_META[conv.linkedCorrection.priority].color}18`,
                    color: CORR_PRIORITY_META[conv.linkedCorrection.priority].color,
                  }}>
                  {CORR_PRIORITY_META[conv.linkedCorrection.priority].label}
                </span>
              </span>
            )}

            {/* Go-Live Blocker flag */}
            {conv.isGoLiveBlocker && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                <Rocket size={11} strokeWidth={2} />
                Go-Live Blocker
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section divider ──────────────────────────────────────────

function SectionDivider({ label, count, color, bg }: {
  label: string; count: number; color: string; bg: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap"
        style={{ color }}>
        {label}
        <span className="px-2 py-0.5 rounded-full text-[11px] font-black"
          style={{ background: bg, color }}>
          {count}
        </span>
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
    </div>
  )
}

// ─── Closed section (collapsible) ────────────────────────────

function ClosedSection({ conversations }: { conversations: Conversation[] }) {
  const [open, setOpen] = useState(false)
  if (conversations.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <SectionDivider
        label="Resolved Conversations"
        count={conversations.length}
        color="#4ade80"
        bg="rgba(74,222,128,0.15)"
      />
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80 w-full text-left"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}>
        <CheckCircle2 size={13} strokeWidth={1.8} style={{ color: '#4ade80' }} />
        {open ? 'Hide' : 'Show'} {conversations.length} resolved conversation{conversations.length > 1 ? 's' : ''}
        {open
          ? <ChevronUp   size={13} strokeWidth={2} style={{ color: 'var(--text-4)', marginLeft: 'auto' }} />
          : <ChevronDown size={13} strokeWidth={2} style={{ color: 'var(--text-4)', marginLeft: 'auto' }} />}
      </button>
      {open && (
        <div className="flex flex-col gap-3">
          {conversations.map(c => <ConversationCard key={c.id} conv={c} />)}
        </div>
      )}
    </div>
  )
}

// ─── Summary bar ─────────────────────────────────────────────

function SummaryBar({ conversations }: { conversations: Conversation[] }) {
  const open      = conversations.filter(c => c.status === 'open').length
  const waiting   = conversations.filter(c => c.status === 'waiting').length
  const closed    = conversations.filter(c => c.status === 'closed').length
  const blockers  = conversations.filter(c => c.isGoLiveBlocker && c.status !== 'closed').length
  const withCorr  = conversations.filter(c => c.linkedCorrection && c.status !== 'closed').length

  const stats: { label: string; value: number; color: string; bg: string; border: string }[] = [
    { label: 'Action Required',  value: open,    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.28)'  },
    { label: 'Awaiting Review',  value: waiting, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.28)'  },
    { label: 'Resolved',         value: closed,  color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
    { label: 'Go-Live Linked',   value: blockers,color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
    { label: 'With Corrections', value: withCorr,color: '#fb923c', bg: 'rgba(251,146,60,0.10)',  border: 'rgba(251,146,60,0.25)'  },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map(s => (
        <div key={s.label} className="flex flex-col items-center px-4 py-3.5 rounded-xl text-center"
          style={{ background: s.bg, border: `1px solid ${s.border}` }}>
          <span className="text-[22px] font-black leading-none" style={{ color: s.color }}>{s.value}</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wide" style={{ color: s.color }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────

function EmptySection({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <MessageCircle size={14} strokeWidth={1.5} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
      <p className="text-[12px] italic" style={{ color: 'var(--text-4)' }}>No {label}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function ClientEcoloopPage() {
  const open    = CONVERSATIONS.filter(c => c.status === 'open')
  const waiting = CONVERSATIONS.filter(c => c.status === 'waiting')
  const closed  = CONVERSATIONS.filter(c => c.status === 'closed')

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Header ───────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Client Portal / EcoLoop
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
          EcoLoop Conversations
        </h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
          EcoLunch onboarding conversations linked to your modules, documents, corrections, and go-live status.
        </p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">

        {/* ── Summary ─────────────────── */}
        <SummaryBar conversations={CONVERSATIONS} />

        {/* ── Action Required ─────────── */}
        <SectionDivider
          label="Action Required"
          count={open.length}
          color="#fbbf24"
          bg="rgba(251,191,36,0.15)"
        />
        {open.length > 0
          ? open.map(c => <ConversationCard key={c.id} conv={c} />)
          : <EmptySection label="conversations requiring action" />}

        {/* ── Awaiting EcoLunch Review ── */}
        <SectionDivider
          label="Awaiting EcoLunch Review"
          count={waiting.length}
          color="#60a5fa"
          bg="rgba(96,165,250,0.15)"
        />
        {waiting.length > 0
          ? waiting.map(c => <ConversationCard key={c.id} conv={c} />)
          : <EmptySection label="conversations awaiting review" />}

        {/* ── Resolved ────────────────── */}
        <ClosedSection conversations={closed} />

        <div className="h-4" />
      </div>
    </div>
  )
}
