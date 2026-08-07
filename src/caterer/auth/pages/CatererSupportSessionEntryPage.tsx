import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { useCatererAuth } from '@/auth/caterer'
import type { CatererAuthUser } from '@/auth/caterer/catererAuth.types'

interface SupportSessionPayload {
  token: string
  sessionId: string
  expiresAt: string
  user: CatererAuthUser
}

/** Pure — decoding is deterministic from the URL, so this runs at render time, not inside an effect. */
function decodeSupportSessionPayload(raw: string | null): { payload: SupportSessionPayload | null; error: string | null } {
  if (!raw) return { payload: null, error: 'Missing support session data.' }
  try {
    const payload = JSON.parse(atob(decodeURIComponent(raw))) as SupportSessionPayload
    return { payload, error: null }
  } catch {
    return { payload: null, error: 'This support session link is invalid or corrupted.' }
  }
}

/**
 * The landing page a "support-session" tab opens into — set as the target
 * of `window.open()` by the admin Caterers page's "Open Support Access
 * Session" action. Decodes the one-shot `data` query param (base64 JSON,
 * built by that action from the real backend response) into a real login
 * + a `supportSession` marker, then redirects into the normal dashboard.
 * Never reachable without a valid `data` param — there is no form here.
 */
export function CatererSupportSessionEntryPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, setSupportSession } = useCatererAuth()
  const ran = useRef(false)
  const { payload, error } = decodeSupportSessionPayload(searchParams.get('data'))

  useEffect(() => {
    if (ran.current || !payload) return
    ran.current = true
    login(payload.token, payload.user)
    setSupportSession({ sessionId: payload.sessionId, catererId: payload.user.catererId, expiresAt: payload.expiresAt })
    navigate('/caterer/dashboard', { replace: true })
  }, [payload, login, setSupportSession, navigate])

  if (!error) return null

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-sm text-center flex flex-col items-center gap-3">
        <AlertTriangle size={24} strokeWidth={1.8} style={{ color: '#f87171' }} />
        <p className="text-[13.5px]" style={{ color: 'var(--text-2)' }}>{error}</p>
      </div>
    </div>
  )
}
