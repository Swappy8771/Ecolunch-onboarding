import {
  Building2, Briefcase, User, MapPin, Receipt,
  CheckCircle2, AlertTriangle, Clock, Eye, Edit3,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────

type FieldStatus       = 'complete' | 'pending' | 'missing' | 'optional'
type SectionValidation = 'validated' | 'pending' | 'under-review' | 'not-submitted'

interface ProfileField {
  label: string
  value: string | null
  status: FieldStatus
  required: boolean
}

interface ProfileSection {
  id: string
  title: string
  validation: SectionValidation
  Icon: LucideIcon
  fields: ProfileField[]
}

// ─── Meta ────────────────────────────────────────────────────

const VALIDATION_META: Record<SectionValidation, {
  label: string; color: string; bg: string; border: string; Icon: LucideIcon
}> = {
  validated:       { label: 'Validated',     color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)',  Icon: CheckCircle2  },
  pending:         { label: 'Pending',       color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)',  Icon: Clock         },
  'under-review':  { label: 'Under Review',  color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)',  Icon: Eye           },
  'not-submitted': { label: 'Not Submitted', color: 'var(--text-4)', bg: 'var(--bg-inner)',        border: 'var(--border-default)',  Icon: AlertTriangle },
}

// ─── Mock data ───────────────────────────────────────────────

const SECTIONS: ProfileSection[] = [
  {
    id: 'company', title: 'Company Information', validation: 'validated', Icon: Building2,
    fields: [
      { label: 'Legal Name',        value: 'Concept Gourmet SARL',  status: 'complete', required: true  },
      { label: 'Trading Name',      value: 'Concept Gourmet',       status: 'complete', required: true  },
      { label: 'Organization Type', value: 'SARL',                  status: 'complete', required: true  },
      { label: 'Founded Year',      value: '2018',                  status: 'complete', required: false },
      { label: 'Website',           value: 'www.conceptgourmet.fr', status: 'complete', required: false },
      { label: 'Company Logo',      value: null,                    status: 'missing',  required: true  },
    ],
  },
  {
    id: 'business', title: 'Business Details', validation: 'pending', Icon: Briefcase,
    fields: [
      { label: 'Industry Sector',         value: 'Institutional Catering',           status: 'complete', required: true  },
      { label: 'Number of Employees',     value: '45',                               status: 'complete', required: true  },
      { label: 'Annual Capacity (meals)', value: null,                               status: 'missing',  required: true  },
      { label: 'Active Service Types',    value: 'School Meals, Daycare, ReportIQ',  status: 'pending',  required: true  },
      { label: 'Kitchen Locations',       value: '3',                                status: 'complete', required: true  },
      { label: 'Delivery Zones',          value: 'Île-de-France',                   status: 'complete', required: false },
    ],
  },
  {
    id: 'contact', title: 'Primary Contact Information', validation: 'validated', Icon: User,
    fields: [
      { label: 'Full Name',               value: 'Marie Dupont',               status: 'complete', required: true  },
      { label: 'Job Title',               value: 'Director of Operations',     status: 'complete', required: true  },
      { label: 'Email Address',           value: 'm.dupont@conceptgourmet.fr', status: 'complete', required: true  },
      { label: 'Phone Number',            value: '+33 6 12 34 56 78',         status: 'complete', required: true  },
      { label: 'Secondary Contact Name',  value: 'Thomas Bernard',             status: 'complete', required: false },
      { label: 'Secondary Contact Email', value: null,                         status: 'optional', required: false },
    ],
  },
  {
    id: 'address', title: 'Address Information', validation: 'pending', Icon: MapPin,
    fields: [
      { label: 'Registered Address',  value: '42 Rue de la Paix',  status: 'complete', required: true  },
      { label: 'City',                value: 'Paris',              status: 'complete', required: true  },
      { label: 'Postal Code',         value: '75001',              status: 'complete', required: true  },
      { label: 'Country',             value: 'France',             status: 'complete', required: true  },
      { label: 'Region / Department', value: 'Île-de-France',     status: 'complete', required: false },
      { label: 'Operating Address',   value: 'Same as registered', status: 'complete', required: false },
    ],
  },
  {
    id: 'tax', title: 'Tax Information', validation: 'under-review', Icon: Receipt,
    fields: [
      { label: 'SIRET Number',     value: '843 201 789 00021',   status: 'pending',  required: true  },
      { label: 'SIREN Number',     value: '843 201 789',         status: 'complete', required: true  },
      { label: 'VAT Number',       value: null,                  status: 'missing',  required: true  },
      { label: 'APE / NAF Code',   value: null,                  status: 'missing',  required: true  },
      { label: 'RCS Registration', value: 'Paris B 843 201 789', status: 'pending',  required: false },
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────

function sectionCompletion(section: ProfileSection) {
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

function SectionCard({ section }: { section: ProfileSection }) {
  const { filled, total } = sectionCompletion(section)
  const pct      = total > 0 ? Math.round(filled / total * 100) : 100
  const dotColor = pct === 100 ? '#4ade80' : pct >= 60 ? '#fbbf24' : '#f87171'

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

      {/* ── Card header ── */}
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

      {/* ── Field rows ── */}
      {section.fields.map((field, idx) => (
        <div key={field.label}
          className="flex items-start justify-between gap-4 px-5 py-3.5"
          style={{ borderBottom: idx < section.fields.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>

          {/* Label */}
          <span className="text-[12px] font-medium shrink-0"
            style={{ color: 'var(--text-3)', minWidth: 140 }}>
            {field.label}
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
                <span className="text-[12px] font-semibold text-right" style={{ color: 'var(--text-2)' }}>
                  {field.value}
                </span>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: 'rgba(251,191,36,0.10)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.20)' }}>
                  Under Review
                </span>
              </>
            ) : (
              <span className="text-[12px] font-semibold text-right" style={{ color: 'var(--text-2)' }}>
                {field.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────

export function ClientProfilePage() {
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

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
              Client Portal / Profile
            </p>
            <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              Company Profile
            </h1>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
              Concept Gourmet · Onboarding Phase 1
            </p>
          </div>

          {/* Compact completion indicator in header */}
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 shrink-0"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-1"
                style={{ color: 'var(--text-4)' }}>
                Profile Completion
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

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="px-5 py-6 flex flex-col gap-6">

        {/* ── Completion overview card ──────────────────────── */}
        <div className="rounded-2xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-4"
            style={{ color: 'var(--text-4)' }}>
            Profile Completion & Validation Status
          </p>

          <div className="flex items-start gap-8 flex-wrap">
            {/* Big % display */}
            <div className="shrink-0">
              <span className="text-[52px] font-black leading-none block" style={{ color: 'var(--accent)' }}>
                {overallPct}%
              </span>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                overall complete
              </p>
              <p className="text-[11.5px] font-semibold mt-0.5" style={{ color: 'var(--text-3)' }}>
                {allFilled.length} / {allRequired.length} required fields
              </p>
              <div className="mt-3 h-2 w-[120px] rounded-full overflow-hidden"
                style={{ background: 'var(--bg-inner)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${overallPct}%`, background: 'var(--accent)' }} />
              </div>
            </div>

            {/* Per-section breakdown */}
            <div className="flex-1 min-w-0 flex flex-col gap-3" style={{ minWidth: 240 }}>
              {SECTIONS.map(section => {
                const { filled, total } = sectionCompletion(section)
                const pct      = total > 0 ? Math.round(filled / total * 100) : 100
                const barColor = pct === 100 ? '#4ade80' : pct >= 60 ? 'var(--accent)' : '#fbbf24'
                const vm       = VALIDATION_META[section.validation]
                return (
                  <div key={section.id} className="flex items-center gap-3">
                    <span className="text-[12px] font-medium shrink-0 truncate"
                      style={{ color: 'var(--text-2)', width: 175 }}>
                      {section.title}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--bg-inner)', minWidth: 60 }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: barColor }} />
                    </div>
                    <span className="text-[11px] font-bold shrink-0 text-right"
                      style={{ color: 'var(--text-3)', width: 32 }}>
                      {pct}%
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: vm.bg, color: vm.color, border: `1px solid ${vm.border}` }}>
                      <vm.Icon size={9} strokeWidth={2.5} />
                      {vm.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Missing required fields alert ─────────────────── */}
        {missingFields.length > 0 && (
          <div className="rounded-2xl p-4"
            style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.22)' }}>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
                <AlertTriangle size={14} strokeWidth={2} style={{ color: '#f87171' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold" style={{ color: '#f87171' }}>
                  {missingFields.length} Required Field{missingFields.length !== 1 ? 's' : ''} Missing
                </p>
                <p className="text-[12px] mt-0.5 mb-3" style={{ color: 'var(--text-4)' }}>
                  Complete the following fields to advance your onboarding status.
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingFields.map(({ field, section }) => (
                    <span
                      key={`${section}-${field}`}
                      className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-xl cursor-pointer"
                      style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                      {field}
                      <span className="text-[10px] font-normal" style={{ opacity: 0.7 }}>
                        · {section.replace(' Information', '').replace(' Details', '')}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Profile sections grid ─────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">

          {/* Left column: Company, Business, Tax */}
          <div className="flex flex-col gap-5">
            {[SECTIONS[0], SECTIONS[1], SECTIONS[4]].map(s => (
              <SectionCard key={s.id} section={s} />
            ))}
          </div>

          {/* Right column: Contact, Address */}
          <div className="flex flex-col gap-5">
            {[SECTIONS[2], SECTIONS[3]].map(s => (
              <SectionCard key={s.id} section={s} />
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
