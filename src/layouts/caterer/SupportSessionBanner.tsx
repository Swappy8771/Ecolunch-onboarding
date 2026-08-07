import { ShieldAlert } from 'lucide-react'
import { useCatererAuth } from '@/auth/caterer'
import { useCatererEndSupportSession } from '@/features/catererAuth/hooks/useCatererAuthActions'

/**
 * Persistent banner shown for the lifetime of an admin's audited "Open
 * Support Access Session" (`Caterer Onboarding File` spec §Row Actions) —
 * the one UI requirement the spec is explicit about: this must never look
 * like an ordinary caterer login. "End Session" logs the matching
 * `support_session.end` audit entry, then logs the admin out of this view.
 */
export function SupportSessionBanner({ sidebarWidth }: { sidebarWidth: number }) {
  const { supportSession, user, logout } = useCatererAuth()
  const { mutateAsync: endSession, isPending } = useCatererEndSupportSession()

  if (!supportSession) return null

  async function handleEndSession() {
    await endSession().catch(() => {})
    logout()
  }

  const expires = new Date(supportSession.expiresAt)
  const expiresLabel = Number.isNaN(expires.getTime())
    ? null
    : expires.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="fixed top-[52px] right-0 flex items-center justify-between gap-3 px-4 h-9 z-40"
      style={{
        left: sidebarWidth,
        background: 'rgba(248,113,113,0.14)',
        borderBottom: '1px solid rgba(248,113,113,0.35)',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <ShieldAlert size={14} strokeWidth={2} style={{ color: '#f87171', flexShrink: 0 }} />
        <span className="text-[12.5px] font-semibold truncate" style={{ color: '#f87171' }}>
          Support Access Session — viewing as {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.email}
          {expiresLabel && <> · ends {expiresLabel}</>}
        </span>
      </div>
      <button
        onClick={handleEndSession}
        disabled={isPending}
        className="text-[12px] font-bold px-3 py-1 rounded-lg shrink-0 cursor-pointer disabled:opacity-50"
        style={{ background: 'rgba(248,113,113,0.18)', color: '#f87171', border: '1px solid rgba(248,113,113,0.35)' }}
      >
        {isPending ? 'Ending…' : 'End Session'}
      </button>
    </div>
  )
}
