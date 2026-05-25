import { Crown, Settings, ChevronRight, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../assets/ecotech-logo.jpg'
import { ThemeToggle } from '../../shared/ui/ThemeToggle'
import { LangToggle } from '../../shared/ui/LangToggle'
import { useLang } from '../../shared/context/LangContext'

interface AdminHeaderProps {
  sidebarWidth: number
  isDesktop: boolean
  onMenuClick: () => void
}

export function AdminHeader({ sidebarWidth, isDesktop, onMenuClick }: AdminHeaderProps) {
  const { t } = useLang()
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-stretch"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      {/* Brand panel — matches sidebar width on desktop, full on mobile */}
      <div
        className="flex items-center gap-2.5 px-4 shrink-0 overflow-hidden"
        style={{
          width: isDesktop ? sidebarWidth : '100%',
          background: 'var(--bg-surface)',
          borderRight: isDesktop ? '1px solid var(--border-subtle)' : 'none',
          transition: 'width 260ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Hamburger on mobile */}
        {!isDesktop && (
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all cursor-pointer"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-2)' }}
          >
            <Menu size={16} strokeWidth={2} />
          </button>
        )}

        <img
          src={logo}
          alt="EcoTech Système"
          className="w-8 h-8 rounded-lg object-cover shrink-0"
          style={{ boxShadow: '0 0 10px rgba(163,230,53,0.22)' }}
        />

        {(isDesktop ? sidebarWidth > 80 : true) && (
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold leading-none tracking-tight truncate" style={{ color: 'var(--text-1)' }}>
              EcoLunch
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.16em] font-bold mt-[3px] truncate" style={{ color: 'var(--text-4)' }}>
              {t.header.prs}
            </div>
          </div>
        )}

        {/* Portal badge + theme toggle on mobile */}
        {!isDesktop && (
          <>
            <div className="flex-1" />
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
              <LangToggle />
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold shrink-0"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
              >
                <Crown size={10} strokeWidth={2.5} />
                {t.header.admin}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop-only main header area */}
      {isDesktop && (
        <div
          className="flex-1 flex items-center px-5 gap-4"
          style={{ background: 'var(--bg-header-glass)', backdropFilter: 'blur(12px)' }}
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold shrink-0"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
          >
            <Crown size={11} strokeWidth={2.5} />
            {t.header.portalAdmin}
          </div>

          <div className="flex-1" />

          <ThemeToggle />
          <LangToggle />

          <Link
            to="/client/client-dashboard"
            className="flex items-center gap-1.5 text-[13px] font-medium shrink-0 px-3 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-3)', background: 'transparent', border: '1px solid transparent' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--text-2)'; el.style.borderColor = 'var(--border-default)'; el.style.background = 'var(--bg-card)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--text-3)'; el.style.borderColor = 'transparent'; el.style.background = 'transparent'
            }}
          >
            <Settings size={12} strokeWidth={1.8} />
            {t.header.portalClient}
            <ChevronRight size={11} strokeWidth={2} />
          </Link>
        </div>
      )}
    </header>
  )
}
