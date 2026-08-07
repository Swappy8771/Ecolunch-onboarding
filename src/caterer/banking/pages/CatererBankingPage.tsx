import { useState } from 'react'
import {
  CreditCard, Building2, ArrowLeftRight, FileText,
  CheckCircle2, AlertTriangle, Shield, Lock, Edit3, X, WifiOff, RefreshCw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import { CompletionChart } from '../../../shared/components/CompletionChart'
import type { ChartRow } from '../../../shared/components/CompletionChart'
import { useCatererBanking, useCatererBankingOverview } from '@/features/catererBanking/hooks/useCatererBankingQueries'
import { useSaveCatererBanking } from '@/features/catererBanking/hooks/useCatererBankingActions'
import type {
  BankingRecordViewModel, BankingAccountType,
} from '@/features/catererBanking/types/catererBanking.types'
import type { CreateOrUpdateBankingBody } from '@/api/modules/caterer-banking.api'

/**
 * Real, tenant-scoped data via `/caterer/banking/*` — masked only. The
 * backend never returns a full IBAN/account number here (only `*Last4`);
 * revealing the real value is a separately-audited, admin-only action
 * that intentionally has no caterer-facing equivalent. There is also no
 * "upload/replace document" flow wired here — the caterer-side Document
 * Vault is still mock, so the 3 banking document references
 * (RIB/statement/authorization letter) are shown as a plain requirements
 * checklist, not a real upload UI, and are optional advanced fields in
 * the edit form.
 */

const REQUIRED_DOC_LABELS: { key: 'ribDocumentId' | 'bankStatementDocId' | 'authorizationLetterId'; label: string; description: string }[] = [
  { key: 'ribDocumentId', label: "RIB (Relevé d'Identité Bancaire)", description: 'Official bank identity document issued by your bank' },
  { key: 'bankStatementDocId', label: 'Recent Bank Statement', description: 'Bank statement from the last 3 months' },
  { key: 'authorizationLetterId', label: 'Bank Authorization Letter', description: 'Letter authorizing EcoLunch to initiate transfers' },
]

// ─── Loading / error states ───────────────────────────────────

/** Static breadcrumb + title only — shown even before data has loaded, so the page heading is never missing during loading/error states. */
function PageHeading() {
  return (
    <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
        Caterer Portal / Banks &amp; Banking Information
      </p>
      <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>Banking Information</h1>
    </div>
  )
}

function PageLoading() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="h-24 rounded-2xl" style={{ background: 'var(--bg-card)' }} />
      <div className="h-64 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
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
        <p className="text-[14px] font-bold mb-1" style={{ color: '#f87171' }}>Failed to load your banking information</p>
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

// ─── Banking form modal (create or edit — one combined submission) ────

const ACCOUNT_TYPES: { value: BankingAccountType; label: string }[] = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'business', label: 'Business Checking' },
]

function Field({ label, children, required }: { label: React.ReactNode; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11.5px] font-bold" style={{ color: 'var(--text-3)' }}>
        {label}{required && <span style={{ color: '#f87171' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: 'var(--bg-inner)', color: 'var(--text-1)', border: '1px solid var(--border-default)',
} as const

function BankingFormModal({ existing, onClose }: { existing: BankingRecordViewModel | null; onClose: () => void }) {
  const save = useSaveCatererBanking()
  const [region, setRegion] = useState<'qc' | 'fr'>(existing?.transit.codeEtablissement ? 'fr' : 'qc')
  const [form, setForm] = useState({
    bankName: existing?.institution.bankName ?? '',
    branchName: existing?.institution.branchName ?? '',
    branchCode: existing?.institution.branchCode ?? '',
    bicSwift: existing?.institution.bicSwift ?? '',
    bankCountry: existing?.institution.bankCountry ?? '',
    accountHolder: existing?.account.accountHolder ?? '',
    accountType: (existing?.account.accountType ?? 'checking') as BankingAccountType,
    currency: existing?.account.currency ?? 'CAD',
    iban: '',
    accountNumber: '',
    transitNumber: existing?.transit.transitNumber ?? '',
    institutionNumber: existing?.transit.institutionNumber ?? '',
    codeEtablissement: existing?.transit.codeEtablissement ?? '',
    codeGuichet: existing?.transit.codeGuichet ?? '',
    cleRib: existing?.transit.cleRib ?? '',
    ribDocumentId: existing?.documents.ribDocumentId ?? '',
    bankStatementDocId: existing?.documents.bankStatementDocId ?? '',
    authorizationLetterId: existing?.documents.authorizationLetterId ?? '',
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleSubmit() {
    const body: CreateOrUpdateBankingBody = {
      bankName: form.bankName,
      branchName: form.branchName || undefined,
      branchCode: form.branchCode || undefined,
      bicSwift: form.bicSwift,
      bankCountry: form.bankCountry,
      accountHolder: form.accountHolder,
      accountType: form.accountType,
      currency: form.currency,
      iban: form.iban,
      accountNumber: form.accountNumber,
      transitNumber: region === 'qc' ? form.transitNumber || undefined : undefined,
      institutionNumber: region === 'qc' ? form.institutionNumber || undefined : undefined,
      codeEtablissement: region === 'fr' ? form.codeEtablissement || undefined : undefined,
      codeGuichet: region === 'fr' ? form.codeGuichet || undefined : undefined,
      cleRib: region === 'fr' ? form.cleRib || undefined : undefined,
      ribDocumentId: form.ribDocumentId || undefined,
      bankStatementDocId: form.bankStatementDocId || undefined,
      authorizationLetterId: form.authorizationLetterId || undefined,
    }
    save.mutate(body, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl flex flex-col rounded-2xl overflow-hidden shadow-2xl max-h-[90vh]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

        <div className="flex items-center justify-between gap-4 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <p className="text-[14px] font-black" style={{ color: 'var(--text-1)' }}>
            {existing ? 'Edit Banking Information' : 'Add Banking Information'}
          </p>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <X size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Bank Name" required>
              <input value={form.bankName} onChange={e => set('bankName', e.target.value)} className="px-3 py-2 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </Field>
            <Field label="Bank Country (ISO-2)" required>
              <input value={form.bankCountry} onChange={e => set('bankCountry', e.target.value.toUpperCase())} maxLength={2} placeholder="CA, FR…" className="px-3 py-2 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </Field>
            <Field label="Branch Name">
              <input value={form.branchName} onChange={e => set('branchName', e.target.value)} className="px-3 py-2 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </Field>
            <Field label="Branch Code">
              <input value={form.branchCode} onChange={e => set('branchCode', e.target.value)} className="px-3 py-2 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </Field>
            <Field label="SWIFT / BIC" required>
              <input value={form.bicSwift} onChange={e => set('bicSwift', e.target.value.toUpperCase())} placeholder="8 or 11 characters" className="px-3 py-2 rounded-xl text-[13px] outline-none font-mono" style={inputStyle} />
            </Field>
          </div>

          <div className="h-px" style={{ background: 'var(--border-default)' }} />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Account Holder" required>
              <input value={form.accountHolder} onChange={e => set('accountHolder', e.target.value)} className="px-3 py-2 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </Field>
            <Field label="Account Type" required>
              <select value={form.accountType} onChange={e => set('accountType', e.target.value as BankingAccountType)} className="px-3 py-2 rounded-xl text-[13px] outline-none" style={inputStyle}>
                {ACCOUNT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Currency (ISO-3)" required>
              <input value={form.currency} onChange={e => set('currency', e.target.value.toUpperCase())} maxLength={3} className="px-3 py-2 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </Field>
            <div />
            <Field label={<span className="flex items-center gap-1.5">IBAN <Lock size={9} strokeWidth={2.5} /></span>} required={!existing}>
              <input value={form.iban} onChange={e => set('iban', e.target.value.toUpperCase())} placeholder={existing?.account.ibanLast4 ? `Currently •••• ${existing.account.ibanLast4} — leave blank to keep, or enter to replace` : 'Full IBAN'} className="px-3 py-2 rounded-xl text-[13px] outline-none font-mono" style={inputStyle} />
            </Field>
            <Field label={<span className="flex items-center gap-1.5">Account Number <Lock size={9} strokeWidth={2.5} /></span>} required={!existing}>
              <input value={form.accountNumber} onChange={e => set('accountNumber', e.target.value)} placeholder={existing?.account.accountNumberLast4 ? `Currently •••• ${existing.account.accountNumberLast4} — leave blank to keep, or enter to replace` : 'Full account number'} className="px-3 py-2 rounded-xl text-[13px] outline-none font-mono" style={inputStyle} />
            </Field>
          </div>

          <div className="h-px" style={{ background: 'var(--border-default)' }} />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11.5px] font-bold" style={{ color: 'var(--text-3)' }}>Region</span>
              <div className="flex items-center gap-1.5 rounded-xl p-1" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
                {(['qc', 'fr'] as const).map(r => (
                  <button key={r} onClick={() => setRegion(r)}
                    className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer"
                    style={{ background: region === r ? 'var(--accent)' : 'transparent', color: region === r ? '#07070a' : 'var(--text-3)' }}>
                    {r === 'qc' ? 'Quebec' : 'France'}
                  </button>
                ))}
              </div>
            </div>
            {region === 'qc' ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Transit Number (5 digits)" required>
                  <input value={form.transitNumber} onChange={e => set('transitNumber', e.target.value)} maxLength={5} className="px-3 py-2 rounded-xl text-[13px] outline-none font-mono" style={inputStyle} />
                </Field>
                <Field label="Institution Number (3 digits)" required>
                  <input value={form.institutionNumber} onChange={e => set('institutionNumber', e.target.value)} maxLength={3} className="px-3 py-2 rounded-xl text-[13px] outline-none font-mono" style={inputStyle} />
                </Field>
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Code Établissement (5 digits)" required>
                  <input value={form.codeEtablissement} onChange={e => set('codeEtablissement', e.target.value)} maxLength={5} className="px-3 py-2 rounded-xl text-[13px] outline-none font-mono" style={inputStyle} />
                </Field>
                <Field label="Code Guichet (5 digits)" required>
                  <input value={form.codeGuichet} onChange={e => set('codeGuichet', e.target.value)} maxLength={5} className="px-3 py-2 rounded-xl text-[13px] outline-none font-mono" style={inputStyle} />
                </Field>
                <Field label="Clé RIB (2 digits)" required>
                  <input value={form.cleRib} onChange={e => set('cleRib', e.target.value)} maxLength={2} className="px-3 py-2 rounded-xl text-[13px] outline-none font-mono" style={inputStyle} />
                </Field>
              </div>
            )}
          </div>

          <div className="h-px" style={{ background: 'var(--border-default)' }} />

          <div className="flex flex-col gap-2.5">
            <p className="text-[11px] uppercase tracking-[0.12em] font-black" style={{ color: 'var(--text-4)' }}>
              Document References (optional — advanced)
            </p>
            <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
              Document upload isn't available yet in this portal. If a document was already uploaded elsewhere and you have its id, you can link it here.
            </p>
            {REQUIRED_DOC_LABELS.map(d => (
              <Field key={d.key} label={d.label}>
                <input
                  value={form[d.key]}
                  onChange={e => set(d.key, e.target.value)}
                  placeholder="Document id"
                  className="px-3 py-2 rounded-xl text-[12px] outline-none font-mono"
                  style={inputStyle}
                />
              </Field>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={save.isPending}
            className="px-5 py-2.5 rounded-xl text-[12.5px] font-black cursor-pointer disabled:opacity-50"
            style={{ background: 'var(--accent)', color: '#07070a', border: '1px solid transparent' }}>
            {save.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Read-only section card ───────────────────────────────────

function ReadRow({ label, value, sensitive }: { label: string; value: string | null; sensitive?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <span className="text-[12px] font-medium shrink-0 flex items-center gap-1" style={{ color: 'var(--text-3)', minWidth: 148 }}>
        {label}
        {sensitive && <Lock size={9} strokeWidth={2.5} style={{ color: 'var(--text-4)', opacity: 0.6 }} />}
      </span>
      <span className={`text-[12px] font-semibold text-right ${sensitive ? 'font-mono' : ''}`} style={{ color: value ? 'var(--text-2)' : 'var(--text-4)' }}>
        {value ?? '—'}
      </span>
    </div>
  )
}

function SectionCard({ icon: Icon, title, rows }: { icon: LucideIcon; title: string; rows: { label: string; value: string | null; sensitive?: boolean }[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="flex items-center gap-3 px-5 py-4" style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
          <Icon size={15} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
        </div>
        <h2 className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{title}</h2>
      </div>
      {rows.map(r => <ReadRow key={r.label} {...r} />)}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function CatererBankingPage() {
  const bankingQuery = useCatererBanking(undefined)
  const overviewQuery = useCatererBankingOverview(undefined)
  const [modalOpen, setModalOpen] = useState(false)

  if (bankingQuery.isLoading || overviewQuery.isLoading) {
    return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}><PageHeading /><PageLoading /></div>
  }
  if (bankingQuery.isError || overviewQuery.isError || !overviewQuery.data) {
    return (
      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
        <PageHeading />
        <PageError onRetry={() => { bankingQuery.refetch(); overviewQuery.refetch() }} />
      </div>
    )
  }

  const record = bankingQuery.data ?? null
  const overview = overviewQuery.data
  const overallPct = overview.completion.completionPercentage
  const missingDocKeys = new Set(overview.missingDocuments.map(d => d.documentKey))
  const totalMissing = overview.completion.missingFields.length + overview.missingDocuments.length

  const chartRows: ChartRow[] = overview.completion.sections.map(s => {
    const pct = s.percentage
    const barColor = pct === 100 ? '#4ade80' : pct >= 60 ? 'var(--accent)' : '#fbbf24'
    return {
      id: s.key,
      label: s.key === 'institution' ? 'Banking Institution Details' : s.key === 'account' ? 'Account Information' : 'Transit Information',
      pct,
      barColor,
      badge: pct === 100
        ? { label: 'Complete', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', Icon: CheckCircle2 }
        : { label: 'Incomplete', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', Icon: AlertTriangle },
    }
  })

  return (
    <>
      {modalOpen && <BankingFormModal existing={record} onClose={() => setModalOpen(false)} />}

      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
                Caterer Portal / Banks &amp; Banking Information
              </p>
              <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>Banking Information</h1>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>Required for onboarding completion</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 shrink-0" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <div>
                <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>Banking Completion</p>
                <div className="flex items-center gap-2.5">
                  <span className="text-[20px] font-black leading-none" style={{ color: 'var(--accent)' }}>{overallPct}%</span>
                  <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
                    <div className="h-full rounded-full" style={{ width: `${overallPct}%`, background: 'var(--accent)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PageTabs
          tabs={[
            { id: 'overview', label: 'Overview', icon: <Shield size={13} strokeWidth={1.8} />, badge: totalMissing > 0 ? totalMissing : undefined },
            { id: 'bank-details', label: 'Bank Details', icon: <Building2 size={13} strokeWidth={1.8} /> },
            { id: 'documents', label: 'Documents', icon: <FileText size={13} strokeWidth={1.8} />, badge: overview.missingDocuments.length || undefined },
          ]}>
          {activeTab => (
            <div className="px-5 py-6 flex flex-col gap-6">

              {activeTab === 'overview' && (
                <>
                  <CompletionChart
                    title="Banking Completion & Validation Status"
                    overallPct={overallPct}
                    filled={overview.completion.completedFields.length}
                    total={overview.completion.totalFields}
                    subtitle="banking complete"
                    rows={chartRows}
                  />

                  {totalMissing > 0 && (
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.22)' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
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
                            {overview.completion.missingFields.map(field => (
                              <span key={field} className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-xl"
                                style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                                {field}<span className="text-[10px] font-normal" style={{ opacity: 0.7 }}>· Field</span>
                              </span>
                            ))}
                            {overview.missingDocuments.map(doc => (
                              <span key={doc.documentKey} className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-xl"
                                style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                                {doc.label}<span className="text-[10px] font-normal" style={{ opacity: 0.7 }}>· Document</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'bank-details' && (
                <>
                  <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                    <div className="flex items-center gap-3">
                      <Shield size={14} strokeWidth={1.8} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <p className="text-[12px]" style={{ color: 'var(--text-4)' }}>
                        Your banking information is encrypted at rest using AES-256. Only authorized EcoLunch administrators can reveal the full IBAN/account number — you'll only ever see the last 4 digits here.
                      </p>
                    </div>
                    <button onClick={() => setModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold cursor-pointer shrink-0"
                      style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
                      <Edit3 size={12} strokeWidth={2} />{record ? 'Edit' : 'Add Banking Information'}
                    </button>
                  </div>

                  {record ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
                      <div className="flex flex-col gap-5">
                        <SectionCard icon={Building2} title="Banking Institution Details" rows={[
                          { label: 'Bank Name', value: record.institution.bankName },
                          { label: 'Branch Name', value: record.institution.branchName },
                          { label: 'Branch Code', value: record.institution.branchCode },
                          { label: 'SWIFT / BIC', value: record.institution.bicSwift },
                          { label: 'Bank Country', value: record.institution.bankCountry },
                        ]} />
                        <SectionCard icon={ArrowLeftRight} title="Transit Information" rows={[
                          ...(record.transit.transitNumber || record.transit.institutionNumber ? [
                            { label: 'Transit Number', value: record.transit.transitNumber },
                            { label: 'Institution Number', value: record.transit.institutionNumber },
                          ] : [
                            { label: 'Code Établissement', value: record.transit.codeEtablissement },
                            { label: 'Code Guichet', value: record.transit.codeGuichet },
                            { label: 'Clé RIB', value: record.transit.cleRib },
                            { label: 'SEPA Compliant', value: record.transit.sepaCompliant === null ? null : record.transit.sepaCompliant ? 'Yes' : 'No' },
                          ]),
                        ]} />
                      </div>
                      <SectionCard icon={CreditCard} title="Account Information" rows={[
                        { label: 'Account Holder', value: record.account.accountHolder },
                        { label: 'IBAN', value: record.account.ibanLast4 ? `•••• ${record.account.ibanLast4}` : null, sensitive: true },
                        { label: 'Account Type', value: record.account.accountType },
                        { label: 'Currency', value: record.account.currency },
                        { label: 'Account Number', value: record.account.accountNumberLast4 ? `•••• ${record.account.accountNumberLast4}` : null, sensitive: true },
                      ]} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 px-5 py-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
                        <CreditCard size={18} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
                      </div>
                      <div>
                        <p className="text-[14px] font-black" style={{ color: 'var(--text-1)' }}>No Banking Information Yet</p>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>Add your bank details to continue onboarding.</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'documents' && (
                <section>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
                      <FileText size={13} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-1)' }}>Required Banking Documents</h2>
                  </div>
                  <p className="text-[12px] mb-4" style={{ color: 'var(--text-4)' }}>
                    Document upload isn't available in this portal yet — reference an existing document's id via "Edit" on the Bank Details tab once Document Vault upload is available.
                  </p>
                  <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                    {REQUIRED_DOC_LABELS.map((doc, i) => {
                      const missing = missingDocKeys.has(doc.key)
                      return (
                        <div key={doc.key} className="flex items-center justify-between gap-3 px-5 py-3.5"
                          style={{ borderBottom: i < REQUIRED_DOC_LABELS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-bold" style={{ color: 'var(--text-1)' }}>{doc.label}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{doc.description}</p>
                          </div>
                          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
                            style={missing
                              ? { background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }
                              : { background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
                            {missing ? 'Missing' : 'Provided'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              <div className="h-4" />
            </div>
          )}
        </PageTabs>
      </div>
    </>
  )
}
