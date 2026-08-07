import { useState } from 'react'
import { X, UploadCloud } from 'lucide-react'

interface UploadRequirementModalProps {
  label: string
  mode: 'upload' | 'replace'
  onCancel: () => void
  onConfirm: (input: { fileName: string; mimeType: string }) => void
  isSubmitting?: boolean
}

/**
 * There is no real binary upload endpoint anywhere in this app yet —
 * `dropboxAdapter.upload()` is a path-only stub — so this form collects
 * exactly what `POST /caterer/documents` / `POST /caterer/documents/
 * {docId}/replace` accept: a file, for its name/MIME type only. Same
 * convention as the admin side's `UploadDocumentModal`.
 */
export function UploadRequirementModal({ label, mode, onCancel, onConfirm, isSubmitting }: UploadRequirementModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const valid = file !== null

  function handleConfirm() {
    if (!file) return
    onConfirm({ fileName: file.name, mimeType: file.type || 'application/octet-stream' })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="w-full max-w-[440px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{label}</p>
            <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>
              {mode === 'upload' ? 'Upload Document' : 'Replace Document'}
            </h2>
          </div>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>File <span style={{ color: '#f87171' }}>*</span></label>
            <label
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-[13px] cursor-pointer"
              style={{ background: 'var(--bg-inner)', border: '1px dashed var(--border-strong)', color: file ? 'var(--text-1)' : 'var(--text-4)' }}>
              <UploadCloud size={15} strokeWidth={1.8} />
              {file ? file.name : 'Choose a file…'}
              <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </label>
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
            disabled={!valid || isSubmitting}
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <UploadCloud size={14} strokeWidth={2.5} />{mode === 'upload' ? 'Upload' : 'Replace'}
          </button>
        </div>
      </div>
    </div>
  )
}
