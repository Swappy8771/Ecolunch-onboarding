import { useState } from 'react'
import { Eye, FileText, CheckCircle2, XCircle, MessageSquare, Send, History, Tag, ChevronRight, AlertTriangle, UploadCloud } from 'lucide-react'
import { DropdownMenu, type DropdownAction } from '@shared/components/DropdownMenu'
import { FullPageLoader } from '@shared/ui/FullPageLoader'
import { DocStatusPill } from './DocStatusPill'
import { UploadDocumentModal } from './UploadDocumentModal'
import { ReviewNoteModal } from './ReviewNoteModal'
import { ClassifyDocumentModal } from './ClassifyDocumentModal'
import { DocumentDetailsModal } from './DocumentDetailsModal'
import { useCatererDocuments } from '@/features/adminDocumentVault/hooks/useCatererDocuments'
import { useReviewDocument } from '@/features/adminDocumentVault/hooks/useReviewDocument'
import { useUploadDocument } from '@/features/adminDocumentVault/hooks/useUploadDocument'
import { useClassifyDocument } from '@/features/adminDocumentVault/hooks/useClassifyDocument'
import type { DocumentViewModel } from '@/features/adminDocumentVault/types/documentVault.types'

const TABLE_COLS = [
  { label: 'Document Name', width: 'auto'  },
  { label: 'Category',      width: '160px' },
  { label: 'Status',        width: '168px' },
  { label: 'Version',       width: '80px'  },
  { label: 'Uploaded By',   width: '150px' },
  { label: 'Upload Date',   width: '110px' },
  { label: 'Actions',       width: '110px' },
]

interface RowActionHandlers {
  onReview: (decision: 'approve' | 'reject' | 'request_correction') => void
  onClassify: () => void
  onViewDetails: () => void
}

/**
 * Approve/Reject/Request Correction, Classify/Reclassify, and every
 * view-only lookup (Extracted Fields/Linked Section/Validation
 * Status/Version History/Audit Trail — all consolidated into one details
 * modal) are wired to real backend endpoints. Smart Import and Send via
 * EcoLoop stay disabled: Smart Import's backend module is a genuine stub
 * (`smart-import.controller.ts` returns 501), and "send this document via
 * EcoLoop" has no defined target conversation/ticket to create yet — both
 * render greyed-out with a tooltip instead of silently no-op'ing.
 */
function buildRowActions({ onReview, onClassify, onViewDetails }: RowActionHandlers): DropdownAction[] {
  return [
    { label: 'Smart Import',           icon: <Tag          size={13} strokeWidth={1.8} />, color: 'var(--text-2)', disabled: true, title: 'Smart Import is not implemented yet' },
    { label: 'Classify',               icon: <Tag          size={13} strokeWidth={1.8} />, color: 'var(--text-2)', onClick: onClassify },
    { label: 'Reclassify',             icon: <History      size={13} strokeWidth={1.8} />, color: 'var(--text-2)', onClick: onClassify },
    { label: 'View Extracted Fields',  icon: <FileText     size={13} strokeWidth={1.8} />, color: 'var(--text-2)', onClick: onViewDetails },
    { label: 'View Linked Section',    icon: <ChevronRight size={13} strokeWidth={1.8} />, color: 'var(--text-2)', onClick: onViewDetails },
    { label: 'View Validation Status', icon: <CheckCircle2 size={13} strokeWidth={1.8} />, color: 'var(--text-2)', onClick: onViewDetails },
    { label: 'Approve',                icon: <CheckCircle2  size={13} strokeWidth={1.8} />, color: '#4ade80', onClick: () => onReview('approve') },
    { label: 'Reject',                 icon: <XCircle       size={13} strokeWidth={1.8} />, color: '#f87171', onClick: () => onReview('reject') },
    { label: 'Request Correction',     icon: <MessageSquare size={13} strokeWidth={1.8} />, color: '#fbbf24', onClick: () => onReview('request_correction') },
    { label: 'Send via EcoLoop',       icon: <Send         size={13} strokeWidth={1.8} />, color: '#60a5fa', disabled: true, title: 'Sending documents via EcoLoop is not implemented yet' },
    { label: 'View Version History',   icon: <History      size={13} strokeWidth={1.8} />, color: 'var(--text-2)', onClick: onViewDetails },
    { label: 'View Audit Trail',       icon: <FileText     size={13} strokeWidth={1.8} />, color: 'var(--text-2)', onClick: onViewDetails },
  ]
}

interface DocumentTableProps {
  catererId: string
  catererName: string
  categoryKey: string
  categoryLabel: string
  openMenuId: string | null
  onMenuToggle: (id: string) => void
  onMenuClose: () => void
}

/** "View" opens the document details modal, resolving its Dropbox link only once that modal is up (see `DocumentDetailsModal`) — this button just opens the modal. */
function ViewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer"
      style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#60a5fa50'; el.style.color = '#60a5fa' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-strong)'; el.style.color = 'var(--text-2)' }}
    >
      <Eye size={12} strokeWidth={2} />View
    </button>
  )
}

export function DocumentTable({ catererId, catererName, categoryKey, categoryLabel, openMenuId, onMenuToggle, onMenuClose }: DocumentTableProps) {
  const { data: docs, isLoading, isError, error } = useCatererDocuments({ catererId, category: categoryKey })
  const reviewMutation = useReviewDocument()
  const uploadMutation = useUploadDocument()
  const classifyMutation = useClassifyDocument()

  const [uploadOpen, setUploadOpen] = useState(false)
  const [reviewTarget, setReviewTarget] = useState<{ doc: DocumentViewModel; decision: 'reject' | 'request_correction' } | null>(null)
  const [classifyTarget, setClassifyTarget] = useState<DocumentViewModel | null>(null)
  const [detailsTarget, setDetailsTarget] = useState<DocumentViewModel | null>(null)

  function handleReview(doc: DocumentViewModel, decision: 'approve' | 'reject' | 'request_correction') {
    if (decision === 'approve') {
      reviewMutation.mutate({ docId: doc.id, catererId, decision })
      onMenuClose()
      return
    }
    setReviewTarget({ doc, decision })
    onMenuClose()
  }

  function confirmReviewNote(note: string) {
    if (!reviewTarget) return
    reviewMutation.mutate({ docId: reviewTarget.doc.id, catererId, decision: reviewTarget.decision, note })
    setReviewTarget(null)
  }

  function confirmClassify(input: { category?: string; linkedSection?: string | null }) {
    if (!classifyTarget) return
    classifyMutation.mutate({ docId: classifyTarget.id, catererId, ...input })
    setClassifyTarget(null)
  }

  function confirmUpload(input: { fileName: string; mimeType: string; visibility: 'client_visible' | 'internal'; linkedSection?: string }) {
    uploadMutation.mutate({ catererId, category: categoryKey, ...input })
    setUploadOpen(false)
  }

  const items = docs ?? []

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="text-[12.5px] font-semibold" style={{ color: 'var(--text-2)' }}>{categoryLabel}</span>
        <button onClick={() => setUploadOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
          style={{ background: 'var(--accent)', color: '#07070a' }}>
          <UploadCloud size={13} strokeWidth={2.2} />Upload Document
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '860px' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
              {TABLE_COLS.map(col => (
                <th key={col.label} className="text-left px-4 py-3"
                  style={{ width: col.width, minWidth: col.width !== 'auto' ? col.width : undefined }}>
                  <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                    {col.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={TABLE_COLS.length}><FullPageLoader label="Loading documents…" /></td></tr>
            ) : isError ? (
              <tr>
                <td colSpan={TABLE_COLS.length} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle size={28} strokeWidth={1.2} style={{ color: '#f87171' }} />
                    <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>{error?.message ?? 'Failed to load documents.'}</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLS.length} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={28} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
                    <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>No documents uploaded in this category yet.</span>
                  </div>
                </td>
              </tr>
            ) : items.map((doc, idx) => (
              <tr
                key={doc.id}
                className="transition-colors"
                style={{ borderBottom: idx < items.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <FileText size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                    <span className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>{doc.fileName}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[12px] font-medium" style={{ color: 'var(--text-3)' }}>{categoryLabel}</span>
                </td>
                <td className="px-4 py-3.5"><DocStatusPill status={doc.statusDisplay} /></td>
                <td className="px-4 py-3.5">
                  <span className="text-[12px] font-semibold tabular-nums px-2 py-0.5 rounded-md"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-3)' }}>
                    v{doc.version}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{doc.uploadedByName ?? 'Unknown'}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>{doc.createdAt.slice(0, 10)}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <ViewButton onClick={() => setDetailsTarget(doc)} />
                    <DropdownMenu
                      open={openMenuId === doc.id}
                      onToggle={() => onMenuToggle(doc.id)}
                      onClose={onMenuClose}
                      actions={buildRowActions({
                        onReview: decision => handleReview(doc, decision),
                        onClassify: () => { setClassifyTarget(doc); onMenuClose() },
                        onViewDetails: () => { setDetailsTarget(doc); onMenuClose() },
                      })}
                      minWidth="210px"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
          {items.length} document{items.length !== 1 ? 's' : ''} in {categoryLabel}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>{catererName}</span>
      </div>

      {uploadOpen && (
        <UploadDocumentModal
          catererName={catererName}
          categoryLabel={categoryLabel}
          isSubmitting={uploadMutation.isPending}
          onCancel={() => setUploadOpen(false)}
          onConfirm={confirmUpload}
        />
      )}

      {reviewTarget && (
        <ReviewNoteModal
          fileName={reviewTarget.doc.fileName}
          decision={reviewTarget.decision}
          isSubmitting={reviewMutation.isPending}
          onCancel={() => setReviewTarget(null)}
          onConfirm={confirmReviewNote}
        />
      )}

      {classifyTarget && (
        <ClassifyDocumentModal
          doc={classifyTarget}
          isSubmitting={classifyMutation.isPending}
          onCancel={() => setClassifyTarget(null)}
          onConfirm={confirmClassify}
        />
      )}

      {detailsTarget && (
        <DocumentDetailsModal
          doc={detailsTarget}
          onClose={() => setDetailsTarget(null)}
        />
      )}
    </div>
  )
}
