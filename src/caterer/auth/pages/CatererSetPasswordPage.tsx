import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react'
import logo from '../../../assets/ecotech-logo.jpg'
import { useCheckCatererInviteToken, useCatererSetPassword } from '@/features/catererAuth/hooks/useCatererAuthActions'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

export function CatererSetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const inviteQuery = useCheckCatererInviteToken(token, Boolean(token))
  const setPasswordMutation = useCatererSetPassword()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)

  const passwordsMatch = password.length > 0 && password === confirmPassword
  const valid = password.length >= 8 && passwordsMatch

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || setPasswordMutation.isPending) return
    setPasswordMutation.mutate({ token, password }, { onSuccess: () => setDone(true) })
  }

  const invalidToken = !token || (inviteQuery.data && !inviteQuery.data.valid)

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-[420px] rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex flex-col items-center gap-3 px-8 pt-9 pb-7"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <img src={logo} alt="EcoTech Système" className="w-12 h-12 rounded-xl object-cover"
            style={{ boxShadow: '0 0 16px rgba(251,191,36,0.25)' }} />
          <div className="text-center">
            <h1 className="text-[19px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              Set Your Password
            </h1>
            {inviteQuery.data?.displayName && (
              <p className="text-[12px] font-medium mt-1" style={{ color: 'var(--text-4)' }}>
                Welcome, {inviteQuery.data.displayName}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 px-8 py-7">
          {done ? (
            <>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.28)' }}>
                <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />
                <span className="text-[12.5px]" style={{ color: '#4ade80' }}>Password set. You can now sign in.</span>
              </div>
              <button onClick={() => navigate('/caterer/login', { replace: true })}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13.5px] font-bold cursor-pointer"
                style={{ background: '#fbbf24', color: '#07070a' }}>
                Go to Sign In
              </button>
            </>
          ) : inviteQuery.isLoading ? (
            <p className="text-[12.5px] text-center" style={{ color: 'var(--text-4)' }}>Checking your link…</p>
          ) : invalidToken ? (
            <>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
                <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
                <span className="text-[12.5px]" style={{ color: '#f87171' }}>
                  This link is invalid or has expired. Ask your admin to resend an invite, or request a new
                  password reset.
                </span>
              </div>
              <Link to="/caterer/login" className="text-[12.5px] text-center font-semibold" style={{ color: 'var(--text-3)' }}>
                Back to Sign In
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>New Password</label>
                <input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Confirm Password</label>
                <input type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <span className="text-[11.5px]" style={{ color: '#f87171' }}>Passwords don't match</span>
                )}
              </div>

              {setPasswordMutation.isError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                  style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
                  <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
                  <span className="text-[12.5px]" style={{ color: '#f87171' }}>{setPasswordMutation.error.message}</span>
                </div>
              )}

              <button type="submit" disabled={!valid || setPasswordMutation.isPending}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13.5px] font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#fbbf24', color: '#07070a' }}>
                <KeyRound size={14} strokeWidth={2.4} />
                {setPasswordMutation.isPending ? 'Saving…' : 'Set Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
