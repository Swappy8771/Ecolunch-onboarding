import { ChevronRight, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../assets/ecotech-logo.jpg'

interface ClientHeaderProps {
  sidebarWidth: number
}

export function ClientHeader({ sidebarWidth }: ClientHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-stretch"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      {/* Brand panel — same width as sidebar */}
      <div
        className="flex items-center gap-2.5 px-4 shrink-0 overflow-hidden"
        style={{
          width: sidebarWidth,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          transition: 'width 260ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <img
          src={logo}
          alt="EcoTech Système"
          className="w-8 h-8 rounded-lg object-cover shrink-0"
          style={{ boxShadow: '0 0 10px rgba(163,230,53,0.22)' }}
        />
        {sidebarWidth > 80 && (
          <div className="min-w-0">
            <div className="text-[13px] font-bold leading-none tracking-tight truncate" style={{ color: 'var(--text-1)' }}>
              EcoLunch
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.16em] font-bold mt-[3px] truncate" style={{ color: 'var(--text-4)' }}>
              PRS · ONBOARDING
            </div>
          </div>
        )}
      </div>

      {/* Main header area */}
      <div
        className="flex-1 flex items-center px-5 gap-4"
        style={{
          background: 'rgba(14,14,19,0.90)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Portal badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold shrink-0"
          style={{
            background: 'rgba(251,191,36,0.10)',
            border: '1px solid rgba(251,191,36,0.28)',
            color: '#fbbf24',
          }}
        >
          Portail Client
        </div>

        <div className="flex-1" />

        {/* User identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-semibold leading-tight" style={{ color: 'var(--text-1)' }}>
              Concept Gourmet
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.13em] font-bold mt-[2px]" style={{ color: 'var(--text-4)' }}>
              Traiteur · Admin
            </div>
          </div>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.20), rgba(251,191,36,0.08))',
              border: '1px solid rgba(251,191,36,0.35)',
              color: '#fbbf24',
            }}
          >
            CG
          </div>

          <div className="w-px h-5 shrink-0" style={{ background: 'var(--border-default)' }} />

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-1.5 text-[13px] font-medium shrink-0 px-3 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-3)', background: 'transparent', border: '1px solid transparent' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--text-2)'
              el.style.borderColor = 'var(--border-default)'
              el.style.background = 'var(--bg-card)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--text-3)'
              el.style.borderColor = 'transparent'
              el.style.background = 'transparent'
            }}
          >
            <Shield size={12} strokeWidth={1.8} />
            Portail Admin
            <ChevronRight size={11} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  )
}
