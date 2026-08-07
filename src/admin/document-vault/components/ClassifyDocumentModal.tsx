import { useState } from 'react'
import { X, Tag } from 'lucide-react'
import type { DocumentViewModel, DocumentCategoryKey } from '@/features/adminDocumentVault/types/documentVault.types'

/** The real 11-value backend category enum (`documents.model.ts`'s `DOCUMENT_CATEGORIES`). */
const CATEGORY_OPTIONS: { value: DocumentCategoryKey; label: string }[] = [
  { value: 'profile', label: 'Profile / General Information' },
  { value: 'legal', label: 'Legal Information' },
  { value: 'banking', label: 'Banks & Banking Information' },
  { value: 'compliance', label: 'Compliance & Permits' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'establishments', label: 'My Clients / Establishments' },
  { value: 'menus', label: 'Menus & Packages' },
  { value: 'modules', label: 'Modules' },
  { value: 'contracts', label: 'Contracts & Signatures' },
  { value: 'golive', label: 'Go-live' },
  { value: 'internal', label: 'Internal Documents' },
]

interface ClassifyDocumentModalProps {
  doc: DocumentViewModel
  onCancel: () => void
  onConfirm: (input: { category?: string; linkedSection?: string | null }) => void
  isSubmitting?: boolean
}

/**
 * Backs "Classify" and "Reclassify" — both mutate the same
 * `category`/`linkedSection` pair via `PATCH /admin/documents/:docId/classify`,
 * so one modal serves both (there's no behavioral difference between
 * "setting" and "changing" a document's classification).
 */
export function ClassifyDocumentModal({ doc, onCancel, onConfirm, isSubmitting }: ClassifyDocumentModalProps) {
  const [category, setCategory] = useState<string>(doc.category as string)
  const [linkedSection, setLinkedSection] = useState(doc.linkedSection ?? '')

  const changed = category !== doc.category || linkedSection !== (doc.linkedSection ?? '')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="w-full max-w-[480px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div className="flex items-center gap-2.5">
            <Tag size={16} strokeWidth={2} style={{ color: 'var(--text-2)' }} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{doc.fileName}</p>
              <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Classify Document</h2>
            </div>
          </div>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}>
              {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Linked Requirement Key</label>
            <input value={linkedSection} onChange={e => setLinkedSection(e.target.value)}
              placeholder="e.g. profile.company_registration"
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
            <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
              Matches this document to a Document Vault checklist item so its category-tile/progress status reflects it.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            Cancel
          </button>
          <button
            disabled={!changed || isSubmitting}
            onClick={() => onConfirm({ category, linkedSection: linkedSection.trim() || null })}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            Save Classification
          </button>
        </div>
      </div>
    </div>
  )
}
