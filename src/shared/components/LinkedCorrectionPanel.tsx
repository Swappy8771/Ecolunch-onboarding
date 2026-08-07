import { useState } from 'react'
import { Send } from 'lucide-react'
import { useCorrectionsByValidationItem, useCorrectionsByDocument } from '@/features/adminCorrections/hooks/useAdminCorrectionsQueries'
import { useAddAdminCorrectionComment, useCloseAdminCorrection } from '@/features/adminCorrections/hooks/useAdminCorrectionsActions'
import type { CorrectionViewModel } from '@/features/adminCorrections/types/adminCorrections.types'

const STATUS_META: Record<CorrectionViewModel['status'], { label: string; color: string }> = {
  open: { label: 'Open', color: '#fbbf24' },
  in_progress: { label: 'In Progress', color: '#60a5fa' },
  resolved: { label: 'Resolved', color: '#4ade80' },
  closed: { label: 'Closed', color: 'var(--text-4)' },
}

interface LinkedCorrectionPanelProps {
  /** Pass exactly one of these — whichever context this panel is embedded in. */
  validationItemId?: string
  documentId?: string
}

/**
 * Closes the "corrections raised from here are never surfaced back" gap —
 * the same `Correction` record `correctionsService.create()` already
 * writes on request-correction, just never read back by either originating
 * screen. Read-plus-minimal-action (comment/close) rather than a full
 * separate corrections management page, since that's a larger, separate
 * feature the spec doesn't ask for here.
 */
export function LinkedCorrectionPanel({ validationItemId, documentId }: LinkedCorrectionPanelProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const byItem = useCorrectionsByValidationItem(validationItemId ?? '', { enabled: Boolean(validationItemId) })
  const byDoc = useCorrectionsByDocument(documentId ?? '', { enabled: Boolean(documentId) })
  const query = validationItemId ? byItem : byDoc
  const addComment = useAddAdminCorrectionComment()
  const closeCorrection = useCloseAdminCorrection()

  if (query.isLoading) {
    return <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Loading…</span>
  }

  const corrections = query.data?.data ?? []
  if (corrections.length === 0) {
    return <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>No correction has been raised here.</span>
  }

  return (
    <div className="flex flex-col gap-3">
      {corrections.map((c) => {
        const meta = STATUS_META[c.status]
        const isOpenLike = c.status !== 'closed'
        const draft = drafts[c.id] ?? ''
        return (
          <div key={c.id} className="rounded-xl p-3.5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold" style={{ color: meta.color }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.color }} />
                {meta.label}
              </span>
              {isOpenLike && (
                <button
                  onClick={() => closeCorrection.mutate(c.id)}
                  disabled={closeCorrection.isPending}
                  className="text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                  style={{ color: 'var(--text-3)' }}
                >
                  Close
                </button>
              )}
            </div>

            <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{c.description}</p>

            {c.comments.length > 0 && (
              <div className="mt-2.5 flex flex-col gap-1.5">
                {c.comments.map((cm) => (
                  <p key={cm.id} className="text-[12px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
                    <span className="font-semibold" style={{ color: 'var(--text-2)' }}>
                      {cm.authorType === 'admin' ? 'Admin' : 'Caterer'}:
                    </span>{' '}
                    {cm.body}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-2.5 flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                placeholder="Add a comment…"
                className="flex-1 px-2.5 py-1.5 rounded-lg text-[12px] outline-none"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-1)' }}
              />
              <button
                onClick={() => {
                  if (!draft.trim()) return
                  addComment.mutate({ id: c.id, body: draft.trim() })
                  setDrafts((prev) => ({ ...prev, [c.id]: '' }))
                }}
                disabled={addComment.isPending || !draft.trim()}
                className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0 cursor-pointer disabled:opacity-40"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}
              >
                <Send size={12} strokeWidth={2} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
