import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Mail, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/ecotech-logo.jpg'
import { useLogin } from '@/features/adminAuth/hooks/useLogin'
import { useAuth } from '../AuthProvider'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const loginMutation = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const valid = /\S+@\S+\.\S+/.test(email) && password.length > 0
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || loginMutation.isPending) return
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: ({ token, user }) => {
          login(token, user)
          navigate(redirectTo, { replace: true })
        },
      },
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <div
          className="flex flex-col items-center gap-3 px-8 pt-9 pb-7"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}
        >
          <img
            src={logo}
            alt="EcoTech Système"
            className="w-12 h-12 rounded-xl object-cover"
            style={{ boxShadow: '0 0 16px rgba(163,230,53,0.25)' }}
          />
          <div className="text-center">
            <h1 className="text-[19px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              EcoLunch Admin
            </h1>
            <p className="text-[12px] font-medium mt-1" style={{ color: 'var(--text-4)' }}>
              Sign in to the onboarding portal
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-8 py-7">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
              Email
            </label>
            <div className="relative">
              <Mail size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-4)' }} />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ecolunch.local"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[13px] outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
              Password
            </label>
            <div className="relative">
              <Lock size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-4)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-[13px] outline-none"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'var(--text-4)' }}
              >
                {showPassword ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
              </button>
            </div>
          </div>

          {loginMutation.isError && (
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}
            >
              <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
              <span className="text-[12.5px]" style={{ color: '#f87171' }}>
                {loginMutation.error.message}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={!valid || loginMutation.isPending}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13.5px] font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-1"
            style={{ background: 'var(--accent)', color: '#07070a' }}
          >
            <LogIn size={14} strokeWidth={2.4} />
            {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
