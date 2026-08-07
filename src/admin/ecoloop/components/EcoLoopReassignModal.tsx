import { useState } from 'react'
import { X, UserPlus, AlertTriangle } from 'lucide-react'
import { useUsersList } from '@/features/adminUsers/hooks/useUsersList'

interface EcoLoopReassignModalProps {
  currentAssigneeName: string | null
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: (input: { assigneeId: string; assigneeName: string }) => void
}

/** Same admin picker as the Caterer form's "Assigned Admin" field — real `GET /admin/users`, not free text. */
export function EcoLoopReassignModal({ currentAssigneeName, isSubmitting, error, onCancel, onConfirm }: EcoLoopReassignModalProps) {
  const usersQuery = useUsersList('')
  const [assigneeId, setAssigneeId] = useState('')

  const selected = usersQuery.data?.find(u => u.id === assigneeId)
  const valid = Boolean(selected)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[440px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div>
            <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Reassign Ticket</h2>
            {currentAssigneeName && <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>Currently: {currentAssigneeName}</p>}
          </div>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Assign to <span style={{ color: '#f87171' }}>*</span></label>
            <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}>
              <option value="">Select an admin…</option>
              {usersQuery.data?.map(u => <option key={u.id} value={u.id}>{u.fullName || u.email}</option>)}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
              <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
              <span className="text-[12.5px]" style={{ color: '#f87171' }}>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            Cancel
          </button>
          <button disabled={!valid || isSubmitting}
            onClick={() => selected && onConfirm({ assigneeId: selected.id, assigneeName: selected.fullName || selected.email })}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <UserPlus size={13} strokeWidth={2.2} />{isSubmitting ? 'Reassigning…' : 'Reassign'}
          </button>
        </div>
      </div>
    </div>
  )
}
