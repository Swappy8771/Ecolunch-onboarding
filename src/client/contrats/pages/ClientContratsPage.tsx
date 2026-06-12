import { useState } from 'react'
import {
  FilePen, CheckCircle2, Clock, AlertTriangle, Rocket,
  Eye, PenLine, ShieldCheck, X, ChevronRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────

type ContractStatus = 'pending' | 'signed'

interface Contract {
  id: string
  title: string
  subtitle: string
  description: string
  version: string
  pages: number
  required: boolean
  goLiveBlocker: boolean
  status: ContractStatus
  signedDate: string | null
  signedBy: string | null
  summaryPoints: string[]
}

// ─── Contract data ────────────────────────────────────────────

const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'msa',
    title: 'Master Service Agreement',
    subtitle: 'MSA — Core platform service contract',
    description: 'Governs the full service relationship between your organisation and EcoLunch, including obligations, fees, and termination terms.',
    version: 'v2.1', pages: 18, required: true, goLiveBlocker: true,
    status: 'pending', signedDate: null, signedBy: null,
    summaryPoints: [
      'EcoLunch provides platform access, order management, and billing infrastructure.',
      'Service fee: 3.5% per transaction, invoiced monthly with 30-day payment terms.',
      'Caterer must maintain food quality and HACCP certification throughout the contract.',
      "Either party may terminate with 60 days' written notice.",
      'Governed by French law — jurisdiction: Paris Commercial Court.',
    ],
  },
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    subtitle: 'NDA — Confidentiality of platform data',
    description: 'Protects the confidentiality of platform data, pricing, student and parent personal data, and business processes shared during onboarding.',
    version: 'v1.4', pages: 6, required: true, goLiveBlocker: false,
    status: 'signed', signedDate: '2025-08-22', signedBy: 'Marie Dupont',
    summaryPoints: [
      'All platform data, pricing structures, and processes are strictly confidential.',
      'Covers student / parent personal data, menu data, and financial information.',
      'Confidentiality obligation persists for 3 years after contract termination.',
      'Breach is subject to a €50,000 penalty under French commercial law.',
    ],
  },
  {
    id: 'dpa',
    title: 'Data Processing Agreement',
    subtitle: 'DPA — GDPR data processing compliance',
    description: "Establishes the caterer's role as data processor under GDPR for personal data of students and parents accessed via the EcoLunch platform.",
    version: 'v3.0', pages: 12, required: true, goLiveBlocker: true,
    status: 'pending', signedDate: null, signedBy: null,
    summaryPoints: [
      'Caterer acts as data processor; EcoLunch is the data controller.',
      'Personal data covered: student names, dietary requirements, and allergy profiles.',
      'Data must not be retained beyond contract duration without explicit consent.',
      'All sub-processors must be approved by EcoLunch in writing before use.',
      'Data breaches must be reported to EcoLunch within 24 hours of discovery.',
    ],
  },
  {
    id: 'terms',
    title: 'EcoLunch Platform Terms & Conditions',
    subtitle: 'T&C — Acceptable use of the platform',
    description: 'Defines acceptable use of the EcoLunch portal, mobile applications, and API integrations available to your organisation.',
    version: 'v5.2', pages: 8, required: true, goLiveBlocker: false,
    status: 'signed', signedDate: '2025-08-22', signedBy: 'Marie Dupont',
    summaryPoints: [
      'Caterer is responsible for the accuracy of all menu and allergy data entered.',
      'EcoLunch may suspend platform access immediately for policy violations.',
      "Updates to terms are communicated with a minimum of 30 days' notice.",
      'API credentials must not be shared outside the authorised organisation.',
    ],
  },
  {
    id: 'food-safety',
    title: 'Food Safety Compliance Declaration',
    subtitle: 'FSCD — HACCP and hygiene compliance',
    description: 'Formal declaration confirming your organisation complies with French food safety regulations and maintains valid HACCP certification.',
    version: 'v1.0', pages: 4, required: true, goLiveBlocker: true,
    status: 'pending', signedDate: null, signedBy: null,
    summaryPoints: [
      'Caterer confirms that HACCP certification is current, valid, and on file.',
      'Premises are subject to unannounced inspection by EcoLunch partner agencies.',
      'Any food safety incident must be reported to EcoLunch within 24 hours.',
      'Non-compliance results in immediate suspension of platform access and services.',
    ],
  },
  {
    id: 'sla',
    title: 'Service Level Agreement',
    subtitle: 'SLA — Service performance commitments',
    description: 'Defines mutual service performance commitments including menu submission deadlines, allergy update response times, and order confirmation windows.',
    version: 'v1.2', pages: 7, required: true, goLiveBlocker: false,
    status: 'pending', signedDate: null, signedBy: null,
    summaryPoints: [
      'Menu uploads must be completed 5 business days before each service start date.',
      'Allergy profile updates: maximum 2-hour response time during service hours.',
      'Order confirmations required same-day for orders placed before 12:00.',
      'Planned downtime communicated to EcoLunch at least 48 hours in advance.',
    ],
  },
]

// ─── Status meta ──────────────────────────────────────────────

const STATUS_META: Record<ContractStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: { label: 'Pending Signature', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.28)'  },
  signed:  { label: 'Signed',            color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
}

// ─── Signing Modal ────────────────────────────────────────────

function SigningModal({
  contract, onSign, onClose,
}: {
  contract: Contract
  onSign: (signedBy: string) => void
  onClose: () => void
}) {
  const [checked, setChecked]   = useState(false)
  const [name, setName]         = useState('Marie Dupont')

  const today = new Date().toISOString().slice(0, 10)
  const canSign = checked && name.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg flex flex-col rounded-2xl overflow-hidden shadow-2xl max-h-[90vh]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
              <FilePen size={16} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-black leading-snug truncate" style={{ color: 'var(--text-1)' }}>
                {contract.title}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
                {contract.version} &nbsp;·&nbsp; {contract.pages} pages &nbsp;·&nbsp; Signing date: {today}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer shrink-0 transition-opacity hover:opacity-70"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <X size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Description */}
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
            {contract.description}
          </p>

          {/* Summary points */}
          <div className="flex flex-col gap-0 rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--border-default)' }}>
            <div className="px-4 py-2.5"
              style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
              <p className="text-[11px] uppercase tracking-[0.13em] font-black" style={{ color: 'var(--text-4)' }}>
                Key Terms Summary
              </p>
            </div>
            <div className="flex flex-col px-4 py-1">
              {contract.summaryPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5"
                  style={{ borderBottom: i < contract.summaryPoints.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <ChevronRight size={12} strokeWidth={2.5} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{pt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* View full contract CTA */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer w-full justify-center transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
            <Eye size={13} strokeWidth={2} />
            View Full Contract ({contract.pages} pages)
          </button>

          {/* Signee name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-bold" style={{ color: 'var(--text-3)' }}>
              Full Legal Name of Signatory
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full legal name"
              className="w-full px-3.5 py-2.5 rounded-xl text-[13px] font-medium outline-none"
              style={{
                background: 'var(--bg-inner)',
                color: 'var(--text-1)',
                border: `1px solid ${name.trim() ? 'var(--border-strong)' : 'var(--border-default)'}`,
              }}
            />
            <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
              Must match the authorised signatory on your company registration.
            </p>
          </div>

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setChecked(c => !c)}
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all"
              style={{
                background: checked ? 'var(--accent)' : 'var(--bg-inner)',
                border: `2px solid ${checked ? 'var(--accent)' : 'var(--border-strong)'}`,
              }}>
              {checked && <CheckCircle2 size={12} strokeWidth={3} style={{ color: '#07070a' }} />}
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
              I confirm that I have read and understood the full contents of this agreement, that I am authorised to sign on behalf of my organisation, and that I agree to be bound by all terms and conditions set out herein.
            </p>
          </label>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 flex-wrap"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
            Cancel — Review Later
          </button>
          <button
            disabled={!canSign}
            onClick={() => onSign(name.trim())}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12.5px] font-black cursor-pointer transition-opacity"
            style={{
              background: canSign ? 'var(--accent)' : 'var(--bg-inner)',
              color: canSign ? '#07070a' : 'var(--text-4)',
              border: `1px solid ${canSign ? 'transparent' : 'var(--border-default)'}`,
              cursor: canSign ? 'pointer' : 'not-allowed',
              opacity: canSign ? 1 : 0.6,
            }}>
            <PenLine size={13} strokeWidth={2.5} />
            Sign Contract
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Contract card ────────────────────────────────────────────

function ContractCard({
  contract, onSign,
}: {
  contract: Contract
  onSign: () => void
}) {
  const m = STATUS_META[contract.status]
  const isSigned  = contract.status === 'signed'
  const borderL   = isSigned ? '#4ade80' : contract.goLiveBlocker ? '#f87171' : '#fbbf24'

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${borderL}`,
      }}>
      <div className="px-5 py-5 flex items-start gap-4">

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: isSigned ? 'rgba(74,222,128,0.12)' : 'var(--bg-inner)',
            border: `1px solid ${isSigned ? 'rgba(74,222,128,0.28)' : 'var(--border-default)'}`,
          }}>
          {isSigned
            ? <CheckCircle2 size={16} strokeWidth={1.8} style={{ color: '#4ade80' }} />
            : <FilePen size={16} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
          }
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="text-[14px] font-black" style={{ color: 'var(--text-1)' }}>{contract.title}</h3>
                {contract.required && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                    Required
                  </span>
                )}
                {contract.goLiveBlocker && !isSigned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                    <Rocket size={8} strokeWidth={2.5} />Go-Live Blocker
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>{contract.subtitle}</p>
            </div>
            {/* Status badge */}
            <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
              style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
              {isSigned
                ? <CheckCircle2 size={10} strokeWidth={2.5} />
                : <Clock size={10} strokeWidth={2.5} />
              }
              {m.label}
            </span>
          </div>

          {/* Description */}
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-4)' }}>
            {contract.description}
          </p>

          {/* Signing info or metadata */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-4)' }}>
              <span style={{ color: 'var(--text-4)' }}>{contract.version}</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span>{contract.pages} pages</span>
              {isSigned && contract.signedDate && (
                <>
                  <span style={{ color: 'var(--border-strong)' }}>·</span>
                  <span className="font-semibold" style={{ color: '#4ade80' }}>
                    Signed {contract.signedDate} by {contract.signedBy}
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
                <Eye size={12} strokeWidth={2} />
                View
              </button>
              {isSigned ? (
                <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold"
                  style={{ background: 'rgba(74,222,128,0.10)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  Signed
                </span>
              ) : (
                <button onClick={onSign}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black cursor-pointer transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)', color: '#07070a', border: '1px solid transparent' }}>
                  <PenLine size={12} strokeWidth={2.5} />
                  Sign Contract
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Go-Live Blockers Banner ──────────────────────────────────

function BlockersBanner({ blockers }: { blockers: Contract[] }) {
  if (blockers.length === 0) return null

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(248,113,113,0.30)', background: 'rgba(248,113,113,0.05)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(248,113,113,0.18)', background: 'rgba(248,113,113,0.08)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.30)' }}>
          <Rocket size={14} strokeWidth={1.8} style={{ color: '#f87171' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-black" style={{ color: '#f87171' }}>
            Go-Live Blocked — {blockers.length} Unsigned Contract{blockers.length > 1 ? 's' : ''}
          </p>
          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            The following contracts must be signed before your account can go live on EcoLunch.
          </p>
        </div>
      </div>
      {/* Blocker list */}
      <div className="px-5 py-3 flex flex-col gap-0">
        {blockers.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3 py-2.5"
            style={{ borderBottom: i < blockers.length - 1 ? '1px solid rgba(248,113,113,0.12)' : 'none' }}>
            <AlertTriangle size={12} strokeWidth={2} style={{ color: '#f87171', flexShrink: 0 }} />
            <p className="text-[12.5px] font-semibold flex-1" style={{ color: 'var(--text-2)' }}>{c.title}</p>
            <span className="text-[10.5px] font-bold" style={{ color: 'var(--text-4)' }}>
              {c.version} · {c.pages} pages
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Progress summary ─────────────────────────────────────────

function SignatureSummary({ contracts }: { contracts: Contract[] }) {
  const total    = contracts.length
  const signed   = contracts.filter(c => c.status === 'signed').length
  const pending  = total - signed
  const required = contracts.filter(c => c.required)
  const reqSigned = required.filter(c => c.status === 'signed').length
  const pct = total > 0 ? Math.round((signed / total) * 100) : 0

  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl flex-wrap"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      {/* Percentage */}
      <div className="shrink-0 text-center" style={{ minWidth: 52 }}>
        <p className="text-[28px] font-black leading-none" style={{ color: 'var(--accent)' }}>{pct}%</p>
        <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Signed</p>
      </div>
      {/* Bar + counts */}
      <div className="flex-1 min-w-[160px] flex flex-col gap-2">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
        <p className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
          {reqSigned} of {required.length} required contracts signed
        </p>
      </div>
      {/* Chips */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.28)' }}>
          <CheckCircle2 size={11} strokeWidth={2.5} />{signed} Signed
        </span>
        {pending > 0 && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.28)' }}>
            <Clock size={11} strokeWidth={2.5} />{pending} Pending
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function ClientContratsPage() {
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS)
  const [signingId, setSigningId] = useState<string | null>(null)

  const blocker    = contracts.filter(c => c.goLiveBlocker && c.status === 'pending')
  const pending    = contracts.filter(c => c.status === 'pending')
  const signed     = contracts.filter(c => c.status === 'signed')
  const signingContract = contracts.find(c => c.id === signingId) ?? null

  function handleSign(id: string, signedBy: string) {
    const today = new Date().toISOString().slice(0, 10)
    setContracts(prev =>
      prev.map(c => c.id === id ? { ...c, status: 'signed', signedDate: today, signedBy } : c)
    )
    setSigningId(null)
  }

  return (
    <>
      {/* ── Signing modal overlay ──── */}
      {signingContract && (
        <SigningModal
          contract={signingContract}
          onSign={by => handleSign(signingContract.id, by)}
          onClose={() => setSigningId(null)}
        />
      )}

      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

        {/* ── Page header ──────────── */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
          <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
            Client Portal / Contracts &amp; Signatures
          </p>
          <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
            Contracts &amp; Signatures
          </h1>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
            Review and sign all required onboarding agreements. All contracts must be signed before go-live.
          </p>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">

          {/* ── Signature progress ─── */}
          <SignatureSummary contracts={contracts} />

          {/* ── Go-live blockers ─────── */}
          <BlockersBanner blockers={blocker} />

          {/* ── Pending contracts ───── */}
          {pending.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap"
                  style={{ color: 'var(--text-4)' }}>
                  Pending Signature — {pending.length}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
              </div>
              {pending.map(c => (
                <ContractCard key={c.id} contract={c} onSign={() => setSigningId(c.id)} />
              ))}
            </div>
          )}

          {/* ── Signed contracts ─────── */}
          {signed.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap"
                  style={{ color: 'var(--text-4)' }}>
                  Signed — {signed.length}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
              </div>
              {signed.map(c => (
                <ContractCard key={c.id} contract={c} onSign={() => setSigningId(c.id)} />
              ))}
            </div>
          )}

          {/* ── All done state ────────── */}
          {pending.length === 0 && (
            <div className="flex items-center gap-4 px-5 py-5 rounded-2xl"
              style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.22)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.30)' }}>
                <ShieldCheck size={18} strokeWidth={1.8} style={{ color: '#4ade80' }} />
              </div>
              <div>
                <p className="text-[14px] font-black" style={{ color: '#4ade80' }}>All Contracts Signed</p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                  No signature blockers remain. Your account is cleared for go-live validation.
                </p>
              </div>
            </div>
          )}

          <div className="h-4" />
        </div>
      </div>
    </>
  )
}
