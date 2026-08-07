import type { ReactNode } from 'react'
import { X, FileText, History, CheckCircle2, Tag, ExternalLink, Loader2, MessageSquareWarning } from 'lucide-react'
import {
  useDocumentHistory,
  useDocumentVersions,
  useExtractedFields,
  useDocumentValidationStatus,
  useOpenDropboxLink,
} from '@/features/adminDocumentVault/hooks/useDocumentDetails'
import { LinkedCorrectionPanel } from '@/shared/components/LinkedCorrectionPanel'
import type { DocumentViewModel } from '@/features/adminDocumentVault/types/documentVault.types'

interface DocumentDetailsModalProps {
  doc: DocumentViewModel
  onClose: () => void
}

const sectionStyle = { background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }

function SectionHeader({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span style={{ color: 'var(--text-4)' }}>{icon}</span>
      <span className="text-[11.5px] uppercase tracking-[0.1em] font-bold" style={{ color: 'var(--text-4)' }}>{label}</span>
    </div>
  )
}

/**
 * Consolidated "View X" panel for a document row — backs the "View Linked
 * Section" / "View Extracted Fields" / "View Validation Status" / "View
 * Version History" / "View Audit Trail" / "View" row actions, each of which
 * previously had no handler at all. Fetches every section's real endpoint
 * once, on open, rather than N separate modals for N read-only lookups.
 */
export function DocumentDetailsModal({ doc, onClose }: DocumentDetailsModalProps) {
  const historyQuery = useDocumentHistory(doc.id, true)
  const versionsQuery = useDocumentVersions(doc.id, true)
  const extractedQuery = useExtractedFields(doc.id, true)
  const validationQuery = useDocumentValidationStatus(doc.id, true)
  const dropboxQuery = useOpenDropboxLink(doc.id, true)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[640px] max-h-[85vh] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>Document Details</p>
            <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>{doc.fileName}</h2>
          </div>
          <button onClick={onClose} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {/* Linked section + open-in-Dropbox */}
          <div className="rounded-xl p-4" style={sectionStyle}>
            <SectionHeader icon={<Tag size={13} strokeWidth={1.8} />} label="Linked Requirement" />
            <p className="text-[13px]" style={{ color: 'var(--text-2)' }}>
              {doc.linkedSection ?? <span style={{ color: 'var(--text-4)' }}>Not linked to a checklist requirement.</span>}
            </p>
            <div className="mt-3">
              {dropboxQuery.isLoading ? (
                <span className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--text-4)' }}>
                  <Loader2 size={12} className="animate-spin" />Resolving Dropbox link…
                </span>
              ) : dropboxQuery.data ? (
                <a href={dropboxQuery.data.dropboxLink} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                  style={{ color: '#60a5fa' }}>
                  <ExternalLink size={12} strokeWidth={2} />Open in Dropbox
                </a>
              ) : (
                <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Dropbox link unavailable.</span>
              )}
            </div>
          </div>

          {/* Validation status */}
          <div className="rounded-xl p-4" style={sectionStyle}>
            <SectionHeader icon={<CheckCircle2 size={13} strokeWidth={1.8} />} label="Validation Status" />
            {validationQuery.isLoading ? (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Loading…</span>
            ) : (
              <p className="text-[13px]" style={{ color: 'var(--text-2)' }}>
                {validationQuery.data?.validationStatus ?? validationQuery.data?.message ?? 'No linked validation item.'}
              </p>
            )}
          </div>

          {/* Linked correction */}
          <div className="rounded-xl p-4" style={sectionStyle}>
            <SectionHeader icon={<MessageSquareWarning size={13} strokeWidth={1.8} />} label="Linked Correction" />
            <LinkedCorrectionPanel documentId={doc.id} />
          </div>

          {/* Extracted fields */}
          <div className="rounded-xl p-4" style={sectionStyle}>
            <SectionHeader icon={<FileText size={13} strokeWidth={1.8} />} label="Extracted Fields" />
            {extractedQuery.isLoading ? (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Loading…</span>
            ) : extractedQuery.data && Object.keys(extractedQuery.data.extractedFields ?? {}).length > 0 ? (
              <pre className="text-[11.5px] overflow-x-auto rounded-lg p-2.5" style={{ background: 'var(--bg-card)', color: 'var(--text-2)' }}>
                {JSON.stringify(extractedQuery.data.extractedFields, null, 2)}
              </pre>
            ) : (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>No extracted fields (not processed by Smart Import / OCR).</span>
            )}
          </div>

          {/* Version history */}
          <div className="rounded-xl p-4" style={sectionStyle}>
            <SectionHeader icon={<History size={13} strokeWidth={1.8} />} label="Version History" />
            {versionsQuery.isLoading ? (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Loading…</span>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {(versionsQuery.data?.versions ?? []).map(v => (
                  <li key={v.id} className="flex items-center justify-between text-[12.5px]">
                    <span style={{ color: 'var(--text-2)' }}>v{v.version} · {v.fileName}</span>
                    <span style={{ color: 'var(--text-4)' }}>{v.status} · {v.createdAt.slice(0, 10)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Audit trail */}
          <div className="rounded-xl p-4" style={sectionStyle}>
            <SectionHeader icon={<History size={13} strokeWidth={1.8} />} label="Audit Trail" />
            {historyQuery.isLoading ? (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Loading…</span>
            ) : (historyQuery.data?.history ?? []).length === 0 ? (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>No audit events recorded.</span>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {(historyQuery.data?.history ?? []).map(entry => (
                  <li key={entry._id} className="flex items-center justify-between text-[12.5px]">
                    <span style={{ color: 'var(--text-2)' }}>{entry.action}</span>
                    <span style={{ color: 'var(--text-4)' }}>{entry.createdAt.slice(0, 10)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
