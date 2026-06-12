import { useState } from 'react'
import {
  BookOpen, Baby, Tent, Calculator, FileBarChart2,
  CheckCircle2, Clock, AlertTriangle, XCircle, Lock,
  FileText, MessageCircle, Rocket, ClipboardEdit,
  ChevronDown, ChevronUp, Check,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────

type SetupStatus        = 'complete' | 'pending' | 'missing' | 'blocked'
type DocLinkStatus      = 'approved' | 'under-review' | 'missing'
type CorrectionStatus   = 'open' | 'in-progress' | 'resolved'
type CorrectionPriority = 'high' | 'medium' | 'low'
type BlockerSeverity    = 'critical' | 'high' | 'medium'
type LoopStatus         = 'open' | 'waiting' | 'resolved'

interface SetupItem    { id: string; label: string; description: string; status: SetupStatus; required: boolean }
interface LinkedDoc    { id: string; name: string; status: DocLinkStatus }
interface Correction   { id: string; title: string; status: CorrectionStatus; priority: CorrectionPriority }
interface GoLiveBlocker{ id: string; title: string; severity: BlockerSeverity }
interface EcoLoop      { id: string; subject: string; status: LoopStatus; unread: number }

interface ModuleData {
  id: string; title: string; subtitle: string
  Icon: LucideIcon; accent: string; active: boolean
  setupItems: SetupItem[]
  linkedDocs: LinkedDoc[]
  corrections: Correction[]
  blockers: GoLiveBlocker[]
  ecoloop: EcoLoop[]
}

// ─── Meta maps ────────────────────────────────────────────────

const SETUP_META: Record<SetupStatus, { color: string; bg: string; border: string; Icon: LucideIcon; label: string }> = {
  complete: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',   border: 'rgba(74,222,128,0.28)',   Icon: CheckCircle2,   label: 'Complete'  },
  pending:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',   border: 'rgba(251,191,36,0.28)',   Icon: Clock,          label: 'Pending'   },
  missing:  { color: '#f87171', bg: 'rgba(248,113,113,0.10)',  border: 'rgba(248,113,113,0.25)',  Icon: AlertTriangle,  label: 'Missing'   },
  blocked:  { color: '#f87171', bg: 'rgba(248,113,113,0.10)',  border: 'rgba(248,113,113,0.25)',  Icon: XCircle,        label: 'Blocked'   },
}

const DOC_META: Record<DocLinkStatus, { color: string; label: string }> = {
  approved:      { color: '#4ade80', label: 'Approved'      },
  'under-review':{ color: '#fbbf24', label: 'Under Review'  },
  missing:       { color: '#f87171', label: 'Missing'       },
}

const CORR_META: Record<CorrectionStatus, { color: string; label: string }> = {
  open:        { color: '#f87171', label: 'Open'        },
  'in-progress':{ color: '#fbbf24', label: 'In Progress' },
  resolved:    { color: '#4ade80', label: 'Resolved'    },
}

const PRIORITY_COLOR: Record<CorrectionPriority, string> = {
  high: '#f87171', medium: '#fbbf24', low: '#60a5fa',
}

const BLOCKER_META: Record<BlockerSeverity, { color: string; bg: string; border: string; label: string }> = {
  critical: { color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.28)', label: 'Critical' },
  high:     { color: '#fb923c', bg: 'rgba(251,146,60,0.10)',  border: 'rgba(251,146,60,0.28)',  label: 'High'     },
  medium:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.28)',  label: 'Medium'   },
}

const LOOP_META: Record<LoopStatus, { color: string; label: string }> = {
  open:     { color: '#60a5fa', label: 'Open'     },
  waiting:  { color: '#fbbf24', label: 'Waiting'  },
  resolved: { color: '#4ade80', label: 'Resolved' },
}

// ─── Module data ──────────────────────────────────────────────

const MODULES: ModuleData[] = [
  {
    id: 'school-meals', title: 'School Meals', subtitle: 'School menus, CSS districts, contacts & calendars',
    Icon: BookOpen, accent: '#4ade80', active: true,
    setupItems: [
      { id: 'sm1',  label: 'Register all schools',                  description: 'All active schools added to the portal',                 status: 'complete', required: true  },
      { id: 'sm2',  label: 'Link schools to CSS districts',          description: 'Each school associated with its CSS / district',          status: 'complete', required: true  },
      { id: 'sm3',  label: 'Add school contacts',                    description: 'Primary contact per school entered',                      status: 'complete', required: true  },
      { id: 'sm4',  label: 'Upload closure calendars',               description: '1 calendar still missing (École Saint-Exupéry)',          status: 'pending',  required: true  },
      { id: 'sm5',  label: 'Upload school menus',                    description: 'Main school meal menus uploaded and reviewed',            status: 'complete', required: true  },
      { id: 'sm6',  label: 'Upload common meals',                    description: 'Common items (soups, bread, yogurt) submitted',           status: 'complete', required: true  },
      { id: 'sm7',  label: 'Upload rotating cycle',                  description: 'Multi-week rotating meal cycle document required',        status: 'missing',  required: true  },
      { id: 'sm8',  label: 'Submit allergen protocol',               description: 'School-specific allergen management procedure required',   status: 'missing',  required: true  },
      { id: 'sm9',  label: 'Nutritional standards compliance',        description: 'Document confirming menus meet French school standards',  status: 'pending',  required: true  },
      { id: 'sm10', label: 'HACCP certification submission',          description: 'Valid HACCP certificate on file for school sites',        status: 'complete', required: true  },
    ],
    linkedDocs: [
      { id: 'sd1', name: 'School Meal Contract — Paris Centrale CSS', status: 'approved'       },
      { id: 'sd2', name: 'Nutritional Standards Compliance',          status: 'under-review'   },
      { id: 'sd3', name: 'Allergen Protocol — Schools',               status: 'missing'        },
      { id: 'sd4', name: 'Menu Validation Certificate',               status: 'missing'        },
    ],
    corrections: [
      { id: 'sc1', title: 'Allergen protocol — format does not match EcoLunch template',  status: 'open',        priority: 'high'   },
      { id: 'sc2', title: 'Rotating cycle — incorrect file format (must be PDF or XLSX)', status: 'in-progress', priority: 'medium' },
    ],
    blockers: [
      { id: 'sb1', title: 'Allergen Protocol not submitted',    severity: 'critical' },
      { id: 'sb2', title: 'Rotating Cycle document missing',    severity: 'high'     },
    ],
    ecoloop: [
      { id: 'se1', subject: 'School Menu Format Questions',        status: 'open',    unread: 2 },
      { id: 'se2', subject: 'Allergen Protocol Clarification',     status: 'waiting', unread: 1 },
    ],
  },
  {
    id: 'daycare', title: 'Daycare / CPE Meals', subtitle: 'CPE registrations, menus, packages & calendars',
    Icon: Baby, accent: '#60a5fa', active: true,
    setupItems: [
      { id: 'dc1', label: 'Register all daycares / CPEs',     description: 'All active CPE and daycare establishments added',          status: 'complete', required: true  },
      { id: 'dc2', label: 'Add daycare contacts',              description: 'Primary contact per establishment entered',               status: 'complete', required: true  },
      { id: 'dc3', label: 'Upload closure calendars',          description: '2 calendars still missing (Garderie Soleil, CPE Arc-en-Ciel)', status: 'pending', required: true },
      { id: 'dc4', label: 'Upload daycare menus',              description: 'Age-appropriate daycare menus uploaded and reviewed',     status: 'complete', required: true  },
      { id: 'dc5', label: 'Configure daycare packages',        description: 'Meal packages grouped by age range pending approval',    status: 'pending',  required: true  },
      { id: 'dc6', label: 'Submit DDASS certification',        description: 'Valid DDASS / DREETS certificate on file',               status: 'complete', required: true  },
      { id: 'dc7', label: 'Submit infant nutrition protocol',  description: 'Age-appropriate nutrition and texture procedures required', status: 'missing', required: true  },
      { id: 'dc8', label: 'Obtain CPE menu approval',          description: 'EcoLunch-validated daycare menu approval required',      status: 'missing',  required: true  },
    ],
    linkedDocs: [
      { id: 'dd1', name: 'CPE Service Agreement',        status: 'under-review' },
      { id: 'dd2', name: 'DDASS Certification',          status: 'approved'     },
      { id: 'dd3', name: 'Infant Nutrition Protocol',    status: 'missing'      },
      { id: 'dd4', name: 'CPE Menu Approval',            status: 'missing'      },
    ],
    corrections: [
      { id: 'dc1c', title: 'Infant nutrition protocol — age range labels missing', status: 'open', priority: 'high' },
    ],
    blockers: [
      { id: 'db1', title: 'Infant Nutrition Protocol not submitted', severity: 'critical' },
      { id: 'db2', title: 'CPE Menu Approval pending',               severity: 'medium'   },
    ],
    ecoloop: [
      { id: 'de1', subject: 'CPE Package Configuration Questions', status: 'resolved', unread: 0 },
      { id: 'de2', subject: 'Closure Calendar Submission',         status: 'open',     unread: 1 },
    ],
  },
  {
    id: 'accounting', title: 'Accounting', subtitle: 'Financial documents, VAT & tax compliance',
    Icon: Calculator, accent: '#fb923c', active: true,
    setupItems: [
      { id: 'ac1', label: 'Submit annual financial report', description: 'Most recent audited financial statements required', status: 'missing',  required: true  },
      { id: 'ac2', label: 'Confirm VAT registration',       description: 'VAT registration certificate verified',            status: 'complete', required: true  },
      { id: 'ac3', label: 'Submit tax clearance certificate', description: 'Proof of no outstanding tax liabilities',        status: 'pending',  required: true  },
      { id: 'ac4', label: 'Verify SIRET number',             description: 'SIRET validated against KBIS extract',           status: 'complete', required: true  },
      { id: 'ac5', label: 'Confirm APE code',                description: 'Activity code (APE/NAF) confirmed on file',      status: 'complete', required: false },
    ],
    linkedDocs: [
      { id: 'acd1', name: 'Annual Financial Report',    status: 'missing'      },
      { id: 'acd2', name: 'VAT Registration Certificate', status: 'approved'   },
      { id: 'acd3', name: 'Tax Clearance Certificate',  status: 'under-review' },
    ],
    corrections: [
      { id: 'acc1', title: 'Annual financial report — file format must be PDF, not image scan', status: 'open', priority: 'medium' },
    ],
    blockers: [
      { id: 'acb1', title: 'Annual Financial Report not submitted', severity: 'high' },
    ],
    ecoloop: [
      { id: 'ace1', subject: 'Financial Document Requirements', status: 'resolved', unread: 0 },
    ],
  },
  {
    id: 'reportiq', title: 'ReportIQ', subtitle: 'Compliance reports, incident logs & data export',
    Icon: FileBarChart2, accent: '#a3e635', active: true,
    setupItems: [
      { id: 'rq1', label: 'Submit Q3 2025 compliance report',  description: 'Quarterly compliance summary generated and approved',   status: 'complete', required: true  },
      { id: 'rq2', label: 'Configure incident reporting',      description: 'Incident reporting channels set up in portal',          status: 'complete', required: true  },
      { id: 'rq3', label: 'Complete ReportIQ account setup',   description: 'ReportIQ profile and preferences configured',           status: 'complete', required: true  },
      { id: 'rq4', label: 'Authorize data export permissions', description: 'EcoLunch data export authorization form pending sign-off', status: 'pending', required: true  },
    ],
    linkedDocs: [
      { id: 'rqd1', name: 'Q3 2025 Compliance Report', status: 'approved' },
      { id: 'rqd2', name: 'Incident Report — Sept 2025', status: 'approved' },
    ],
    corrections: [],
    blockers: [],
    ecoloop: [
      { id: 'rqe1', subject: 'ReportIQ Integration Setup', status: 'resolved', unread: 0 },
    ],
  },
  {
    id: 'camp-meals', title: 'Camp Meals', subtitle: 'Camp menus, packages & session dates',
    Icon: Tent, accent: '#c084fc', active: false,
    setupItems: [], linkedDocs: [], corrections: [], blockers: [], ecoloop: [],
  },
]

// ─── Completion helper ────────────────────────────────────────

function moduleCompletion(items: SetupItem[]) {
  const req  = items.filter(i => i.required)
  const done = req.filter(i => i.status === 'complete')
  const pct  = req.length > 0 ? Math.round((done.length / req.length) * 100) : 100
  return { done: done.length, total: req.length, pct }
}

// ─── Shared primitives ────────────────────────────────────────

function SmallBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[10px] font-bold px-1.5 py-px rounded"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10.5px] uppercase tracking-[0.13em] font-black mb-2" style={{ color: 'var(--text-4)' }}>
      {label}
    </p>
  )
}

function EmptyRow({ label }: { label: string }) {
  return (
    <p className="text-[11.5px] italic py-1" style={{ color: 'var(--text-4)' }}>No {label}</p>
  )
}

// ─── Setup checklist ──────────────────────────────────────────

function SetupChecklist({ items }: { items: SetupItem[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item, idx) => {
        const m = SETUP_META[item.status]
        const borderB = idx < items.length - 1 ? '1px solid var(--border-subtle)' : 'none'
        return (
          <div key={item.id} className="flex items-start gap-3 py-3" style={{ borderBottom: borderB }}>
            {/* Status icon */}
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: m.bg, border: `1px solid ${m.border}` }}>
              <m.Icon size={11} strokeWidth={2.5} style={{ color: m.color }} />
            </div>
            {/* Label + description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[12.5px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
                  {item.label}
                </p>
                {!item.required && (
                  <span className="text-[10px] font-bold px-1.5 py-px rounded"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                    Optional
                  </span>
                )}
              </div>
              <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-4)' }}>
                {item.description}
              </p>
            </div>
            {/* Status badge — desktop only */}
            <span className="hidden sm:flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
              <m.Icon size={9} strokeWidth={2.5} />{m.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Module sidebar panels ────────────────────────────────────

function MissingPanel({ items }: { items: SetupItem[] }) {
  const missing = items.filter(i => i.status === 'missing' || i.status === 'blocked')
  if (missing.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
        style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.20)' }}>
        <Check size={12} strokeWidth={2.5} style={{ color: '#4ade80', flexShrink: 0 }} />
        <p className="text-[11.5px] font-semibold" style={{ color: '#4ade80' }}>No missing items</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1.5">
      {missing.map(item => (
        <div key={item.id} className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)' }}>
          <AlertTriangle size={11} strokeWidth={2} style={{ color: '#f87171', marginTop: 1, flexShrink: 0 }} />
          <p className="text-[11.5px] font-semibold leading-snug" style={{ color: 'var(--text-2)' }}>{item.label}</p>
        </div>
      ))}
    </div>
  )
}

function DocsPanel({ docs }: { docs: LinkedDoc[] }) {
  if (docs.length === 0) return <EmptyRow label="linked documents" />
  return (
    <div className="flex flex-col gap-0 rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--border-default)' }}>
      {docs.map((doc, i) => {
        const m = DOC_META[doc.status]
        return (
          <div key={doc.id} className="flex items-center gap-2.5 px-3 py-2.5"
            style={{ borderBottom: i < docs.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <FileText size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
            <p className="text-[11.5px] font-medium flex-1 min-w-0 truncate" style={{ color: 'var(--text-3)' }}>{doc.name}</p>
            <SmallBadge label={m.label} color={m.color} />
          </div>
        )
      })}
    </div>
  )
}

function CorrectionsPanel({ corrections }: { corrections: Correction[] }) {
  if (corrections.length === 0) return <EmptyRow label="corrections" />
  return (
    <div className="flex flex-col gap-1.5">
      {corrections.map(c => {
        const cm = CORR_META[c.status]
        return (
          <div key={c.id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <ClipboardEdit size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', marginTop: 1, flexShrink: 0 }} />
            <p className="text-[11.5px] font-medium flex-1 min-w-0 leading-snug" style={{ color: 'var(--text-3)' }}>{c.title}</p>
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PRIORITY_COLOR[c.priority] }} />
              <SmallBadge label={cm.label} color={cm.color} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BlockersPanel({ blockers }: { blockers: GoLiveBlocker[] }) {
  if (blockers.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
        style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.20)' }}>
        <Check size={12} strokeWidth={2.5} style={{ color: '#4ade80', flexShrink: 0 }} />
        <p className="text-[11.5px] font-semibold" style={{ color: '#4ade80' }}>No go-live blockers</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1.5">
      {blockers.map(b => {
        const bm = BLOCKER_META[b.severity]
        return (
          <div key={b.id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
            style={{ background: bm.bg, border: `1px solid ${bm.border}` }}>
            <Rocket size={11} strokeWidth={2} style={{ color: bm.color, marginTop: 1, flexShrink: 0 }} />
            <p className="text-[11.5px] font-semibold flex-1 min-w-0 leading-snug" style={{ color: 'var(--text-2)' }}>{b.title}</p>
            <SmallBadge label={bm.label} color={bm.color} />
          </div>
        )
      })}
    </div>
  )
}

function EcoLoopPanel({ conversations }: { conversations: EcoLoop[] }) {
  if (conversations.length === 0) return <EmptyRow label="EcoLoop conversations" />
  return (
    <div className="flex flex-col gap-0 rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--border-default)' }}>
      {conversations.map((c, i) => {
        const lm = LOOP_META[c.status]
        return (
          <div key={c.id} className="flex items-center gap-2.5 px-3 py-2.5"
            style={{ borderBottom: i < conversations.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <MessageCircle size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
            <p className="text-[11.5px] font-medium flex-1 min-w-0 truncate" style={{ color: 'var(--text-3)' }}>{c.subject}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              {c.unread > 0 && (
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                  style={{ background: '#60a5fa', color: '#07070a' }}>{c.unread}</span>
              )}
              <SmallBadge label={lm.label} color={lm.color} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Module sidebar (right column) ───────────────────────────

function ModuleSidebar({ mod }: { mod: ModuleData }) {
  const panels: { label: string; content: React.ReactNode }[] = [
    { label: 'Missing Items',              content: <MissingPanel items={mod.setupItems} />           },
    { label: 'Linked Documents',           content: <DocsPanel docs={mod.linkedDocs} />               },
    { label: 'Linked Corrections',         content: <CorrectionsPanel corrections={mod.corrections} />},
    { label: 'Linked Go-Live Blockers',    content: <BlockersPanel blockers={mod.blockers} />         },
    { label: 'Linked EcoLoop Conversations', content: <EcoLoopPanel conversations={mod.ecoloop} />   },
  ]

  return (
    <div className="flex flex-col gap-4 px-5 py-5 border-t lg:border-t-0 lg:border-l"
      style={{ borderColor: 'var(--border-subtle)' }}>
      {panels.map(p => (
        <div key={p.label}>
          <SectionLabel label={p.label} />
          {p.content}
        </div>
      ))}
    </div>
  )
}

// ─── Module card ──────────────────────────────────────────────

function ModuleCard({ mod }: { mod: ModuleData }) {
  const comp       = moduleCompletion(mod.setupItems)
  const hasMissing = mod.setupItems.some(i => i.status === 'missing' || i.status === 'blocked')
  const [open, setOpen] = useState(hasMissing || mod.blockers.length > 0)

  const totalBlockers  = mod.blockers.length
  const totalMissing   = mod.setupItems.filter(i => i.status === 'missing').length
  const totalUnread    = mod.ecoloop.reduce((s, c) => s + c.unread, 0)
  const openCorr       = mod.corrections.filter(c => c.status !== 'resolved').length

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${mod.accent}`,
      }}>

      {/* ── Module header — always visible ──── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-4 px-5 py-4 cursor-pointer text-left"
        style={{ background: 'var(--bg-inner)', borderBottom: open ? '1px solid var(--border-default)' : 'none' }}>

        {/* Icon */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `${mod.accent}18`, border: `1px solid ${mod.accent}35` }}>
          <mod.Icon size={15} strokeWidth={1.8} style={{ color: mod.accent }} />
        </div>

        {/* Title + subtitle + counters */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-[14px] font-black" style={{ color: 'var(--text-1)' }}>{mod.title}</p>
            <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80' }} />
              Active
            </span>
            {totalBlockers > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                <Rocket size={8} strokeWidth={2.5} />{totalBlockers} blocker{totalBlockers > 1 ? 's' : ''}
              </span>
            )}
            {totalUnread > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                <MessageCircle size={8} strokeWidth={2.5} />{totalUnread} unread
              </span>
            )}
            {openCorr > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                <ClipboardEdit size={8} strokeWidth={2.5} />{openCorr} correction{openCorr > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{mod.subtitle}</p>
        </div>

        {/* Progress */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end gap-1" style={{ minWidth: 100 }}>
            <div className="flex items-center gap-1.5">
              <span className="text-[11.5px] font-bold" style={{ color: comp.pct === 100 ? '#4ade80' : 'var(--text-3)' }}>
                {comp.pct}%
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>
                {comp.done}/{comp.total} done
              </span>
            </div>
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${comp.pct}%`, background: comp.pct === 100 ? '#4ade80' : mod.accent }} />
            </div>
          </div>
        </div>

        {/* Missing count */}
        {totalMissing > 0 && (
          <span className="hidden md:inline text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            {totalMissing} missing
          </span>
        )}
        {totalMissing === 0 && comp.pct === 100 && (
          <span className="hidden md:inline text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
            Complete
          </span>
        )}

        {open
          ? <ChevronUp  size={15} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          : <ChevronDown size={15} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />}
      </button>

      {/* ── Expanded body: 2-col layout ─────── */}
      {open && (
        <div className="grid lg:grid-cols-[3fr_2fr]">
          {/* Left: Setup Checklist */}
          <div className="px-5 py-5">
            <SectionLabel label={`Required Setup — ${comp.done} of ${comp.total} complete`} />
            <SetupChecklist items={mod.setupItems} />
          </div>
          {/* Right: Linked sections */}
          <ModuleSidebar mod={mod} />
        </div>
      )}
    </div>
  )
}

// ─── Inactive module stub ─────────────────────────────────────

function InactiveModuleStub({ mod }: { mod: ModuleData }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderLeft: '3px solid var(--border-strong)',
        opacity: 0.65,
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
        <mod.Icon size={15} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-black" style={{ color: 'var(--text-3)' }}>{mod.title}</p>
        <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
          Required setup for this module will appear once it is activated.
        </p>
      </div>
      <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
        style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
        <Lock size={9} strokeWidth={2.5} />Not Activated
      </span>
    </div>
  )
}

// ─── Overall summary bar ──────────────────────────────────────

function OverallSummary({ modules }: { modules: ModuleData[] }) {
  const active     = modules.filter(m => m.active)
  const allItems   = active.flatMap(m => m.setupItems.filter(i => i.required))
  const done       = allItems.filter(i => i.status === 'complete').length
  const total      = allItems.length
  const pct        = total > 0 ? Math.round((done / total) * 100) : 100
  const blockers   = active.reduce((s, m) => s + m.blockers.length, 0)
  const corrections= active.reduce((s, m) => s + m.corrections.filter(c => c.status !== 'resolved').length, 0)
  const missing    = allItems.filter(i => i.status === 'missing').length
  const unread     = active.reduce((s, m) => s + m.ecoloop.reduce((ss, c) => ss + c.unread, 0), 0)

  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl flex-wrap"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      {/* Pct */}
      <div className="shrink-0 text-center" style={{ minWidth: 52 }}>
        <p className="text-[28px] font-black leading-none" style={{ color: 'var(--accent)' }}>{pct}%</p>
        <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Complete</p>
      </div>
      {/* Bar */}
      <div className="flex-1 min-w-[160px] flex flex-col gap-2">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
        <p className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
          {done} of {total} required setup items complete across {active.length} active modules
        </p>
      </div>
      {/* Indicator chips */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {blockers > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            <Rocket size={10} strokeWidth={2.5} />{blockers} Blocker{blockers > 1 ? 's' : ''}
          </span>
        )}
        {missing > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            <AlertTriangle size={10} strokeWidth={2.5} />{missing} Missing
          </span>
        )}
        {corrections > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            <ClipboardEdit size={10} strokeWidth={2.5} />{corrections} Open Correction{corrections > 1 ? 's' : ''}
          </span>
        )}
        {unread > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
            <MessageCircle size={10} strokeWidth={2.5} />{unread} Unread
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function ClientModulesPage() {
  const active   = MODULES.filter(m => m.active)
  const inactive = MODULES.filter(m => !m.active)

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Header ───────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Client Portal / Modules &amp; Required Setup
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
          Modules &amp; Required Setup
        </h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
          Required onboarding setup items, linked documents, corrections, blockers, and conversations per active module.
        </p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">

        {/* ── Overall progress ─────────── */}
        <OverallSummary modules={MODULES} />

        {/* ── Active modules ───────────── */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap"
            style={{ color: 'var(--text-4)' }}>
            Active Modules — {active.length}
          </span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
        </div>

        {active.map(mod => (
          <ModuleCard key={mod.id} mod={mod} />
        ))}

        {/* ── Inactive modules ─────────── */}
        {inactive.length > 0 && (
          <>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap"
                style={{ color: 'var(--text-4)' }}>
                Inactive Modules — {inactive.length}
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
            </div>
            {inactive.map(mod => (
              <InactiveModuleStub key={mod.id} mod={mod} />
            ))}
          </>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
