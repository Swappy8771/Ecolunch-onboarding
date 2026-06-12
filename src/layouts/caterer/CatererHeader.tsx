import { ChevronRight, Shield, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '@/assets/ecotech-logo.jpg'
import { ThemeToggle } from '@shared/ui/ThemeToggle'
import { LangToggle } from '@shared/ui/LangToggle'
import { NotificationBell } from '@shared/ui/NotificationBell'
import { useLang } from '@shared/context/LangContext'

interface CatererHeaderProps {
  sidebarWidth: number
  isDesktop: boolean
  onMenuClick: () => void
}

export function CatererHeader({ sidebarWidth, isDesktop, onMenuClick }: CatererHeaderProps) {
  const { t } = useLang()
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-stretch"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div
        className="flex items-center gap-2.5 px-4 shrink-0 overflow-hidden"
        style={{
          width: isDesktop ? sidebarWidth : '100%',
          background: 'var(--bg-surface)',
          borderRight: isDesktop ? '1px solid var(--border-subtle)' : 'none',
          transition: 'width 260ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
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

        {!isDesktop && (
          <>
            <div className="flex-1" />
            <div className="flex items-center gap-2 shrink-0">
              <NotificationBell count={1} />
              <ThemeToggle />
              <LangToggle />
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-bold"
                style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.28)', color: '#fbbf24' }}
              >
                {t.header.client}
              </div>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.20),rgba(251,191,36,0.08))', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24' }}
              >
                CG
              </div>
            </div>
          </>
        )}
      </div>

      {isDesktop && (
        <div
          className="flex-1 flex items-center px-5 gap-4"
          style={{ background: 'var(--bg-header-glass)', backdropFilter: 'blur(12px)' }}
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold shrink-0"
            style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.28)', color: '#fbbf24' }}
          >
            {t.header.portalClient}
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[13px] font-semibold leading-tight" style={{ color: 'var(--text-1)' }}>{t.header.companyName}</div>
              <div className="text-[10.5px] uppercase tracking-[0.13em] font-bold mt-[2px]" style={{ color: 'var(--text-4)' }}>{t.header.traiteurAdmin}</div>
            </div>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.20),rgba(251,191,36,0.08))', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24' }}
            >
              CG
            </div>
            <div className="w-px h-5 shrink-0" style={{ background: 'var(--border-default)' }} />
            <NotificationBell count={1} />
            <ThemeToggle />
            <LangToggle />
            <div className="w-px h-5 shrink-0" style={{ background: 'var(--border-default)' }} />
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 text-[13px] font-medium shrink-0 px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-3)', background: 'transparent', border: '1px solid transparent' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'var(--text-2)'; el.style.borderColor = 'var(--border-default)'; el.style.background = 'var(--bg-card)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'var(--text-3)'; el.style.borderColor = 'transparent'; el.style.background = 'transparent' }}
            >
              <Shield size={12} strokeWidth={1.8} />
              {t.header.portalAdmin}
              <ChevronRight size={11} strokeWidth={2} />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
