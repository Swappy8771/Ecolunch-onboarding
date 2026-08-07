import { useState } from 'react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import { RowMenu } from '../../../shared/components/DropdownMenu'
import { UploadRequirementModal } from '../components/UploadRequirementModal'
import {
  User2, Scale, Building2, ShieldCheck, Shield,
  FilePen, Rocket, BookOpen, Baby, Tent, Calculator, FileBarChart2,
  Upload, Eye, RefreshCcw, FileText, CheckCircle2, XCircle,
  AlertTriangle, Clock, ChevronDown, ChevronUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  useCatererDocumentVaultGroups, useCatererDocumentVaultProgress, useCatererDocumentVaultDocuments,
} from '@/features/catererDocumentVault/hooks/useCatererDocumentVaultQueries'
import {
  useUploadCatererDocument, useReplaceCatererDocument, useCatererDocumentDownloadLink,
} from '@/features/catererDocumentVault/hooks/useCatererDocumentVaultActions'
import type {
  DocumentRequirementViewModel, DocumentCategoryGroupViewModel, RequirementMatchStatus, DocumentViewModel,
} from '@/features/catererDocumentVault/types/catererDocumentVault.types'

// ─── Category icon/accent (base categories, keyed by category) ────────

const BASE_CATEGORY_META: Record<string, { title: string; Icon: LucideIcon; accent: string }> = {
  profile: { title: 'Profile', Icon: User2, accent: '#a78bfa' },
  legal: { title: 'Legal', Icon: Scale, accent: '#60a5fa' },
  banking: { title: 'Banking', Icon: Building2, accent: '#4ade80' },
  compliance: { title: 'Compliance & Permits', Icon: ShieldCheck, accent: '#fbbf24' },
  insurance: { title: 'Insurance', Icon: Shield, accent: '#f87171' },
  contracts: { title: 'Contracts & Signatures', Icon: FilePen, accent: '#c084fc' },
  golive: { title: 'Go-live', Icon: Rocket, accent: '#34d399' },
}

// ─── Module category icon/accent (keyed by moduleKey) ─────────────────

const MODULE_CATEGORY_META: Record<string, { Icon: LucideIcon; accent: string }> = {
  school_meals: { Icon: BookOpen, accent: '#4ade80' },
  daycare_meals: { Icon: Baby, accent: '#60a5fa' },
  camp_meals: { Icon: Tent, accent: '#fb923c' },
  accounting: { Icon: Calculator, accent: '#fb923c' },
  reportiq: { Icon: FileBarChart2, accent: '#a3e635' },
}

const DEFAULT_META = { Icon: FileText, accent: '#94a3b8' }

// ─── Status meta ──────────────────────────────────────────────

const STATUS_META: Record<RequirementMatchStatus, { label: string; color: string; bg: string; border: string; Icon: LucideIcon }> = {
  approved: { label: 'Approved', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.28)', Icon: CheckCircle2 },
  uploaded: { label: 'Uploaded', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.28)', Icon: Clock },
  under_review: { label: 'Under Review', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.28)', Icon: Clock },
  missing: { label: 'Missing', color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', Icon: AlertTriangle },
  rejected: { label: 'Rejected', color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', Icon: XCircle },
  correction_requested: { label: 'Correction Requested', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.28)', Icon: AlertTriangle },
}

function categoryMeta(category: string, moduleKey: string | null) {
  if (moduleKey) return { title: undefined, ...MODULE_CATEGORY_META[moduleKey] ?? DEFAULT_META }
  return BASE_CATEGORY_META[category] ?? { title: category, ...DEFAULT_META }
}

// ─── Shared primitives ────────────────────────────────────────

function StatusBadge({ status, required }: { status: RequirementMatchStatus; required: boolean }) {
  const m = STATUS_META[status]
  const isOptionalMissing = status === 'missing' && !required
  const color = isOptionalMissing ? 'var(--text-4)' : m.color
  const bg = isOptionalMissing ? 'var(--bg-inner)' : m.bg
  const border = isOptionalMissing ? 'var(--border-default)' : m.border
  const label = isOptionalMissing ? 'Optional' : m.label
  const Icon = m.Icon

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

interface DocRowProps {
  requirement: DocumentRequirementViewModel
  document: DocumentViewModel | undefined
  last: boolean
  onUpload: (req: DocumentRequirementViewModel) => void
  onReplace: (req: DocumentRequirementViewModel) => void
  onView: (docId: string) => void
}

function DocRow({ requirement: req, document: doc, last, onUpload, onReplace, onView }: DocRowProps) {
  const hasFile = req.documentId !== null
  const borderBottom = last ? 'none' : '1px solid var(--border-subtle)'

  const fileInfo = doc ? `v${doc.version} · ${new Date(doc.createdAt).toLocaleDateString('fr-FR')}` : null

  const actions = hasFile
    ? [
        { label: 'View', icon: <Eye size={12} strokeWidth={2} />, onClick: () => onView(req.documentId as string) },
        { label: 'Replace', icon: <RefreshCcw size={12} strokeWidth={2} />, onClick: () => onReplace(req) },
      ]
    : [
        { label: 'Upload', icon: <Upload size={12} strokeWidth={2} />, color: 'var(--accent)', onClick: () => onUpload(req) },
      ]

  return (
    <div style={{ borderBottom }}>
      {/* ── Desktop row ──────────────────────── */}
      <div className="hidden sm:grid items-center gap-4 px-5 py-3.5"
        style={{ gridTemplateColumns: ROW_COLS }}>

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
              {req.label}
              {!req.required && (
                <span className="ml-1.5 text-[10px] font-bold px-1.5 py-px rounded"
                  style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)', verticalAlign: 'middle' }}>
                  Optional
                </span>
              )}
            </p>
            {doc?.reviewNote && (
              <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-4)' }}>
                {doc.reviewNote}
              </p>
            )}
          </div>
        </div>

        {hasFile ? (
          <div className="min-w-0">
            <p className="text-[11.5px] font-medium truncate" style={{ color: 'var(--text-3)' }}>{doc?.fileName ?? '—'}</p>
            {fileInfo && <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>{fileInfo}</p>}
          </div>
        ) : (
          <p className="text-[11.5px] italic" style={{ color: 'var(--text-4)' }}>No file uploaded</p>
        )}

        <StatusBadge status={req.status} required={req.required} />

        <RowMenu actions={actions} minWidth="140px" />
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
              <p className="text-[13px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>{req.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={req.status} required={req.required} />
            <RowMenu actions={actions} minWidth="140px" />
          </div>
        </div>

        {hasFile && (
          <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
            {doc?.fileName ?? '—'} {fileInfo && `· ${fileInfo}`}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Category completion stats ────────────────────────────────

function completionStats(requirements: DocumentRequirementViewModel[]) {
  const required = requirements.filter(r => r.required)
  const uploaded = required.filter(r => r.status !== 'missing')
  const missing = required.filter(r => r.status === 'missing')
  const optional = requirements.filter(r => !r.required)
  return { required: required.length, uploaded: uploaded.length, missing: missing.length, optional: optional.length }
}

// ─── Category card ────────────────────────────────────────────

interface CategoryCardProps {
  category: DocumentCategoryGroupViewModel
  documentsById: Map<string, DocumentViewModel>
  defaultOpen?: boolean
  onUpload: (req: DocumentRequirementViewModel) => void
  onReplace: (req: DocumentRequirementViewModel) => void
  onView: (docId: string) => void
}

function CategoryCard({ category, documentsById, defaultOpen = false, onUpload, onReplace, onView }: CategoryCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const stats = completionStats(category.requirements)
  const allDone = stats.missing === 0
  const meta = categoryMeta(category.category, category.moduleKey)
  const title = meta.title ?? category.categoryLabel

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer text-left"
        style={{
          background: 'var(--bg-inner)',
          borderBottom: open ? '1px solid var(--border-default)' : 'none',
        }}>

        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}35` }}>
          <meta.Icon size={15} strokeWidth={1.8} style={{ color: meta.accent }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-black leading-none mb-1" style={{ color: 'var(--text-1)' }}>
            {title}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
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
          {category.requirements.map((req, idx) => (
            <DocRow
              key={req.key}
              requirement={req}
              document={req.documentId ? documentsById.get(req.documentId) : undefined}
              last={idx === category.requirements.length - 1}
              onUpload={onUpload}
              onReplace={onReplace}
              onView={onView}
            />
          ))}
        </>
      )}
    </div>
  )
}

// ─── Overall vault progress ───────────────────────────────────

function VaultProgressBar({ pct, requirements }: { pct: number; requirements: DocumentRequirementViewModel[] }) {
  const required = requirements.filter(r => r.required)
  const uploaded = required.filter(r => r.status !== 'missing').length
  const total = required.length
  const missing = total - uploaded

  const counts = (['approved', 'under_review', 'uploaded', 'correction_requested', 'missing', 'rejected'] as const)
    .map(status => ({ status, count: requirements.filter(r => r.status === status).length }))
    .filter(({ count }) => count > 0)

  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-xl flex-wrap"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

      <div className="shrink-0 text-center" style={{ minWidth: 52 }}>
        <p className="text-[28px] font-black leading-none" style={{ color: 'var(--accent)' }}>{pct}%</p>
        <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Complete</p>
      </div>

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

      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {counts.map(({ status, count }) => {
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

/** Static breadcrumb + title only — shown even before data has loaded, so the page heading is never missing during loading/error states. */
function PageHeading() {
  return (
    <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
        Caterer Portal / Document Vault
      </p>
      <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
        Document Vault
      </h1>
    </div>
  )
}

export function CatererDocumentVaultPage() {
  const groupsQuery = useCatererDocumentVaultGroups()
  const progressQuery = useCatererDocumentVaultProgress()
  const documentsQuery = useCatererDocumentVaultDocuments(undefined)

  const uploadMutation = useUploadCatererDocument()
  const replaceMutation = useReplaceCatererDocument()
  const downloadMutation = useCatererDocumentDownloadLink()

  const [modalRequirement, setModalRequirement] = useState<DocumentRequirementViewModel | null>(null)
  const [modalMode, setModalMode] = useState<'upload' | 'replace'>('upload')

  if (groupsQuery.isLoading || documentsQuery.isLoading) {
    return (
      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
        <PageHeading />
        <div className="px-5 py-10 text-center" style={{ color: 'var(--text-4)' }}>
          Loading Document Vault…
        </div>
      </div>
    )
  }

  if (groupsQuery.isError || !groupsQuery.data) {
    return (
      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
        <PageHeading />
        <div className="px-5 py-10 text-center" style={{ color: '#f87171' }}>
          Failed to load Document Vault.
        </div>
      </div>
    )
  }

  const groups = groupsQuery.data
  const baseGroup = groups.find(g => g.groupKey === 'base')
  const moduleGroup = groups.find(g => g.groupKey === 'modules')
  const allRequirements = groups.flatMap(g => g.categories.flatMap(c => c.requirements))
  const documentsById = new Map((documentsQuery.data?.data ?? []).map(d => [d.id, d]))
  const pct = progressQuery.data?.completionPercentage ?? 0

  function openUpload(req: DocumentRequirementViewModel) {
    setModalRequirement(req)
    setModalMode('upload')
  }

  function openReplace(req: DocumentRequirementViewModel) {
    setModalRequirement(req)
    setModalMode('replace')
  }

  async function handleView(docId: string) {
    const result = await downloadMutation.mutateAsync(docId)
    const url = (result as { url?: string })?.url
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleConfirm(input: { fileName: string; mimeType: string }) {
    if (!modalRequirement) return
    if (modalMode === 'upload') {
      uploadMutation.mutate(
        { fileName: input.fileName, mimeType: input.mimeType, category: modalRequirement.category, linkedSection: modalRequirement.key },
        { onSuccess: () => setModalRequirement(null) },
      )
    } else if (modalRequirement.documentId) {
      replaceMutation.mutate(
        { docId: modalRequirement.documentId, input },
        { onSuccess: () => setModalRequirement(null) },
      )
    }
  }

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Caterer Portal / Document Vault
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
          { id: 'base', label: 'Base Documents', icon: <FileText size={13} strokeWidth={1.8} />, badge: baseGroup?.categories.length ?? 0 },
          { id: 'modules', label: 'Module Documents', icon: <BookOpen size={13} strokeWidth={1.8} />, badge: moduleGroup?.categories.length ?? 0 },
        ]}>
        {activeTab => (
          <div className="px-5 py-5 flex flex-col gap-5">

            <VaultProgressBar pct={pct} requirements={allRequirements} />

            {activeTab === 'base' && baseGroup?.categories.map(cat => (
              <CategoryCard
                key={cat.category}
                category={cat}
                documentsById={documentsById}
                defaultOpen={completionStats(cat.requirements).missing > 0}
                onUpload={openUpload}
                onReplace={openReplace}
                onView={handleView}
              />
            ))}

            {activeTab === 'modules' && (
              moduleGroup && moduleGroup.categories.length > 0 ? (
                moduleGroup.categories.map(cat => (
                  <CategoryCard
                    key={cat.moduleKey ?? cat.category}
                    category={cat}
                    documentsById={documentsById}
                    defaultOpen={completionStats(cat.requirements).missing > 0}
                    onUpload={openUpload}
                    onReplace={openReplace}
                    onView={handleView}
                  />
                ))
              ) : (
                <p className="text-[13px] px-1 py-6 text-center" style={{ color: 'var(--text-4)' }}>
                  No modules are active yet — module-specific document requirements will appear here once EcoLunch activates a module for your account.
                </p>
              )
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>

      {modalRequirement && (
        <UploadRequirementModal
          label={modalRequirement.label}
          mode={modalMode}
          onCancel={() => setModalRequirement(null)}
          onConfirm={handleConfirm}
          isSubmitting={uploadMutation.isPending || replaceMutation.isPending}
        />
      )}
    </div>
  )
}
