import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Send, CheckCircle2, AlertTriangle } from 'lucide-react'
import logo from '../../../assets/ecotech-logo.jpg'
import { useCatererForgotPassword } from '@/features/catererAuth/hooks/useCatererAuthActions'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

export function CatererForgotPasswordPage() {
  const forgotMutation = useCatererForgotPassword()
  const [email, setEmail] = useState('')

  const valid = /\S+@\S+\.\S+/.test(email)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || forgotMutation.isPending) return
    forgotMutation.mutate({ email })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-[420px] rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex flex-col items-center gap-3 px-8 pt-9 pb-7"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <img src={logo} alt="EcoTech Système" className="w-12 h-12 rounded-xl object-cover"
            style={{ boxShadow: '0 0 16px rgba(251,191,36,0.25)' }} />
          <div className="text-center">
            <h1 className="text-[19px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>Reset Your Password</h1>
            <p className="text-[12px] font-medium mt-1" style={{ color: 'var(--text-4)' }}>
              We'll send a reset link to your email
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-8 py-7">
          {forgotMutation.isSuccess ? (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.28)' }}>
              <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />
              <span className="text-[12.5px]" style={{ color: '#4ade80' }}>
                If an account exists for this email, a reset link has been sent.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Email</label>
                <div className="relative">
                  <Mail size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-4)' }} />
                  <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@caterer.com" className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                </div>
              </div>

              {forgotMutation.isError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                  style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
                  <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
                  <span className="text-[12.5px]" style={{ color: '#f87171' }}>{forgotMutation.error.message}</span>
                </div>
              )}

              <button type="submit" disabled={!valid || forgotMutation.isPending}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13.5px] font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#fbbf24', color: '#07070a' }}>
                <Send size={14} strokeWidth={2.4} />
                {forgotMutation.isPending ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <Link to="/caterer/login" className="text-[12.5px] text-center font-semibold" style={{ color: 'var(--text-3)' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
