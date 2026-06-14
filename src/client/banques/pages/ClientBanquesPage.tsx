import {
  CreditCard, Building2, ArrowLeftRight, FileText,
  CheckCircle2, AlertTriangle, Clock, Eye, XCircle,
  Edit3, Upload, Shield, Lock, FileCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import { CompletionChart } from '../../../shared/components/CompletionChart'
import type { ChartRow } from '../../../shared/components/CompletionChart'

// ─── Types ──────────────────────────────────────────────────

type FieldStatus       = 'complete' | 'pending' | 'missing' | 'optional'
type SectionValidation = 'validated' | 'pending' | 'under-review' | 'not-submitted' | 'action-required'
type UploadStatus      = 'approved' | 'reviewing' | 'rejected' | 'missing'
type LinkedDocStatus   = 'approved' | 'under-review' | 'pending'

interface BankField {
  label: string
  value: string | null
  status: FieldStatus
  required: boolean
  sensitive?: boolean
}

interface BankSection {
  id: string
  title: string
  validation: SectionValidation
  Icon: LucideIcon
  fields: BankField[]
}

interface BankDocument {
  id: string
  name: string
  description: string
  required: boolean
  status: UploadStatus
  fileName: string | null
  fileSize: string | null
  uploadDate: string | null
}

interface LinkedBankDoc {
  id: number
  name: string
  type: string
  status: LinkedDocStatus
  date: string
  notes: string | null
}

// ─── Meta maps ───────────────────────────────────────────────

const VALIDATION_META: Record<SectionValidation, {
  label: string; color: string; bg: string; border: string; Icon: LucideIcon
}> = {
  validated:        { label: 'Validated',       color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)',  Icon: CheckCircle2  },
  pending:          { label: 'Pending',         color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)',  Icon: Clock         },
  'under-review':   { label: 'Under Review',    color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)',  Icon: Eye           },
  'not-submitted':  { label: 'Not Submitted',   color: 'var(--text-4)', bg: 'var(--bg-inner)',        border: 'var(--border-default)',  Icon: AlertTriangle },
  'action-required':{ label: 'Action Required', color: '#f87171',       bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', Icon: XCircle       },
}

const UPLOAD_META: Record<UploadStatus, { label: string; color: string; bg: string; border: string }> = {
  approved:  { label: 'Approved',     color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  reviewing: { label: 'Under Review', color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  rejected:  { label: 'Rejected',     color: '#f87171',       bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
  missing:   { label: 'Not Uploaded', color: 'var(--text-4)', bg: 'var(--bg-inner)',        border: 'var(--border-default)'  },
}

const LINKED_DOC_META: Record<LinkedDocStatus, { label: string; color: string; bg: string; border: string }> = {
  approved:      { label: 'Approved',     color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  'under-review':{ label: 'Under Review', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  pending:       { label: 'Pending',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)'  },
}

// ─── Mock data ───────────────────────────────────────────────

const SECTIONS: BankSection[] = [
  {
    id: 'institution', title: 'Banking Institution Details', validation: 'pending', Icon: Building2,
    fields: [
      { label: 'Bank Name',     value: 'BNP Paribas',   status: 'complete', required: true  },
      { label: 'Branch Name',   value: 'Paris Opéra',   status: 'complete', required: true  },
      { label: 'Branch Code',   value: '30004',         status: 'complete', required: true  },
      { label: 'SWIFT / BIC',   value: 'BNPAFRPPPAR',   status: 'pending',  required: true  },
      { label: 'Bank Country',  value: 'France',        status: 'complete', required: true  },
    ],
  },
  {
    id: 'account', title: 'Account Information', validation: 'action-required', Icon: CreditCard,
    fields: [
      { label: 'Account Holder',   value: 'Concept Gourmet SARL',          status: 'complete', required: true,  sensitive: false },
      { label: 'IBAN',             value: 'FR76 3000 4005 5200 0100 6722', status: 'pending',  required: true,  sensitive: true  },
      { label: 'Account Type',     value: 'Business Checking',             status: 'complete', required: true                    },
      { label: 'Currency',         value: 'EUR — Euro',                    status: 'complete', required: true                    },
      { label: 'Account Number',   value: null,                            status: 'missing',  required: true,  sensitive: true  },
    ],
  },
  {
    id: 'transit', title: 'Transit Information', validation: 'pending', Icon: ArrowLeftRight,
    fields: [
      { label: 'Code Établissement', value: '30004',  status: 'complete', required: true  },
      { label: 'Code Guichet',       value: '00552',  status: 'complete', required: true  },
      { label: 'Clé RIB',           value: '45',     status: 'pending',  required: true  },
      { label: 'SEPA Compliant',     value: 'Yes',    status: 'complete', required: false },
    ],
  },
]

const BANK_DOCUMENTS: BankDocument[] = [
  {
    id: 'rib',
    name: 'RIB (Relevé d\'Identité Bancaire)',
    description: 'Official bank identity document issued by your bank',
    required: true,
    status: 'missing',
    fileName: null, fileSize: null, uploadDate: null,
  },
  {
    id: 'statement',
    name: 'Recent Bank Statement',
    description: 'Bank statement from the last 3 months',
    required: true,
    status: 'missing',
    fileName: null, fileSize: null, uploadDate: null,
  },
  {
    id: 'auth-letter',
    name: 'Bank Authorization Letter',
    description: 'Letter authorizing EcoLunch to initiate transfers',
    required: true,
    status: 'reviewing',
    fileName: 'bank_auth_concept_gourmet.pdf',
    fileSize: '184 KB',
    uploadDate: '2026-06-05',
  },
  {
    id: 'kbis',
    name: 'KBIS / Company Registry Extract',
    description: 'Official company extract — less than 3 months old',
    required: false,
    status: 'approved',
    fileName: 'kbis_concept_gourmet_2026.pdf',
    fileSize: '312 KB',
    uploadDate: '2026-06-01',
  },
]

const LINKED_DOCS: LinkedBankDoc[] = [
  { id: 1, name: 'Bank Authorization Letter', type: 'Banking',    status: 'under-review', date: '2026-06-05', notes: 'Awaiting admin signature verification'      },
  { id: 2, name: 'KBIS Extract 2026',         type: 'Legal',      status: 'approved',     date: '2026-06-01', notes: null                                         },
  { id: 3, name: 'RIB Template (blank)',       type: 'Reference',  status: 'pending',      date: '2026-06-10', notes: 'Please download, complete, and re-upload' },
]

// ─── Helpers ─────────────────────────────────────────────────

function sectionCompletion(section: BankSection) {
  const required = section.fields.filter(f => f.required)
  const filled   = required.filter(f => f.value !== null).length
  return { filled, total: required.length }
}

// ─── Sub-components ──────────────────────────────────────────

function ValidationBadge({ validation }: { validation: SectionValidation }) {
  const vm = VALIDATION_META[validation]
  return (
    <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
      style={{ background: vm.bg, color: vm.color, border: `1px solid ${vm.border}` }}>
      <vm.Icon size={10} strokeWidth={2.5} />
      {vm.label}
    </span>
  )
}

function SectionCard({ section }: { section: BankSection }) {
  const { filled, total } = sectionCompletion(section)
  const pct      = total > 0 ? Math.round(filled / total * 100) : 100
  const dotColor = pct === 100 ? '#4ade80' : pct >= 60 ? '#fbbf24' : '#f87171'

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4"
        style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
            <section.Icon size={15} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[13.5px] font-bold truncate" style={{ color: 'var(--text-1)' }}>
              {section.title}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor }} />
              <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>
                {filled}/{total} required fields complete
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <ValidationBadge validation={section.validation} />
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80 shrink-0"
            style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
            <Edit3 size={12} strokeWidth={2} />
            Edit
          </button>
        </div>
      </div>

      {/* Field rows */}
      {section.fields.map((field, idx) => (
        <div key={field.label}
          className="flex items-start justify-between gap-4 px-5 py-3.5"
          style={{ borderBottom: idx < section.fields.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>

          {/* Label */}
          <span className="text-[12px] font-medium shrink-0 flex items-center gap-1"
            style={{ color: 'var(--text-3)', minWidth: 148 }}>
            {field.label}
            {field.sensitive && (
              <Lock size={9} strokeWidth={2.5} style={{ color: 'var(--text-4)', opacity: 0.6 }} />
            )}
            {field.required && <span style={{ color: '#f87171' }}> *</span>}
          </span>

          {/* Value / status */}
          <div className="flex items-center gap-2 flex-wrap justify-end min-w-0">
            {field.status === 'missing' ? (
              <>
                <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>—</span>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                  Required
                </span>
              </>
            ) : field.status === 'optional' ? (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Not provided</span>
            ) : field.status === 'pending' ? (
              <>
                <span className="text-[12px] font-semibold text-right font-mono" style={{ color: 'var(--text-2)' }}>
                  {field.value}
                </span>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: 'rgba(251,191,36,0.10)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.20)' }}>
                  Under Review
                </span>
              </>
            ) : (
              <span className={`text-[12px] font-semibold text-right ${field.sensitive ? 'font-mono' : ''}`}
                style={{ color: 'var(--text-2)' }}>
                {field.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function DocumentUploadCard({ doc }: { doc: BankDocument }) {
  const um       = UPLOAD_META[doc.status]
  const isUpload = doc.status === 'missing' || doc.status === 'rejected'

  return (
    <div className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: (doc.status === 'missing' && doc.required) ? 'rgba(248,113,113,0.04)' : 'var(--bg-card)',
        border: `1px solid ${(doc.status === 'missing' && doc.required) ? 'rgba(248,113,113,0.20)' : 'var(--border-default)'}`,
      }}>

      {/* Doc header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: doc.status === 'approved' ? 'rgba(74,222,128,0.12)' : doc.status === 'missing' ? 'var(--bg-inner)' : 'var(--accent-dim)',
              border: `1px solid ${doc.status === 'approved' ? 'rgba(74,222,128,0.25)' : doc.status === 'missing' ? 'var(--border-default)' : 'var(--accent-border)'}`,
            }}>
            {doc.status === 'approved'
              ? <FileCheck size={15} strokeWidth={1.8} style={{ color: '#4ade80' }} />
              : doc.status === 'rejected'
              ? <XCircle   size={15} strokeWidth={1.8} style={{ color: '#f87171' }} />
              : <FileText  size={15} strokeWidth={1.8} style={{ color: doc.status === 'missing' ? 'var(--text-4)' : 'var(--accent)' }} />}
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>
              {doc.name}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              {doc.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {doc.required && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
              style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.15)' }}>
              Required
            </span>
          )}
          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: um.bg, color: um.color, border: `1px solid ${um.border}` }}>
            {um.label}
          </span>
        </div>
      </div>

      {/* Uploaded file info */}
      {doc.fileName && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)' }}>
          <FileCheck size={12} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          <span className="text-[11.5px] font-medium flex-1 truncate" style={{ color: 'var(--text-3)' }}>
            {doc.fileName}
          </span>
          {doc.fileSize && (
            <span className="text-[11px] shrink-0" style={{ color: 'var(--text-4)' }}>{doc.fileSize}</span>
          )}
          {doc.uploadDate && (
            <span className="text-[11px] shrink-0" style={{ color: 'var(--text-4)' }}>· {doc.uploadDate}</span>
          )}
        </div>
      )}

      {/* Actions */}
      {isUpload ? (
        <button
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: (doc.status === 'missing' && doc.required) ? 'rgba(248,113,113,0.10)' : 'var(--accent-dim)',
            color: (doc.status === 'missing' && doc.required) ? '#f87171' : 'var(--accent)',
            border: `1px solid ${(doc.status === 'missing' && doc.required) ? 'rgba(248,113,113,0.25)' : 'var(--accent-border)'}`,
          }}>
          <Upload size={13} strokeWidth={2} />
          Upload Document
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
            View
          </button>
          <button
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
            Replace
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────

export function ClientBanquesPage() {
  const allRequired = SECTIONS.flatMap(s => s.fields.filter(f => f.required))
  const allFilled   = allRequired.filter(f => f.value !== null)
  const overallPct  = allRequired.length > 0
    ? Math.round(allFilled.length / allRequired.length * 100)
    : 100

  const missingFields = SECTIONS.flatMap(s =>
    s.fields
      .filter(f => f.status === 'missing' && f.required)
      .map(f => ({ field: f.label, section: s.title }))
  )

  const missingDocs = BANK_DOCUMENTS.filter(d => d.status === 'missing' && d.required)

  const totalMissing = missingFields.length + missingDocs.length

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
              Client Portal / Banks & Banking Information
            </p>
            <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              Banking Information
            </h1>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
              Concept Gourmet · Required for onboarding completion
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl px-4 py-3 shrink-0"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-1"
                style={{ color: 'var(--text-4)' }}>
                Banking Completion
              </p>
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] font-black leading-none" style={{ color: 'var(--accent)' }}>
                  {overallPct}%
                </span>
                <div>
                  <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${overallPct}%`, background: 'var(--accent)' }} />
                  </div>
                  <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                    {allFilled.length}/{allRequired.length} required fields
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageTabs
        tabs={[
          { id: 'overview',     label: 'Overview',      icon: <Shield size={13} strokeWidth={1.8} />, badge: totalMissing > 0 ? totalMissing : undefined },
          { id: 'bank-details', label: 'Bank Details',  icon: <Building2 size={13} strokeWidth={1.8} /> },
          { id: 'documents',    label: 'Documents',     icon: <FileText size={13} strokeWidth={1.8} />, badge: BANK_DOCUMENTS.length },
        ]}>
        {activeTab => (
          <div className="px-5 py-6 flex flex-col gap-6">

            {/* ── Overview ─────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <>
                {/* Validation overview chart */}
                {(() => {
                  const docsPct = Math.round(
                    BANK_DOCUMENTS.filter(d => d.status !== 'missing').length / BANK_DOCUMENTS.length * 100
                  )
                  const chartRows: ChartRow[] = [
                    ...SECTIONS.map(section => {
                      const { filled, total } = sectionCompletion(section)
                      const pct      = total > 0 ? Math.round(filled / total * 100) : 100
                      const barColor = pct === 100 ? '#4ade80' : pct >= 60 ? 'var(--accent)' : '#fbbf24'
                      const vm       = VALIDATION_META[section.validation]
                      return { id: section.id, label: section.title, pct, barColor, badge: vm }
                    }),
                    {
                      id: 'docs',
                      label: 'Banking Documents',
                      pct: docsPct,
                      barColor: docsPct === 100 ? '#4ade80' : '#fbbf24',
                      badge: {
                        label: 'Incomplete',
                        color: '#f87171',
                        bg: 'rgba(248,113,113,0.12)',
                        border: 'rgba(248,113,113,0.25)',
                        Icon: XCircle,
                      },
                    },
                  ]
                  return (
                    <CompletionChart
                      title="Banking Completion & Validation Status"
                      overallPct={overallPct}
                      filled={allFilled.length}
                      total={allRequired.length}
                      subtitle="banking complete"
                      rows={chartRows}
                    />
                  )
                })()}

                {/* Missing requirements alert */}
                {totalMissing > 0 && (
                  <div className="rounded-2xl p-4"
                    style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.22)' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
                        <AlertTriangle size={14} strokeWidth={2} style={{ color: '#f87171' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold" style={{ color: '#f87171' }}>
                          {totalMissing} Banking Requirement{totalMissing !== 1 ? 's' : ''} Missing
                        </p>
                        <p className="text-[12px] mt-0.5 mb-3" style={{ color: 'var(--text-4)' }}>
                          The following must be completed before your banking details can be validated.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {missingFields.map(({ field, section }) => (
                            <span key={`${section}-${field}`}
                              className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-xl cursor-pointer"
                              style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                              {field}<span className="text-[10px] font-normal" style={{ opacity: 0.7 }}>· Field</span>
                            </span>
                          ))}
                          {missingDocs.map(doc => (
                            <span key={doc.id}
                              className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-xl cursor-pointer"
                              style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                              {doc.name.split('(')[0].trim()}<span className="text-[10px] font-normal" style={{ opacity: 0.7 }}>· Document</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Bank Details ─────────────────────────────────── */}
            {activeTab === 'bank-details' && (
              <>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                  <Shield size={14} strokeWidth={1.8} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <p className="text-[12px]" style={{ color: 'var(--text-4)' }}>
                    Your banking information is encrypted at rest and in transit using industry-standard AES-256 encryption.
                    Only authorized EcoLunch administrators can access this data for onboarding verification purposes.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
                  <div className="flex flex-col gap-5">
                    {[SECTIONS[0], SECTIONS[2]].map(s => <SectionCard key={s.id} section={s} />)}
                  </div>
                  <div className="flex flex-col gap-5">
                    <SectionCard section={SECTIONS[1]} />
                    <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                      style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.20)' }}>
                      <XCircle size={14} strokeWidth={2} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <p className="text-[12.5px] font-bold" style={{ color: '#f87171' }}>IBAN Format Correction Required</p>
                        <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                          Your submitted IBAN is under review. An admin has flagged a potential format issue.
                          Please verify the full 27-character French IBAN (FR76 + 23 digits) and resubmit if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Documents ───────────────────────────────────── */}
            {activeTab === 'documents' && (
              <>
                <section>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
                      <Upload size={13} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-1)' }}>Banking Documents Upload</h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                      {BANK_DOCUMENTS.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BANK_DOCUMENTS.map(doc => <DocumentUploadCard key={doc.id} doc={doc} />)}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
                      <FileText size={13} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-1)' }}>Linked Documents</h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                      {LINKED_DOCS.length}
                    </span>
                  </div>
                  <div className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                    <div className="hidden sm:grid px-5 py-2.5"
                      style={{ gridTemplateColumns: '1fr 90px 110px 110px', gap: '1rem', background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
                      {['Document', 'Type', 'Status', 'Date'].map(col => (
                        <span key={col} className="text-[10.5px] uppercase tracking-[0.11em] font-bold" style={{ color: 'var(--text-4)' }}>{col}</span>
                      ))}
                    </div>
                    {LINKED_DOCS.map((doc, idx) => {
                      const dm = LINKED_DOC_META[doc.status]
                      return (
                        <div key={doc.id} style={{ borderBottom: idx < LINKED_DOCS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                          <div className="hidden sm:grid items-start px-5 py-3.5"
                            style={{ gridTemplateColumns: '1fr 90px 110px 110px', gap: '1rem' }}>
                            <div>
                              <p className="text-[12.5px] font-semibold" style={{ color: 'var(--text-1)' }}>{doc.name}</p>
                              {doc.notes && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{doc.notes}</p>}
                            </div>
                            <span className="text-[11.5px] pt-0.5" style={{ color: 'var(--text-4)' }}>{doc.type}</span>
                            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full w-fit"
                              style={{ background: dm.bg, color: dm.color, border: `1px solid ${dm.border}` }}>{dm.label}</span>
                            <span className="text-[11.5px] pt-0.5" style={{ color: 'var(--text-4)' }}>{doc.date}</span>
                          </div>
                          <div className="sm:hidden px-5 py-3.5 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[12.5px] font-semibold" style={{ color: 'var(--text-1)' }}>{doc.name}</p>
                              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
                                style={{ background: dm.bg, color: dm.color }}>{dm.label}</span>
                            </div>
                            <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{doc.type} · {doc.date}</p>
                            {doc.notes && <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{doc.notes}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              </>
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>
    </div>
  )
}
