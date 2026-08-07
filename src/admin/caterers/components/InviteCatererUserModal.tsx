import { useState } from 'react'
import { X, Send, Copy, Check, CheckCircle2 } from 'lucide-react'

interface InviteCatererUserModalProps {
  catererName: string
  onCancel: () => void
  onConfirm: (input: { email: string; firstName?: string; lastName?: string; role: 'caterer_admin' | 'caterer_staff' }) => void
  isSubmitting?: boolean
  /** Set once the invite succeeds — switches the modal to the "share this link" state. */
  inviteUrl?: string | null
}

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

/**
 * Backs "Invite User". Real email delivery isn't wired up yet
 * (`src/integrations/email` is a stub), so `POST /:id/invite` returns the
 * real set-password link directly in its response — once the invite
 * succeeds, this modal switches to showing that link with a copy button,
 * since sharing it manually (Slack, in person, etc.) is the only way it
 * reaches the caterer today.
 */
export function InviteCatererUserModal({ catererName, onCancel, onConfirm, isSubmitting, inviteUrl }: InviteCatererUserModalProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<'caterer_admin' | 'caterer_staff'>('caterer_admin')
  const [copied, setCopied] = useState(false)

  const valid = /\S+@\S+\.\S+/.test(email)

  async function handleCopy() {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{catererName}</p>
            <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>
              {inviteUrl ? 'Invite Created' : 'Invite Caterer Portal User'}
            </h2>
          </div>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {inviteUrl ? (
          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.28)' }}>
              <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />
              <span className="text-[12.5px]" style={{ color: '#4ade80' }}>Invite created — share this link with the caterer</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Set-password link</label>
              <div className="flex items-center gap-2">
                <input readOnly value={inviteUrl} onFocus={e => e.currentTarget.select()}
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-[12px] outline-none font-mono"
                  style={inputStyle} />
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer shrink-0"
                  style={{ background: copied ? 'rgba(74,222,128,0.12)' : 'var(--bg-inner)', color: copied ? '#4ade80' : 'var(--text-2)', border: '1px solid var(--border-default)' }}>
                  {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
              Email delivery isn't wired up yet — this link expires in 7 days. Send it to the caterer yourself for now.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Email <span style={{ color: '#f87171' }}>*</span></label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                placeholder="name@caterer.com"
                className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>First Name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Last Name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)}
                  className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Role</label>
              <select value={role} onChange={e => setRole(e.target.value as 'caterer_admin' | 'caterer_staff')}
                className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer" style={inputStyle}>
                <option value="caterer_admin">Caterer Admin</option>
                <option value="caterer_staff">Caterer Staff</option>
              </select>
            </div>

            <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
              Creates a Caterer Portal login and a set-password link. Email delivery isn't wired up yet — you'll get
              the link to share manually once the invite is created.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          {inviteUrl ? (
            <button onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
              style={{ background: 'var(--accent)', color: '#07070a' }}>
              Done
            </button>
          ) : (
            <>
              <button onClick={onCancel}
                className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
                style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
                Cancel
              </button>
              <button disabled={!valid || isSubmitting}
                onClick={() => onConfirm({ email, firstName: firstName || undefined, lastName: lastName || undefined, role })}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--accent)', color: '#07070a' }}>
                <Send size={13} strokeWidth={2.2} />{isSubmitting ? 'Sending…' : 'Send Invite'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
