import { useMemo, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../../shared/context/LangContext'
import {
  LayoutDashboard, UserCheck,
  ClipboardCheck, FolderLock, FileText,
  MessageCircle, SlidersHorizontal, Rocket, ShieldCheck,
  ChevronsLeft, ChevronsRight, X,
} from 'lucide-react'

export type NavItemId =
  | 'dashboard' | 'caterers' | 'centre-validation'
  | 'document-vault' | 'contract-management' | 'modules-pricing'
  | 'golive-monitor' | 'ecoloop'

interface NavSection { id: NavItemId; label: string; icon: ReactNode }

const NAV: NavSection[] = [
  { id: 'dashboard',           label: 'Dashboard Onboarding',              icon: <LayoutDashboard   size={16} strokeWidth={1.8} /> },
  { id: 'caterers',            label: 'Caterers in Onboarding',            icon: <UserCheck         size={16} strokeWidth={1.8} /> },
  { id: 'centre-validation',   label: 'Validation Center',                 icon: <ClipboardCheck    size={16} strokeWidth={1.8} /> },
  { id: 'document-vault',      label: 'Document Vault by Caterer',         icon: <FolderLock        size={16} strokeWidth={1.8} /> },
  { id: 'contract-management', label: 'Contract Management',               icon: <FileText          size={16} strokeWidth={1.8} /> },
  { id: 'modules-pricing',     label: 'Modules, Pricing & Configurations', icon: <SlidersHorizontal size={16} strokeWidth={1.8} /> },
  { id: 'golive-monitor',      label: 'Go-live Monitor',                   icon: <Rocket            size={16} strokeWidth={1.8} /> },
  { id: 'ecoloop',             label: 'EcoLoop Onboarding',                icon: <MessageCircle     size={16} strokeWidth={1.8} /> },
]

const PERMISSIONS = ['Création client', 'Configuration tiles', 'Demande corrections', 'Import Management']

const ADMIN_PATHS: Record<NavItemId, string> = {
  dashboard:            '/admin/dashboard',
  caterers:             '/admin/caterers',
  'centre-validation':  '/admin/validation-center',
  'document-vault':     '/admin/document-vault',
  'contract-management':'/admin/contract-management',
  'modules-pricing':    '/admin/modules-pricing',
  'golive-monitor':     '/admin/golive-monitor',
  ecoloop:              '/admin/ecoloop',
}

function inferActiveAdminNavId(pathname: string): NavItemId {
  if (pathname.startsWith('/admin/caterers')) return 'caterers'
  if (pathname.startsWith('/admin/validation-center')) return 'centre-validation'
  if (pathname.startsWith('/admin/document-vault')) return 'document-vault'
  if (pathname.startsWith('/admin/contract-management')) return 'contract-management'
  if (pathname.startsWith('/admin/modules-pricing')) return 'modules-pricing'
  if (pathname.startsWith('/admin/golive-monitor')) return 'golive-monitor'
  if (pathname.startsWith('/admin/ecoloop')) return 'ecoloop'
  return 'dashboard'
}

interface SidebarProps {
  isDesktop: boolean
  collapsed: boolean
  onToggle: () => void
  drawerOpen: boolean
  onDrawerClose: () => void
}

/* ── Shared nav content ─────────────────────────────────── */
function NavContent({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const { pathname } = useLocation()
  const activeItem = useMemo(() => inferActiveAdminNavId(pathname), [pathname])
  const { t } = useLang()
  const NAV_LABELS: Record<NavItemId, string> = {
    dashboard:            t.adminSidebar.nav.dashboard,
    caterers:             t.adminSidebar.nav.caterers,
    'centre-validation':  t.adminSidebar.nav.centreValidation,
    'document-vault':     t.adminSidebar.nav.documentVault,
    'contract-management':t.adminSidebar.nav.contractManagement,
    'modules-pricing':    t.adminSidebar.nav.modulesPricing,
    'golive-monitor':     t.adminSidebar.nav.goLiveMonitor,
    ecoloop:              t.adminSidebar.nav.ecoloop,
  }

  return (
    <>
      {/* Persona card */}
      {!collapsed && (
        <div className="mx-4 mb-1">
          <div className="rounded-xl px-4 py-4"
            style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--bg-inner))', border: '1px solid var(--border-default)' }}>
            <p className="text-[11px] uppercase tracking-[0.15em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>{t.adminSidebar.persona}</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-bold"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>OA</div>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold leading-tight" style={{ color: 'var(--text-1)' }}>{t.adminSidebar.roleName}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0" />
                  <p className="text-[12px] leading-tight" style={{ color: 'var(--text-3)' }}>{t.adminSidebar.roleDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="flex justify-center mb-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-bold"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>OA</div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 pt-3 pb-2 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-2 mb-3 text-[11px] uppercase tracking-[0.15em] font-bold" style={{ color: 'var(--text-4)' }}>
            {t.adminSidebar.sectionLabel}
          </p>
        )}
        <div className="space-y-1">
          {NAV.map(item => {
            const isActive = item.id === activeItem
            const itemPath = ADMIN_PATHS[item.id]

            if (collapsed) {
              return (
                <div key={item.id} className="flex justify-center">
                  <NavLink to={itemPath} title={NAV_LABELS[item.id]}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150"
                    style={({ isActive: a }) => ({
                      background: a || isActive ? 'var(--accent-dim)' : 'transparent',
                      color: a || isActive ? 'var(--accent)' : 'var(--text-3)',
                      borderLeft: a || isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    })} end>{item.icon}</NavLink>
                </div>
              )
            }

            return (
              <NavLink key={item.id} to={itemPath} onClick={onClose}
                className="w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 cursor-pointer"
                style={({ isActive: a }) => ({ padding: '10px 12px', background: a ? 'var(--accent-dim)' : 'transparent', borderLeft: a ? '2px solid var(--accent)' : '2px solid transparent', color: a ? 'var(--text-1)' : 'var(--text-3)' })} end>
                {({ isActive: a }) => (
                  <>
                    <span style={{ color: a ? 'var(--accent)' : 'var(--text-3)', flexShrink: 0 }}>{item.icon}</span>
                    <span className="flex-1 text-[13px] font-medium truncate">{NAV_LABELS[item.id]}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Permissions */}
      {!collapsed && (
        <div className="mx-4 mb-4">
          <div className="rounded-xl px-4 py-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={13} strokeWidth={2} style={{ color: 'var(--accent)' }} />
              <p className="text-[11px] uppercase tracking-[0.15em] font-bold" style={{ color: 'var(--text-4)' }}>
                {t.adminSidebar.permissionsLabel} ({PERMISSIONS.length})
              </p>
            </div>
            <div className="space-y-2.5">
              {PERMISSIONS.map(p => (
                <div key={p} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)', opacity: 0.7 }} />
                  <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="flex justify-center mb-4">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--accent)' }}>
            <ShieldCheck size={15} strokeWidth={2} />
          </div>
        </div>
      )}
    </>
  )
}

/* ── Sidebar ─────────────────────────────────────────────── */
export function Sidebar({ isDesktop, collapsed, onToggle, drawerOpen, onDrawerClose }: SidebarProps) {

  /* ── Desktop: fixed sidebar ── */
  if (isDesktop) {
    return (
      <aside className="fixed left-0 top-[52px] bottom-0 flex flex-col overflow-hidden"
        style={{ width: collapsed ? 68 : 300, background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)', transition: 'width 260ms cubic-bezier(0.4,0,0.2,1)' }}>

        {/* Toggle button */}
        <div className="flex items-center mx-3 mt-3 mb-1" style={{ justifyContent: collapsed ? 'center' : 'flex-end' }}>
          <button onClick={onToggle}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--accent-border)'; el.style.color = 'var(--accent)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--border-default)'; el.style.color = 'var(--text-3)' }}>
            {collapsed ? <ChevronsRight size={13} strokeWidth={2.5} /> : <ChevronsLeft size={13} strokeWidth={2.5} />}
          </button>
        </div>

        <NavContent collapsed={collapsed} />
      </aside>
    )
  }

  /* ── Mobile: slide-over drawer ── */
  return (
    <aside
      className="fixed top-0 left-0 bottom-0 flex flex-col overflow-hidden"
      style={{
        zIndex: 50,
        width: 300,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        visibility: drawerOpen ? 'visible' : 'hidden',
        transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1), visibility 280ms',
        boxShadow: drawerOpen ? 'var(--shadow-drawer)' : 'none',
        pointerEvents: drawerOpen ? 'auto' : 'none',
      }}
    >
      {/* Drawer header with close button */}
      <div className="flex items-center justify-between px-4 h-[52px] shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>OA</div>
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>Navigation</span>
        </div>
        <button onClick={onDrawerClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}>
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      <NavContent collapsed={false} onClose={onDrawerClose} />
    </aside>
  )
}
