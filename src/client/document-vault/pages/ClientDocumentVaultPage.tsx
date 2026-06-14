import { useState } from 'react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import { RowMenu } from '../../../shared/components/DropdownMenu'
import {
  User2, Scale, Building2, ShieldCheck, Shield,
  FilePen, Rocket, BookOpen, Baby, Tent, Calculator, FileBarChart2,
  Upload, Eye, RefreshCcw, FileText, CheckCircle2, XCircle,
  AlertTriangle, Clock, ChevronDown, ChevronUp, Lock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────

type DocStatus = 'approved' | 'under-review' | 'missing' | 'rejected'

interface VaultDoc {
  id: string; name: string; description: string
  required: boolean; status: DocStatus
  fileName: string | null; fileSize: string | null; uploadDate: string | null
}

interface DocCategory {
  id: string; title: string; Icon: LucideIcon; accent: string
  docs: VaultDoc[]
}

// ─── Active modules ────────────────────────────────────────────

const ACTIVE_MODULES = { schoolMeals: true, daycare: true, campMeals: false } as const

// ─── Doc builder helper ───────────────────────────────────────

function d(
  id: string, name: string, description: string,
  required: boolean, status: DocStatus,
  fileName?: string, fileSize?: string, uploadDate?: string,
): VaultDoc {
  return {
    id, name, description, required, status,
    fileName: fileName ?? null, fileSize: fileSize ?? null, uploadDate: uploadDate ?? null,
  }
}

// ─── Base categories ──────────────────────────────────────────

const BASE_CATEGORIES: DocCategory[] = [
  {
    id: 'profile', title: 'Profile', Icon: User2, accent: '#a78bfa',
    docs: [
      d('p1', 'Company Registration Certificate',   'Official certificate of business registration',                 true,  'approved',      'cert_registration.pdf',   '1.1 MB', '2025-08-10'),
      d('p2', 'Business License',                   'Current operational business license',                          true,  'under-review',  'business_license.pdf',    '890 KB', '2025-09-01'),
      d('p3', 'Company Logo',                       'High-resolution logo in PDF or PNG format',                     false, 'approved',      'logo_ecolunch.png',       '220 KB', '2025-08-05'),
      d('p4', 'Government-issued ID — Primary Contact', 'Valid national ID or passport of primary contact',          true,  'approved',      'id_contact.pdf',          '2.3 MB', '2025-08-08'),
    ],
  },
  {
    id: 'legal', title: 'Legal', Icon: Scale, accent: '#60a5fa',
    docs: [
      d('l1', 'KBIS Extract',              'Official French company registration extract (less than 3 months old)', true,  'approved',      'kbis_2025.pdf',           '540 KB', '2025-08-12'),
      d('l2', 'Articles of Association',   'Signed and dated articles of association (statuts)',                   true,  'under-review',  'statuts_societe.pdf',     '1.8 MB', '2025-09-03'),
      d('l3', 'Proof of Good Standing',    'Certificate of non-insolvency from the commercial court',              true,  'missing',       undefined, undefined, undefined),
      d('l4', 'Power of Attorney',         'If a representative signs on behalf of the legal entity',              false, 'missing',       undefined, undefined, undefined),
    ],
  },
  {
    id: 'banking', title: 'Banking', Icon: Building2, accent: '#4ade80',
    docs: [
      d('b1', 'RIB — Relevé d\'Identité Bancaire', 'Official bank account identification document',                   true,  'approved',      'rib_banque.pdf',          '180 KB', '2025-08-14'),
      d('b2', 'Bank Statement — Last 3 Months',    'Three most recent monthly account statements',                    true,  'under-review',  'releves_juillet_sept.pdf', '3.2 MB', '2025-09-04'),
      d('b3', 'Banking Authorization Letter',       'Letter from bank confirming account holder identity',             true,  'under-review',  'autorisation_banque.pdf', '420 KB', '2025-09-02'),
      d('b4', 'KBIS Copy for Banking',              'KBIS extract used for banking compliance verification',           true,  'approved',      'kbis_banque.pdf',         '540 KB', '2025-08-14'),
    ],
  },
  {
    id: 'compliance', title: 'Compliance & Permits', Icon: ShieldCheck, accent: '#fbbf24',
    docs: [
      d('c1', 'Food Safety Certification (HACCP)', 'Valid HACCP accreditation certificate for food preparation',       true,  'approved',      'haccp_cert.pdf',          '2.1 MB', '2025-08-20'),
      d('c2', 'Health Inspection Certificate',     'Most recent health authority inspection report',                   true,  'under-review',  'inspection_sante.pdf',    '1.5 MB', '2025-09-05'),
      d('c3', 'Environmental Compliance Permit',   'Environmental impact and waste management compliance certificate',  true,  'missing',       undefined, undefined, undefined),
      d('c4', 'Allergy Management Policy',         'Documented allergen control procedures for food production',        true,  'missing',       undefined, undefined, undefined),
      d('c5', 'Staff Food Hygiene Training Records', 'Training certificates for all food-handling staff',               false, 'missing',       undefined, undefined, undefined),
    ],
  },
  {
    id: 'insurance', title: 'Insurance', Icon: Shield, accent: '#f87171',
    docs: [
      d('i1', 'Public Liability Insurance Certificate', 'Minimum €5M public liability cover, current year',             true,  'approved',      'rc_professionnelle.pdf',  '1.3 MB', '2025-08-18'),
      d('i2', 'Professional Indemnity Insurance',        'Professional errors and omissions coverage certificate',        true,  'under-review',  'assurance_pro.pdf',       '980 KB', '2025-09-01'),
      d('i3', 'Vehicle Insurance',                       'If operating delivery vehicles for meal transport',             false, 'missing',       undefined, undefined, undefined),
    ],
  },
  {
    id: 'contracts', title: 'Contracts & Signatures', Icon: FilePen, accent: '#c084fc',
    docs: [
      d('ct1', 'Master Service Agreement',         'Signed MSA between caterer and EcoLunch platform',                 true,  'under-review',  'msa_signed.pdf',          '2.6 MB', '2025-09-06'),
      d('ct2', 'Non-Disclosure Agreement',          'Signed NDA for platform access and data confidentiality',          true,  'approved',      'nda_signed.pdf',          '890 KB', '2025-08-22'),
      d('ct3', 'Data Processing Agreement (DPA)',   'GDPR-compliant data processing agreement',                         true,  'missing',       undefined, undefined, undefined),
      d('ct4', 'EcoLunch Platform Terms',           'Signed acceptance of EcoLunch service terms and conditions',       true,  'approved',      'terms_accepted.pdf',      '440 KB', '2025-08-22'),
    ],
  },
  {
    id: 'golive', title: 'Go-live', Icon: Rocket, accent: '#34d399',
    docs: [
      d('g1', 'Go-live Readiness Declaration',  'Signed declaration confirming all onboarding steps are complete',  true,  'missing', undefined, undefined, undefined),
      d('g2', 'Pre-launch Checklist Sign-off',  'Completed and signed EcoLunch pre-launch verification checklist', true,  'missing', undefined, undefined, undefined),
      d('g3', 'EcoLunch Approval Letter',       'Formal approval letter issued by EcoLunch upon validation',        true,  'missing', undefined, undefined, undefined),
    ],
  },
]

// ─── Dynamic categories ───────────────────────────────────────

const DYNAMIC_CATEGORIES: (DocCategory & { moduleKey: keyof typeof ACTIVE_MODULES | null })[] = [
  {
    id: 'school-meals', title: 'School Meals', Icon: BookOpen, accent: '#4ade80',
    moduleKey: 'schoolMeals',
    docs: [
      d('sm1', 'School Meal Contract — Paris Centrale CSS',  'Signed service contract with Paris Centrale CSS district',    true,  'approved',      'contrat_css_centrale.pdf', '1.9 MB', '2025-09-01'),
      d('sm2', 'Nutritional Standards Compliance',           'Document confirming menus meet French school nutrition standards', true, 'under-review', 'normes_nutritives.pdf',   '760 KB', '2025-09-04'),
      d('sm3', 'Allergen Protocol — Schools',                'Documented allergen management protocol specific to schools',   true,  'missing',       undefined, undefined, undefined),
      d('sm4', 'Menu Validation Certificate',                'EcoLunch-validated menu approval document for school meals',    true,  'missing',       undefined, undefined, undefined),
    ],
  },
  {
    id: 'daycare', title: 'Daycare / CPE Meals', Icon: Baby, accent: '#60a5fa',
    moduleKey: 'daycare',
    docs: [
      d('dc1', 'CPE Service Agreement',     'Signed service agreement covering all registered CPE establishments',  true,  'under-review',  'accord_cpe.pdf',          '2.1 MB', '2025-09-03'),
      d('dc2', 'DDASS Certification',       'Official DDASS / DREETS certification for childcare food service',      true,  'approved',      'ddass_cert.pdf',          '1.4 MB', '2025-08-28'),
      d('dc3', 'Infant Nutrition Protocol', 'Age-appropriate nutrition and texture management procedures',           true,  'missing',       undefined, undefined, undefined),
      d('dc4', 'CPE Menu Approval',         'EcoLunch-validated daycare menu approval document',                     true,  'missing',       undefined, undefined, undefined),
    ],
  },
  {
    id: 'camp', title: 'Camp Meals', Icon: Tent, accent: '#fb923c',
    moduleKey: 'campMeals',
    docs: [
      d('cm1', 'Camp Meal Contract',         'Service contract for camp meal programs', true, 'missing', undefined, undefined, undefined),
      d('cm2', 'Camp Nutrition Compliance',  'Nutrition standards compliance for camp catering', true, 'missing', undefined, undefined, undefined),
    ],
  },
  {
    id: 'accounting', title: 'Accounting', Icon: Calculator, accent: '#fb923c',
    moduleKey: null,
    docs: [
      d('ac1', 'Last Annual Financial Report', 'Most recent audited annual financial statements',                      true,  'missing',       undefined, undefined, undefined),
      d('ac2', 'VAT Registration Certificate', 'Certificate of VAT registration (numéro de TVA intracommunautaire)',  true,  'approved',      'tva_cert.pdf',            '310 KB', '2025-08-10'),
      d('ac3', 'Tax Clearance Certificate',    'Proof of no outstanding tax liabilities (attestation fiscale)',       true,  'under-review',  'attestation_fiscale.pdf', '490 KB', '2025-09-02'),
    ],
  },
  {
    id: 'reportiq', title: 'ReportIQ Documents', Icon: FileBarChart2, accent: '#a3e635',
    moduleKey: null,
    docs: [
      d('rq1', 'Q3 2025 Compliance Report', 'Quarterly compliance summary generated by ReportIQ',    true,  'approved',      'reportiq_q3_2025.pdf',  '1.1 MB', '2025-10-01'),
      d('rq2', 'Incident Report — Sept 2025', 'Incident log for September 2025 reporting period',    false, 'approved',      'incident_sept_2025.pdf','630 KB', '2025-10-03'),
    ],
  },
]

// ─── Status meta ──────────────────────────────────────────────

const STATUS_META: Record<DocStatus, { label: string; color: string; bg: string; border: string; Icon: LucideIcon }> = {
  approved:      { label: 'Approved',      color: '#4ade80', bg: 'rgba(74,222,128,0.12)',   border: 'rgba(74,222,128,0.28)',   Icon: CheckCircle2  },
  'under-review':{ label: 'Under Review',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',   border: 'rgba(96,165,250,0.28)',   Icon: Clock         },
  missing:       { label: 'Missing',       color: '#f87171', bg: 'rgba(248,113,113,0.10)',  border: 'rgba(248,113,113,0.25)',  Icon: AlertTriangle },
  rejected:      { label: 'Rejected',      color: '#f87171', bg: 'rgba(248,113,113,0.10)',  border: 'rgba(248,113,113,0.25)',  Icon: XCircle       },
}

// ─── Shared primitives ────────────────────────────────────────

function StatusBadge({ status, required }: { status: DocStatus; required: boolean }) {
  const m = STATUS_META[status]
  const isOptionalMissing = status === 'missing' && !required
  const color  = isOptionalMissing ? 'var(--text-4)' : m.color
  const bg     = isOptionalMissing ? 'var(--bg-inner)' : m.bg
  const border = isOptionalMissing ? 'var(--border-default)' : m.border
  const label  = isOptionalMissing ? 'Optional' : m.label
  const Icon   = m.Icon

  return (
    <span className="flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      <Icon size={9} strokeWidth={2.5} />
      {label}
    </span>
  )
}

// ─── Document row ─────────────────────────────────────────────

const ROW_COLS = '1fr 175px 110px 40px'

function DocRow({ doc: vd, last }: { doc: VaultDoc; last: boolean }) {
  const [status, setStatus]       = useState<DocStatus>(vd.status)
  const [fileName, setFileName]   = useState<string | null>(vd.fileName)
  const [fileSize, setFileSize]   = useState<string | null>(vd.fileSize)
  const [uploadDate, setUploadDate] = useState<string | null>(vd.uploadDate)
  const hasFile = fileName !== null

  function simulateUpload() {
    setFileName(`${vd.id}_document.pdf`)
    setFileSize('1.2 MB')
    setUploadDate(new Date().toISOString().slice(0, 10))
    setStatus('under-review')
  }

  const borderBottom = last ? 'none' : '1px solid var(--border-subtle)'

  return (
    <div style={{ borderBottom }}>
      {/* ── Desktop row ──────────────────────── */}
      <div className="hidden sm:grid items-center gap-4 px-5 py-3.5"
        style={{ gridTemplateColumns: ROW_COLS }}>

        {/* Name + description */}
        <div className="min-w-0 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: hasFile ? 'rgba(96,165,250,0.12)' : 'var(--bg-inner)',
              border: `1px solid ${hasFile ? 'rgba(96,165,250,0.25)' : 'var(--border-default)'}`,
            }}>
            <FileText size={12} strokeWidth={1.8}
              style={{ color: hasFile ? '#60a5fa' : 'var(--text-4)' }} />
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
              {vd.name}
              {!vd.required && (
                <span className="ml-1.5 text-[10px] font-bold px-1.5 py-px rounded"
                  style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)', verticalAlign: 'middle' }}>
                  Optional
                </span>
              )}
            </p>
            <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-4)' }}>
              {vd.description}
            </p>
          </div>
        </div>

        {/* File info */}
        {hasFile ? (
          <div className="min-w-0">
            <p className="text-[11.5px] font-medium truncate" style={{ color: 'var(--text-3)' }}>{fileName}</p>
            <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              {fileSize} · {uploadDate}
            </p>
          </div>
        ) : (
          <p className="text-[11.5px] italic" style={{ color: 'var(--text-4)' }}>No file uploaded</p>
        )}

        {/* Status */}
        <StatusBadge status={status} required={vd.required} />

        {/* Actions */}
        <RowMenu actions={hasFile
          ? [
              { label: 'View',    icon: <Eye        size={12} strokeWidth={2} /> },
              { label: 'Replace', icon: <RefreshCcw size={12} strokeWidth={2} /> },
            ]
          : [
              { label: 'Upload', icon: <Upload size={12} strokeWidth={2} />, color: 'var(--accent)' },
            ]
        } minWidth="140px" />
      </div>

      {/* ── Mobile card ───────────────────────── */}
      <div className="sm:hidden px-4 py-4 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background: hasFile ? 'rgba(96,165,250,0.12)' : 'var(--bg-inner)',
                border: `1px solid ${hasFile ? 'rgba(96,165,250,0.25)' : 'var(--border-default)'}`,
              }}>
              <FileText size={12} strokeWidth={1.8}
                style={{ color: hasFile ? '#60a5fa' : 'var(--text-4)' }} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>{vd.name}</p>
              <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-4)' }}>{vd.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={status} required={vd.required} />
            <RowMenu actions={hasFile
              ? [
                  { label: 'View',    icon: <Eye        size={12} strokeWidth={2} /> },
                  { label: 'Replace', icon: <RefreshCcw size={12} strokeWidth={2} /> },
                ]
              : [
                  { label: 'Upload', icon: <Upload size={12} strokeWidth={2} />, color: 'var(--accent)' },
                ]
            } minWidth="140px" />
          </div>
        </div>

        {hasFile && (
          <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
            {fileName} · {fileSize} · {uploadDate}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Category completion stats ────────────────────────────────

function completionStats(docs: VaultDoc[]) {
  const required   = docs.filter(d => d.required)
  const uploaded   = required.filter(d => d.status !== 'missing')
  const missing    = required.filter(d => d.status === 'missing')
  const optional   = docs.filter(d => !d.required)
  return { required: required.length, uploaded: uploaded.length, missing: missing.length, optional: optional.length }
}

// ─── Category card ────────────────────────────────────────────

function CategoryCard({ category, defaultOpen = false }: { category: DocCategory; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const stats = completionStats(category.docs)
  const allDone = stats.missing === 0

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

      {/* ── Header ───────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer text-left"
        style={{
          background: 'var(--bg-inner)',
          borderBottom: open ? '1px solid var(--border-default)' : 'none',
        }}>

        {/* Icon */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${category.accent}18`, border: `1px solid ${category.accent}35` }}>
          <category.Icon size={15} strokeWidth={1.8} style={{ color: category.accent }} />
        </div>

        {/* Title + stats */}
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-black leading-none mb-1" style={{ color: 'var(--text-1)' }}>
            {category.title}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Progress fraction */}
            <span className="text-[11px] font-semibold" style={{ color: allDone ? '#4ade80' : 'var(--text-4)' }}>
              {stats.uploaded}/{stats.required} required uploaded
            </span>
            {stats.optional > 0 && (
              <span className="text-[10.5px]" style={{ color: 'var(--text-4)' }}>
                · {stats.optional} optional
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="hidden md:flex items-center gap-2 shrink-0 w-28">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--bg-card)' }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${stats.required > 0 ? Math.round((stats.uploaded / stats.required) * 100) : 100}%`,
                background: allDone ? '#4ade80' : 'var(--accent)',
              }} />
          </div>
          <span className="text-[10.5px] font-bold shrink-0"
            style={{ color: allDone ? '#4ade80' : 'var(--text-4)' }}>
            {stats.required > 0 ? Math.round((stats.uploaded / stats.required) * 100) : 100}%
          </span>
        </div>

        {/* Missing pill */}
        {stats.missing > 0 && (
          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.28)' }}>
            {stats.missing} missing
          </span>
        )}
        {allDone && (
          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.28)' }}>
            Complete
          </span>
        )}

        {open
          ? <ChevronUp size={15} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          : <ChevronDown size={15} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />}
      </button>

      {/* ── Desktop column headers + rows ─── */}
      {open && (
        <>
          <div className="hidden sm:grid px-5 py-2 gap-4"
            style={{
              gridTemplateColumns: ROW_COLS,
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-default)',
            }}>
            {['Document', 'File', 'Status', ''].map(h => (
              <span key={h} className="text-[10.5px] uppercase tracking-[0.11em] font-bold"
                style={{ color: 'var(--text-4)' }}>{h}</span>
            ))}
          </div>
          {category.docs.map((doc, idx) => (
            <DocRow key={doc.id} doc={doc} last={idx === category.docs.length - 1} />
          ))}
        </>
      )}
    </div>
  )
}

// ─── Inactive module stub ─────────────────────────────────────

function InactiveCategoryStub({ category }: { category: DocCategory }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: '3px solid var(--border-strong)', opacity: 0.7 }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
        <category.Icon size={15} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold" style={{ color: 'var(--text-3)' }}>{category.title}</p>
        <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
          Documents for this module will appear once the module is activated.
        </p>
      </div>
      <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
        style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
        <Lock size={9} strokeWidth={2.5} />Not Activated
      </span>
    </div>
  )
}

// ─── Section divider ──────────────────────────────────────────

// ─── Overall vault progress ───────────────────────────────────

function VaultProgressBar({ categories }: { categories: DocCategory[] }) {
  const all      = categories.flatMap(c => c.docs)
  const required = all.filter(d => d.required)
  const uploaded = required.filter(d => d.status !== 'missing').length
  const total    = required.length
  const pct      = total > 0 ? Math.round((uploaded / total) * 100) : 100
  const missing  = total - uploaded

  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-xl flex-wrap"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

      {/* Percentage */}
      <div className="shrink-0 text-center" style={{ minWidth: 52 }}>
        <p className="text-[28px] font-black leading-none" style={{ color: 'var(--accent)' }}>{pct}%</p>
        <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Complete</p>
      </div>

      {/* Bar + counters */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
            {uploaded} of {total} required documents uploaded
          </span>
          {missing > 0 && (
            <span className="text-[11.5px] font-bold" style={{ color: '#f87171' }}>
              {missing} still missing
            </span>
          )}
        </div>
      </div>

      {/* Status chips */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {(
          [
            { status: 'approved' as DocStatus,      count: all.filter(d => d.status === 'approved').length      },
            { status: 'under-review' as DocStatus,  count: all.filter(d => d.status === 'under-review').length  },
            { status: 'missing' as DocStatus,       count: all.filter(d => d.status === 'missing').length       },
            { status: 'rejected' as DocStatus,      count: all.filter(d => d.status === 'rejected').length      },
          ] as const
        ).filter(({ count }) => count > 0).map(({ status, count }) => {
          const m = STATUS_META[status]
          return (
            <span key={status} className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
              <m.Icon size={10} strokeWidth={2.5} />{count} {m.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function ClientDocumentVaultPage() {
  const visibleDynamic = DYNAMIC_CATEGORIES.filter(
    c => c.moduleKey === null || ACTIVE_MODULES[c.moduleKey]
  )
  const allCategories = [...BASE_CATEGORIES, ...visibleDynamic]

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page header ───────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Client Portal / Document Vault
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
          Document Vault
        </h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
          Upload and manage all onboarding documents. Documents are reviewed by EcoLunch after upload.
        </p>
      </div>

      <PageTabs
        tabs={[
          { id: 'base',    label: 'Base Documents',   icon: <FileText size={13} strokeWidth={1.8} />, badge: BASE_CATEGORIES.length },
          { id: 'modules', label: 'Module Documents', icon: <BookOpen size={13} strokeWidth={1.8} />, badge: DYNAMIC_CATEGORIES.length },
        ]}>
        {activeTab => (
          <div className="px-5 py-5 flex flex-col gap-5">

            <VaultProgressBar categories={allCategories} />

            {activeTab === 'base' && (
              <>
                {BASE_CATEGORIES.map(cat => (
                  <CategoryCard key={cat.id} category={cat} defaultOpen={completionStats(cat.docs).missing > 0} />
                ))}
              </>
            )}

            {activeTab === 'modules' && (
              <>
                {DYNAMIC_CATEGORIES.map(cat => {
                  const isActive = cat.moduleKey === null || ACTIVE_MODULES[cat.moduleKey]
                  if (!isActive) return <InactiveCategoryStub key={cat.id} category={cat} />
                  return <CategoryCard key={cat.id} category={cat} defaultOpen={completionStats(cat.docs).missing > 0} />
                })}
              </>
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>
    </div>
  )
}
