import {
  FilePen, CheckCircle2, Clock, AlertTriangle, Rocket,
  Download, Mail, ShieldCheck, WifiOff, RefreshCw, XCircle, Ban,
} from 'lucide-react'
import {
  useCatererContractsList, useCatererContractsProgress,
} from '@/features/catererContracts/hooks/useCatererContractsQueries'
import { useCatererContractDownload } from '@/features/catererContracts/hooks/useCatererContractsActions'
import type {
  ContractListItemViewModel, ContractStatus, ContractType,
} from '@/features/catererContracts/types/catererContracts.types'

/**
 * Real contracts are admin-created and admin-sent via Dropbox Sign — a
 * caterer never creates, requests, or in-app "signs" a contract here.
 * Signing happens entirely on Dropbox Sign's own hosted page, reached via
 * the email Dropbox Sign sends directly to the signatory; this backend
 * never generates or stores that link, so there is no "Sign Now" button —
 * only a note pointing the caterer to their email once a contract is sent.
 */

// ─── Display copy per contract type (labels only — status/dates are real) ──

const TYPE_META: Record<ContractType, { title: string; subtitle: string }> = {
  msa: { title: 'Master Service Agreement', subtitle: 'MSA — Core platform service contract' },
  nda: { title: 'Non-Disclosure Agreement', subtitle: 'NDA — Confidentiality of platform data' },
  dpa: { title: 'Data Processing Agreement', subtitle: 'DPA — GDPR data processing compliance' },
  platform_terms: { title: 'EcoLunch Platform Terms & Conditions', subtitle: 'T&C — Acceptable use of the platform' },
  food_safety: { title: 'Food Safety Compliance Declaration', subtitle: 'FSCD — HACCP and hygiene compliance' },
  module_annex: { title: 'Module Annex', subtitle: 'Module-specific contract terms' },
  fee_schedule: { title: 'Fee Schedule', subtitle: 'Pricing and fee terms' },
}

const STATUS_META: Record<ContractStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:            { label: 'Draft',              color: 'var(--text-4)', bg: 'var(--bg-inner)',          border: 'var(--border-default)' },
  ready_to_send:    { label: 'Ready to Send',       color: 'var(--text-4)', bg: 'var(--bg-inner)',          border: 'var(--border-default)' },
  sent:             { label: 'Awaiting Signature',  color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)',    border: 'rgba(251,191,36,0.28)' },
  viewed:           { label: 'Viewed — Not Signed', color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)',    border: 'rgba(251,191,36,0.28)' },
  partially_signed: { label: 'Partially Signed',    color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)',    border: 'rgba(251,191,36,0.28)' },
  signed:           { label: 'Signed',              color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',    border: 'rgba(74,222,128,0.28)' },
  declined:         { label: 'Declined',            color: '#f87171',       bg: 'rgba(248,113,113,0.12)',   border: 'rgba(248,113,113,0.28)' },
  expired:          { label: 'Expired',             color: '#f87171',       bg: 'rgba(248,113,113,0.12)',   border: 'rgba(248,113,113,0.28)' },
  canceled:         { label: 'Canceled',            color: 'var(--text-4)', bg: 'var(--bg-inner)',          border: 'var(--border-default)' },
  error:            { label: 'Send Failed',         color: '#f87171',       bg: 'rgba(248,113,113,0.12)',   border: 'rgba(248,113,113,0.28)' },
}

const AWAITING_EMAIL_STATUSES: ContractStatus[] = ['sent', 'viewed', 'partially_signed']

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  return iso.slice(0, 10)
}

// ─── Loading / error states ───────────────────────────────────

function PageLoading() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="h-24 rounded-2xl" style={{ background: 'var(--bg-card)' }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
      ))}
    </div>
  )
}

function PageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
        <WifiOff size={22} strokeWidth={1.5} style={{ color: '#f87171' }} />
      </div>
      <div>
        <p className="text-[14px] font-bold mb-1" style={{ color: '#f87171' }}>Failed to load your contracts</p>
        <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Check your connection and retry.</p>
      </div>
      <button onClick={onRetry}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
        style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
        <RefreshCw size={13} strokeWidth={2} />Retry
      </button>
    </div>
  )
}

// ─── Progress summary ─────────────────────────────────────────

function SignatureSummary({
  required, signed, pending, completionPercentage,
}: {
  required: number
  signed: number
  pending: number
  completionPercentage: number
}) {
  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl flex-wrap"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="shrink-0 text-center" style={{ minWidth: 52 }}>
        <p className="text-[28px] font-black leading-none" style={{ color: 'var(--accent)' }}>{completionPercentage}%</p>
        <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Signed</p>
      </div>
      <div className="flex-1 min-w-[160px] flex flex-col gap-2">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${completionPercentage}%`, background: 'var(--accent)' }} />
        </div>
        <p className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
          {signed} of {required} required contracts signed
        </p>
      </div>
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

// ─── Go-Live Blockers Banner ──────────────────────────────────

function BlockersBanner({ blockers }: { blockers: { contractId: string; type: ContractType; status: ContractStatus }[] }) {
  if (blockers.length === 0) return null

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(248,113,113,0.30)', background: 'rgba(248,113,113,0.05)' }}>
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
      <div className="px-5 py-3 flex flex-col gap-0">
        {blockers.map((b, i) => (
          <div key={b.contractId} className="flex items-center gap-3 py-2.5"
            style={{ borderBottom: i < blockers.length - 1 ? '1px solid rgba(248,113,113,0.12)' : 'none' }}>
            <AlertTriangle size={12} strokeWidth={2} style={{ color: '#f87171', flexShrink: 0 }} />
            <p className="text-[12.5px] font-semibold flex-1" style={{ color: 'var(--text-2)' }}>
              {TYPE_META[b.type]?.title ?? b.type}
            </p>
            <span className="text-[10.5px] font-bold" style={{ color: 'var(--text-4)' }}>
              {STATUS_META[b.status]?.label ?? b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Contract card ────────────────────────────────────────────

function ContractCard({ contract }: { contract: ContractListItemViewModel }) {
  const download = useCatererContractDownload()
  const meta = TYPE_META[contract.type] ?? { title: contract.type, subtitle: '' }
  const statusMeta = STATUS_META[contract.status]
  const isSigned = contract.status === 'signed'
  const isBlocked = contract.status === 'declined' || contract.status === 'expired' || contract.status === 'error'
  const borderL = isSigned ? '#4ade80' : isBlocked ? '#f87171' : 'var(--border-default)'

  function handleDownload() {
    download.mutate(contract.id, {
      onSuccess: (res) => window.open(res.url, '_blank', 'noopener,noreferrer'),
    })
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: `3px solid ${borderL}` }}>
      <div className="px-5 py-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: isSigned ? 'rgba(74,222,128,0.12)' : 'var(--bg-inner)',
            border: `1px solid ${isSigned ? 'rgba(74,222,128,0.28)' : 'var(--border-default)'}`,
          }}>
          {isSigned
            ? <CheckCircle2 size={16} strokeWidth={1.8} style={{ color: '#4ade80' }} />
            : isBlocked
              ? <XCircle size={16} strokeWidth={1.8} style={{ color: '#f87171' }} />
              : <FilePen size={16} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
          }
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h3 className="text-[14px] font-black" style={{ color: 'var(--text-1)' }}>{meta.title}</h3>
              <p className="text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>{meta.subtitle}</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
              style={{ background: statusMeta.bg, color: statusMeta.color, border: `1px solid ${statusMeta.border}` }}>
              {isSigned ? <CheckCircle2 size={10} strokeWidth={2.5} /> : isBlocked ? <Ban size={10} strokeWidth={2.5} /> : <Clock size={10} strokeWidth={2.5} />}
              {statusMeta.label}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-4)' }}>
              {contract.signatoryName && <span>Signatory: {contract.signatoryName}</span>}
              {formatDate(contract.sentAt) && (
                <>
                  {contract.signatoryName && <span style={{ color: 'var(--border-strong)' }}>·</span>}
                  <span>Sent {formatDate(contract.sentAt)}</span>
                </>
              )}
              {isSigned && formatDate(contract.signedAt) && (
                <>
                  <span style={{ color: 'var(--border-strong)' }}>·</span>
                  <span className="font-semibold" style={{ color: '#4ade80' }}>Signed {formatDate(contract.signedAt)}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isSigned && (
                <button onClick={handleDownload} disabled={download.isPending}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'var(--accent)', color: '#07070a', border: '1px solid transparent' }}>
                  <Download size={12} strokeWidth={2.5} />
                  {download.isPending ? 'Preparing…' : 'Download'}
                </button>
              )}
              {AWAITING_EMAIL_STATUSES.includes(contract.status) && (
                <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11.5px] font-semibold"
                  style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                  <Mail size={12} strokeWidth={2} />
                  Check your email to sign
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

/** Static breadcrumb + title only — shown even before data has loaded, so the page heading is never missing during loading/error states. */
function PageHeading() {
  return (
    <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
        Caterer Portal / Contracts &amp; Signatures
      </p>
      <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
        Contracts &amp; Signatures
      </h1>
    </div>
  )
}

export function CatererContractsPage() {
  const listQuery = useCatererContractsList(undefined)
  const progressQuery = useCatererContractsProgress(undefined)

  if (listQuery.isLoading || progressQuery.isLoading) {
    return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}><PageHeading /><PageLoading /></div>
  }
  if (listQuery.isError || progressQuery.isError || !listQuery.data || !progressQuery.data) {
    return (
      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
        <PageHeading />
        <PageError onRetry={() => { listQuery.refetch(); progressQuery.refetch() }} />
      </div>
    )
  }

  const contracts = listQuery.data
  const progress = progressQuery.data
  const pending = contracts.filter(c => c.status !== 'signed' && c.status !== 'canceled' && c.status !== 'draft')
  const signed = contracts.filter(c => c.status === 'signed')
  const other = contracts.filter(c => c.status === 'draft' || c.status === 'canceled')

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Caterer Portal / Contracts &amp; Signatures
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
          Contracts &amp; Signatures
        </h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
          Contracts sent by EcoLunch are signed on Dropbox Sign's secure page — check your email for the signing link.
          Once signed, the document is available here for download.
        </p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        <SignatureSummary
          required={progress.required}
          signed={progress.signed}
          pending={progress.pending}
          completionPercentage={progress.completionPercentage}
        />

        <BlockersBanner blockers={progress.blockers} />

        {pending.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap" style={{ color: 'var(--text-4)' }}>
                Pending Signature — {pending.length}
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
            </div>
            {pending.map(c => <ContractCard key={c.id} contract={c} />)}
          </div>
        )}

        {signed.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap" style={{ color: 'var(--text-4)' }}>
                Signed — {signed.length}
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
            </div>
            {signed.map(c => <ContractCard key={c.id} contract={c} />)}
          </div>
        )}

        {other.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap" style={{ color: 'var(--text-4)' }}>
                Other — {other.length}
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
            </div>
            {other.map(c => <ContractCard key={c.id} contract={c} />)}
          </div>
        )}

        {contracts.length === 0 && (
          <div className="flex items-center gap-4 px-5 py-5 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
              <FilePen size={18} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
            </div>
            <div>
              <p className="text-[14px] font-black" style={{ color: 'var(--text-1)' }}>No Contracts Yet</p>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                EcoLunch will send your contracts here once your onboarding reaches that stage.
              </p>
            </div>
          </div>
        )}

        {pending.length === 0 && contracts.length > 0 && (
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
  )
}
