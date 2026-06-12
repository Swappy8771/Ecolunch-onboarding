import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  MessageCircle, Search, Plus, Send, X, ChevronDown,
  AlertTriangle, CheckCircle2, Clock, FileText,
  FolderLock, Rocket, Zap, RotateCcw,
  UserCheck,
} from 'lucide-react'
import { PageHeader } from '../../../shared/components/PageHeader'
import { SelectFilter } from '../../../shared/components/SelectFilter'

/* ── Types ──────────────────────────────────────────────────────── */
type TicketType  = 'correction' | 'document' | 'contract' | 'smart-import' | 'go-live' | 'general'
type Priority    = 'critical' | 'high' | 'medium' | 'low'
type TicketStatus= 'open' | 'awaiting-response' | 'in-progress' | 'resolved' | 'closed'
type EntryKind   = 'client' | 'admin' | 'internal' | 'system'

interface ThreadEntry {
  id: string
  kind: EntryKind
  author: string
  text: string
  time: string
}

interface Ticket {
  id: string
  title: string
  caterer: string
  type: TicketType
  priority: Priority
  status: TicketStatus
  created: string
  lastActivity: string
  assignee: string
  linkedDoc?: string
  linkedContract?: string
  linkedGoLive?: boolean
  thread: ThreadEntry[]
}

/* ── Mock data ──────────────────────────────────────────────────── */
const TICKETS: Ticket[] = [
  {
    id: 'ECO-001', title: 'IBAN validation failed — resubmit required',
    caterer: 'FL', type: 'correction', priority: 'critical', status: 'open',
    created: '2026-06-05', lastActivity: '2h ago', assignee: 'Elise Bouchard',
    linkedDoc: 'banking_void_cheque.pdf',
    thread: [
      { id: 't1', kind: 'system',   author: 'System',         text: 'Validation failed: IBAN format does not match CA standard.',          time: '2026-06-05 09:14' },
      { id: 't2', kind: 'admin',    author: 'Elise Bouchard', text: 'Hugo, please resubmit your void cheque — the IBAN was rejected.',     time: '2026-06-05 09:30' },
      { id: 't3', kind: 'client',   author: 'Hugo Bernier',   text: 'My bank said this is the correct number. Can you clarify?',           time: '2026-06-05 11:45' },
      { id: 't4', kind: 'internal', author: 'Elise Bouchard', text: 'Internal note: client insisting — escalate to compliance team.',      time: '2026-06-05 12:00' },
    ],
  },
  {
    id: 'ECO-002', title: 'Menus week 3–4 allergen matrix missing',
    caterer: 'Concept Gourmet', type: 'document', priority: 'high', status: 'awaiting-response',
    created: '2026-06-04', lastActivity: '4h ago', assignee: 'Sandrine Lavoie',
    linkedDoc: 'menu_cycle_a.pdf',
    thread: [
      { id: 't1', kind: 'admin',  author: 'Sandrine Lavoie', text: 'The allergen matrix for weeks 3 and 4 is missing from the menu submission.', time: '2026-06-04 10:00' },
      { id: 't2', kind: 'client', author: 'Elise Bouchard',  text: "We'll upload it by end of day tomorrow.",                                     time: '2026-06-04 14:30' },
    ],
  },
  {
    id: 'ECO-003', title: 'Master Services Agreement — signatory name mismatch',
    caterer: 'FL', type: 'contract', priority: 'high', status: 'in-progress',
    created: '2026-06-03', lastActivity: '1d ago', assignee: 'Hugo Bernier',
    linkedContract: 'MSA_FL_draft.pdf',
    thread: [
      { id: 't1', kind: 'system',   author: 'System',       text: 'Dropbox Sign: signature_request_declined — reason: name mismatch.',          time: '2026-06-03 09:00' },
      { id: 't2', kind: 'admin',    author: 'Hugo Bernier',  text: 'The legal name on the contract differs from the NEQ registration. Please confirm the correct signatory.', time: '2026-06-03 09:30' },
      { id: 't3', kind: 'client',   author: 'Hugo Bernier',  text: 'The correct legal name is Fédération Lavoie Inc. — not FL Catering.',       time: '2026-06-03 13:00' },
      { id: 't4', kind: 'internal', author: 'Hugo Bernier',  text: 'Updating template with correct legal name — resending this week.',          time: '2026-06-03 13:15' },
    ],
  },
  {
    id: 'ECO-004', title: 'Go-live blocked — insurance certificate expired',
    caterer: 'Les Saveurs', type: 'go-live', priority: 'critical', status: 'open',
    created: '2026-06-06', lastActivity: '30m ago', assignee: 'Elise Bouchard',
    linkedDoc: 'insurance_cert_v1.pdf', linkedGoLive: true,
    thread: [
      { id: 't1', kind: 'system', author: 'System',         text: 'Go-live blocked: insurance certificate expired 2026-05-31.',              time: '2026-06-06 08:00' },
      { id: 't2', kind: 'admin',  author: 'Elise Bouchard', text: 'Sandrine, your Go-live is blocked until a valid insurance certificate is submitted.', time: '2026-06-06 08:15' },
    ],
  },
  {
    id: 'ECO-005', title: 'Acomba import — 3 product codes unresolved',
    caterer: 'MSN', type: 'smart-import', priority: 'medium', status: 'in-progress',
    created: '2026-06-01', lastActivity: '2d ago', assignee: 'Sandrine Lavoie',
    linkedDoc: 'acomba_week12.csv',
    thread: [
      { id: 't1', kind: 'system', author: 'System',          text: 'Smart Import: 3 product codes could not be mapped to EcoLunch catalog.',  time: '2026-06-01 11:00' },
      { id: 't2', kind: 'admin',  author: 'Sandrine Lavoie', text: 'Please provide the correct catalog codes for: COD-441, COD-882, COD-993.', time: '2026-06-01 11:30' },
      { id: 't3', kind: 'client', author: 'MSN Admin',       text: 'COD-441 = Saumon grillé, COD-882 = Poulet rôti, COD-993 = Lasagne veg.',  time: '2026-06-02 09:45' },
    ],
  },
  {
    id: 'ECO-006', title: 'Establishments list — 2 CPE addresses incorrect',
    caterer: 'Café Réseau', type: 'correction', priority: 'medium', status: 'awaiting-response',
    created: '2026-06-03', lastActivity: '3d ago', assignee: 'Hugo Bernier',
    thread: [
      { id: 't1', kind: 'admin',    author: 'Hugo Bernier',   text: 'CPE Soleil and CPE Montagne have incorrect postal codes in your establishment list.', time: '2026-06-03 14:00' },
      { id: 't2', kind: 'internal', author: 'Hugo Bernier',   text: 'Client slow to respond — follow up by phone if no reply by Friday.',               time: '2026-06-03 14:05' },
    ],
  },
  {
    id: 'ECO-007', title: 'Module annex not signed — Go-live dependency',
    caterer: 'Les Saveurs', type: 'contract', priority: 'high', status: 'open',
    created: '2026-06-05', lastActivity: '1d ago', assignee: 'Elise Bouchard',
    linkedContract: 'module_annex_camps.pdf', linkedGoLive: true,
    thread: [
      { id: 't1', kind: 'system', author: 'System',         text: 'Go-live dependency: Module Annex — Camp Meals not signed.',                time: '2026-06-05 09:00' },
      { id: 't2', kind: 'admin',  author: 'Elise Bouchard', text: 'Resending the Camp Meals module annex for signature via Dropbox Sign.',   time: '2026-06-05 09:30' },
    ],
  },
  {
    id: 'ECO-008', title: 'Profile correction — signatory title mismatch',
    caterer: 'ABC Catering', type: 'correction', priority: 'low', status: 'resolved',
    created: '2026-05-28', lastActivity: '5d ago', assignee: 'Sandrine Lavoie',
    thread: [
      { id: 't1', kind: 'admin',  author: 'Sandrine Lavoie', text: 'The signatory title on your profile says "Directeur" but the NEQ shows "Président".',  time: '2026-05-28 10:00' },
      { id: 't2', kind: 'client', author: 'Luc Tremblay',    text: "Corrected — I'm both but \"Président\" is the legal title.",                        time: '2026-05-29 09:00' },
      { id: 't3', kind: 'admin',  author: 'Sandrine Lavoie', text: 'Validated and updated. Ticket resolved.',                                              time: '2026-05-29 10:00' },
      { id: 't4', kind: 'system', author: 'System',          text: 'Ticket resolved by Sandrine Lavoie.',                                                  time: '2026-05-29 10:01' },
    ],
  },
  {
    id: 'ECO-009', title: 'DPA contract expired — needs resend',
    caterer: 'Brasserie Nord', type: 'contract', priority: 'medium', status: 'in-progress',
    created: '2026-06-02', lastActivity: '6h ago', assignee: 'Hugo Bernier',
    linkedContract: 'DPA_BN_v1.pdf',
    thread: [
      { id: 't1', kind: 'system', author: 'System',       text: 'Dropbox Sign: signature_request_expired.',                                 time: '2026-04-01 00:00' },
      { id: 't2', kind: 'admin',  author: 'Hugo Bernier',  text: 'Resending DPA with 30-day signing window. Please sign at your earliest.', time: '2026-06-02 09:00' },
    ],
  },
  {
    id: 'ECO-010', title: 'Banking letter format not accepted',
    caterer: 'Café Réseau', type: 'document', priority: 'high', status: 'open',
    created: '2026-06-06', lastActivity: '1h ago', assignee: 'Elise Bouchard',
    linkedDoc: 'bank_letter_draft.pdf',
    thread: [
      { id: 't1', kind: 'admin',    author: 'Elise Bouchard', text: 'The banking letter is a screenshot, not an official letter. Please provide the original PDF from your bank.', time: '2026-06-06 10:00' },
      { id: 't2', kind: 'internal', author: 'Elise Bouchard', text: 'Third time this caterer submits a screenshot — may need a call.',                                            time: '2026-06-06 10:02' },
    ],
  },
]

/* ── Style maps ─────────────────────────────────────────────────── */
const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#f87171', bg: 'rgba(248,113,113,0.14)' },
  high:     { label: 'High',     color: '#fb923c', bg: 'rgba(251,146,60,0.14)'  },
  medium:   { label: 'Medium',   color: '#fbbf24', bg: 'rgba(251,191,36,0.14)'  },
  low:      { label: 'Low',      color: '#34d399', bg: 'rgba(52,211,153,0.14)'  },
}

const STATUS_META: Record<TicketStatus, { label: string; color: string }> = {
  'open':              { label: 'Open',              color: '#60a5fa' },
  'awaiting-response': { label: 'Awaiting Response', color: '#fbbf24' },
  'in-progress':       { label: 'In Progress',       color: '#a78bfa' },
  'resolved':          { label: 'Resolved',          color: '#4ade80' },
  'closed':            { label: 'Closed',            color: 'var(--text-4)' },
}

const TYPE_ICON: Record<TicketType, ReactNode> = {
  correction:    <RotateCcw    size={12} strokeWidth={2} />,
  document:      <FolderLock   size={12} strokeWidth={2} />,
  contract:      <FileText     size={12} strokeWidth={2} />,
  'smart-import':<Zap          size={12} strokeWidth={2} />,
  'go-live':     <Rocket       size={12} strokeWidth={2} />,
  general:       <MessageCircle size={12} strokeWidth={2} />,
}

/* ── Small components ───────────────────────────────────────────── */
function PriorityBadge({ p }: { p: Priority }) {
  const m = PRIORITY_META[p]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
      style={{ background: m.bg, color: m.color }}>
      {m.label}
    </span>
  )
}

function StatusDot({ s }: { s: TicketStatus }) {
  return <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_META[s].color }} />
}

/* ── Create ticket modal ────────────────────────────────────────── */
function CreateModal({ onClose }: { onClose: () => void }) {
  const caterers = ['Concept Gourmet', 'FL', 'MSN', 'ABC Catering', 'Brasserie Nord', 'Café Réseau', 'Les Saveurs']
  const typeOptions: TicketType[] = ['correction', 'document', 'contract', 'smart-import', 'go-live', 'general']
  const priorities: Priority[] = ['critical', 'high', 'medium', 'low']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>Create Ticket</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-3)' }}>
            <X size={13} strokeWidth={2} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {[
            { label: 'Title', el: <input placeholder="Ticket title…" className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} /> },
          ].map(({ label, el }) => (
            <div key={label}>
              <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>{label}</label>
              {el}
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3">
            {(['Caterer', 'Type', 'Priority'] as const).map((label) => (
              <div key={label}>
                <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>{label}</label>
                <div className="relative">
                  <select className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl text-[12.5px] outline-none cursor-pointer"
                    style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-3)' }}>
                    <option value="">Select…</option>
                    {label === 'Caterer' && caterers.map(c => <option key={c}>{c}</option>)}
                    {label === 'Type'    && typeOptions.map(t => <option key={t}>{t}</option>)}
                    {label === 'Priority' && priorities.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={11} strokeWidth={2} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Description</label>
            <textarea rows={3} placeholder="Describe the issue…" className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
          </div>
        </div>
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid var(--border-default)' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            Cancel
          </button>
          <button className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-2"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Plus size={13} strokeWidth={2} /> Create Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Thread bubble ──────────────────────────────────────────────── */
function Bubble({ entry }: { entry: ThreadEntry }) {
  if (entry.kind === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="px-3 py-1 rounded-full text-[11px]"
          style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
          {entry.text} · {entry.time}
        </span>
      </div>
    )
  }

  const isClient   = entry.kind === 'client'
  const isInternal = entry.kind === 'internal'

  return (
    <div className={`flex gap-2 mb-3 ${isClient ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1"
        style={{ background: isClient ? 'var(--accent-dim)' : isInternal ? 'rgba(251,191,36,0.18)' : 'var(--bg-inner)', color: isClient ? 'var(--accent)' : isInternal ? '#fbbf24' : 'var(--text-3)', border: `1px solid ${isClient ? 'var(--accent-border)' : isInternal ? 'rgba(251,191,36,0.3)' : 'var(--border-strong)'}` }}>
        {entry.author.charAt(0)}
      </div>
      <div className={`max-w-[80%] ${isClient ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold" style={{ color: 'var(--text-3)' }}>{entry.author}</span>
          <span className="text-[10px]" style={{ color: 'var(--text-4)' }}>{entry.time}</span>
          {isInternal && <span className="text-[9.5px] px-1.5 py-0.5 rounded-md font-bold" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>Internal</span>}
        </div>
        <div className="px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed"
          style={{
            background: isClient ? 'var(--accent-dim)' : isInternal ? 'rgba(251,191,36,0.08)' : 'var(--bg-card)',
            color: isClient ? 'var(--accent)' : 'var(--text-1)',
            border: `1px solid ${isClient ? 'var(--accent-border)' : isInternal ? 'rgba(251,191,36,0.2)' : 'var(--border-default)'}`,
            borderRadius: isClient ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          }}>
          {entry.text}
        </div>
      </div>
    </div>
  )
}

/* ── Detail panel ───────────────────────────────────────────────── */
function DetailPanel({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const [reply, setReply]       = useState('')
  const [isNote, setIsNote]     = useState(false)
  const [priority, setPriority] = useState<Priority>(ticket.priority)
  const [status, setStatus]     = useState<TicketStatus>(ticket.status)
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight
  }, [ticket.id])

  const prioOptions: Priority[]       = ['critical', 'high', 'medium', 'low']
  const statusOptions: TicketStatus[] = ['open', 'awaiting-response', 'in-progress', 'resolved', 'closed']

  return (
    <div className="flex flex-col h-full" style={{ borderLeft: '1px solid var(--border-default)' }}>
      <div className="px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg" style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}>{ticket.id}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px]" style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                {TYPE_ICON[ticket.type]} {ticket.type}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-lg" style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>{ticket.caterer}</span>
            </div>
            <div className="text-[15px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>{ticket.title}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer shrink-0 mt-1"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-3)' }}>
            <X size={13} strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-lg text-[11px] font-bold outline-none cursor-pointer"
              style={{ background: PRIORITY_META[priority].bg, color: PRIORITY_META[priority].color }}>
              {prioOptions.map(p => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
            </select>
            <ChevronDown size={9} strokeWidth={2.5} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: PRIORITY_META[priority].color }} />
          </div>
          <div className="relative">
            <select value={status} onChange={e => setStatus(e.target.value as TicketStatus)}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-lg text-[11px] font-semibold outline-none cursor-pointer"
              style={{ background: 'var(--bg-inner)', color: STATUS_META[status].color, border: '1px solid var(--border-strong)' }}>
              {statusOptions.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
            </select>
            <ChevronDown size={9} strokeWidth={2.5} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
          </div>
          {ticket.linkedDoc && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px]"
              style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
              <FolderLock size={10} strokeWidth={2} /> {ticket.linkedDoc}
            </span>
          )}
          {ticket.linkedContract && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px]"
              style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
              <FileText size={10} strokeWidth={2} /> {ticket.linkedContract}
            </span>
          )}
          {ticket.linkedGoLive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px]"
              style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)' }}>
              <Rocket size={10} strokeWidth={2} /> Go-live blocker
            </span>
          )}
          <span className="ml-auto text-[11px]" style={{ color: 'var(--text-4)' }}>
            <UserCheck size={11} strokeWidth={2} className="inline mr-1" />{ticket.assignee}
          </span>
        </div>
      </div>

      <div ref={threadRef} className="flex-1 overflow-y-auto px-5 py-4">
        {ticket.thread.map(e => <Bubble key={e.id} entry={e} />)}
      </div>

      <div className="px-5 py-4 shrink-0" style={{ borderTop: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setIsNote(false)}
            className="px-3 py-1 rounded-lg text-[11.5px] font-semibold cursor-pointer"
            style={{ background: !isNote ? 'var(--accent-dim)' : 'var(--bg-inner)', color: !isNote ? 'var(--accent)' : 'var(--text-4)', border: `1px solid ${!isNote ? 'var(--accent-border)' : 'var(--border-strong)'}` }}>
            Reply
          </button>
          <button onClick={() => setIsNote(true)}
            className="px-3 py-1 rounded-lg text-[11.5px] font-semibold cursor-pointer"
            style={{ background: isNote ? 'rgba(251,191,36,0.15)' : 'var(--bg-inner)', color: isNote ? '#fbbf24' : 'var(--text-4)', border: `1px solid ${isNote ? 'rgba(251,191,36,0.3)' : 'var(--border-strong)'}` }}>
            Internal Note
          </button>
        </div>
        <div className="flex gap-2">
          <textarea rows={2} value={reply} onChange={e => setReply(e.target.value)}
            placeholder={isNote ? 'Add an internal note…' : 'Type a reply…'}
            className="flex-1 px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none"
            style={{ background: 'var(--bg-inner)', border: `1px solid ${isNote ? 'rgba(251,191,36,0.3)' : 'var(--border-strong)'}`, color: 'var(--text-1)' }} />
          <button className="px-4 py-2 rounded-xl flex items-center justify-center cursor-pointer shrink-0"
            style={{ background: reply.trim() ? 'var(--accent)' : 'var(--bg-inner)', color: reply.trim() ? '#07070a' : 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
            <Send size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */
export function EcoLoopOnboarding() {
  const [search, setSearch]         = useState('')
  const [filterCaterer, setFilterCaterer] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterStatus, setFilterStatus]   = useState('')
  const [selected, setSelected]     = useState<Ticket | null>(TICKETS[0])
  const [showCreate, setShowCreate] = useState(false)

  const openCount     = TICKETS.filter(t => t.status === 'open' || t.status === 'in-progress').length
  const criticalCount = TICKETS.filter(t => t.priority === 'critical' || t.priority === 'high').length
  const awaitingCount = TICKETS.filter(t => t.status === 'awaiting-response').length
  const resolvedCount = TICKETS.filter(t => t.status === 'resolved').length

  const filtered = TICKETS.filter(t => {
    const q = search.toLowerCase()
    const matchSearch   = !q || t.title.toLowerCase().includes(q) || t.caterer.toLowerCase().includes(q)
    const matchCaterer  = !filterCaterer  || t.caterer === filterCaterer
    const matchPriority = !filterPriority || t.priority === filterPriority
    const matchStatus   = !filterStatus   || t.status === filterStatus
    return matchSearch && matchCaterer && matchPriority && matchStatus
  })

  const catererOptions = [...new Set(TICKETS.map(t => t.caterer))].map(c => ({ value: c, label: c }))
  const priorityOptions: { value: Priority; label: string }[] = [
    { value: 'critical', label: 'Critical' },
    { value: 'high',     label: 'High'     },
    { value: 'medium',   label: 'Medium'   },
    { value: 'low',      label: 'Low'      },
  ]
  const statusOptions: { value: TicketStatus; label: string }[] = [
    { value: 'open',              label: 'Open'              },
    { value: 'awaiting-response', label: 'Awaiting Response' },
    { value: 'in-progress',       label: 'In Progress'       },
    { value: 'resolved',          label: 'Resolved'          },
    { value: 'closed',            label: 'Closed'            },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-7 max-w-[1400px] shrink-0">
        <PageHeader
          badge={{ icon: <MessageCircle size={13} strokeWidth={2.5} />, label: 'EcoLoop Onboarding' }}
          title="EcoLoop Onboarding"
          subtitle="Communication and follow-up layer for caterer onboarding — tickets, corrections, linked documents and Go-live blockers."
          size="hero"
          glowColor="rgba(248,113,113,0.06)"
          right={
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
              style={{ background: 'var(--accent)', color: '#07070a' }}>
              <Plus size={14} strokeWidth={2.5} /> New Ticket
            </button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { value: openCount,     label: 'Open tickets',         color: '#60a5fa', icon: <MessageCircle size={15} strokeWidth={2} /> },
            { value: criticalCount, label: 'Critical / High',       color: '#f87171', icon: <AlertTriangle  size={15} strokeWidth={2} /> },
            { value: awaitingCount, label: 'Awaiting response',     color: '#fbbf24', icon: <Clock          size={15} strokeWidth={2} /> },
            { value: resolvedCount, label: 'Resolved this week',    color: '#4ade80', icon: <CheckCircle2   size={15} strokeWidth={2} /> },
          ].map(s => (
            <div key={s.label} className="relative rounded-2xl px-4 pt-4 pb-3 overflow-hidden"
              style={{ background: 'var(--bg-card)', border: `1px solid ${s.color}28` }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg,${s.color}90,transparent)` }} />
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div className="text-[30px] font-black tabular-nums leading-none" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11.5px] mt-1" style={{ color: 'var(--text-3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col shrink-0 overflow-hidden" style={{ width: 360, borderRight: '1px solid var(--border-default)' }}>
          <div className="px-4 py-3 space-y-2 shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="relative">
              <Search size={13} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search tickets…"
                className="w-full pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <SelectFilter label="Caterer"  value={filterCaterer}  options={catererOptions}  onChange={setFilterCaterer} />
              <SelectFilter label="Priority" value={filterPriority} options={priorityOptions} onChange={setFilterPriority} />
              <SelectFilter label="Status"   value={filterStatus}   options={statusOptions}   onChange={setFilterStatus} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map(ticket => {
              const isActive = selected?.id === ticket.id
              return (
                <button key={ticket.id} onClick={() => setSelected(ticket)}
                  className="w-full text-left px-4 py-3.5 transition-colors cursor-pointer"
                  style={{
                    background: isActive ? 'var(--accent-dim)' : 'transparent',
                    borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                    borderBottom: '1px solid var(--border-subtle)',
                  }}>
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="mt-0.5 shrink-0" style={{ color: 'var(--text-4)' }}>{TYPE_ICON[ticket.type]}</span>
                    <span className="text-[13px] font-semibold leading-snug flex-1" style={{ color: 'var(--text-1)' }}>{ticket.title}</span>
                    <StatusDot s={ticket.status} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap ml-5">
                    <PriorityBadge p={ticket.priority} />
                    <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{ticket.caterer}</span>
                    <span className="ml-auto text-[10.5px]" style={{ color: 'var(--text-4)' }}>{ticket.lastActivity}</span>
                  </div>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <MessageCircle size={28} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
                <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>No tickets found</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {selected
            ? <DetailPanel ticket={selected} onClose={() => setSelected(null)} />
            : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <MessageCircle size={32} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
                <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>Select a ticket to view</span>
              </div>
            )
          }
        </div>
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
