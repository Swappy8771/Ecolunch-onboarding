import { useMemo, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../../shared/context/LangContext'
import {
  LayoutDashboard, Users, UserCheck,
  ClipboardCheck, FolderInput, FolderLock,
  MessageCircle, SlidersHorizontal, ChevronDown, ShieldCheck,
  ChevronsLeft, ChevronsRight, X,
} from 'lucide-react'

export type NavItemId =
  | 'dashboard' | 'onboarding' | 'traiteurs'
  | 'centre-validation' | 'centre-import' | 'document-vault' | 'ecoloop' | 'modules'

interface NavChild  { id: NavItemId; label: string; icon: ReactNode }
interface NavSection { id: NavItemId; label: string; icon: ReactNode; children?: NavChild[] }

const NAV: NavSection[] = [
  { id: 'dashboard',         label: 'Dashboard',                   icon: <LayoutDashboard   size={16} strokeWidth={1.8} /> },
  {
    id: 'onboarding', label: 'Onboarding', icon: <Users size={16} strokeWidth={1.8} />,
    children: [{ id: 'traiteurs', label: 'Traiteurs', icon: <UserCheck size={14} strokeWidth={1.8} /> }],
  },
  { id: 'centre-validation', label: 'Centre de validation',        icon: <ClipboardCheck    size={16} strokeWidth={1.8} /> },
  { id: 'centre-import',     label: "Centre d'import / Smart Im…", icon: <FolderInput       size={16} strokeWidth={1.8} /> },
  { id: 'document-vault',    label: 'Document Vault',              icon: <FolderLock        size={16} strokeWidth={1.8} /> },
  { id: 'ecoloop',           label: 'EcoLoop',                     icon: <MessageCircle     size={16} strokeWidth={1.8} /> },
  { id: 'modules',           label: 'Modules / Configurations',    icon: <SlidersHorizontal size={16} strokeWidth={1.8} /> },
]

const PERMISSIONS = ['Création client', 'Configuration tiles', 'Demande corrections', 'Smart Import']

const ADMIN_PATHS: Partial<Record<NavItemId, string>> = {
  dashboard: '/admin/dashboard',
  traiteurs: '/admin/traiteurs',
  'centre-validation': '/admin/centre-validation',
  'centre-import': '/admin/centre-import',
  'document-vault': '/admin/document-vault',
  ecoloop: '/admin/ecoloop',
  modules: '/admin/modules',
}

function inferActiveAdminNavId(pathname: string): NavItemId {
  if (pathname.startsWith('/admin/traiteurs')) return 'traiteurs'
  if (pathname.startsWith('/admin/centre-validation')) return 'centre-validation'
  if (pathname.startsWith('/admin/centre-import')) return 'centre-import'
  if (pathname.startsWith('/admin/document-vault')) return 'document-vault'
  if (pathname.startsWith('/admin/ecoloop')) return 'ecoloop'
  if (pathname.startsWith('/admin/modules')) return 'modules'
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
  const [expanded, setExpanded] = useState<Set<NavItemId>>(new Set(['onboarding']))
  const { pathname } = useLocation()
  const activeItem = useMemo(() => inferActiveAdminNavId(pathname), [pathname])
  const { t } = useLang()
  const NAV_LABELS: Record<NavItemId, string> = {
    dashboard: t.adminSidebar.nav.dashboard,
    onboarding: t.adminSidebar.nav.onboarding,
    traiteurs: t.adminSidebar.nav.traiteurs,
    'centre-validation': t.adminSidebar.nav.centreValidation,
    'centre-import': t.adminSidebar.nav.centreImport,
    'document-vault': t.adminSidebar.nav.documentVault,
    ecoloop: t.adminSidebar.nav.ecoloop,
    modules: t.adminSidebar.nav.modules,
  }

  function toggle(id: NavItemId) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
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
            const isExpanded = expanded.has(item.id)
            const isActive = item.id === activeItem || item.children?.some(c => c.id === activeItem)
            const itemPath = ADMIN_PATHS[item.id]

            if (collapsed) {
              const path = itemPath ?? (item.children ? ADMIN_PATHS[item.children[0].id] : undefined)
              return (
                <div key={item.id} className="flex justify-center">
                  {path ? (
                    <NavLink to={path} title={NAV_LABELS[item.id] ?? item.label}
                      className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150"
                      style={({ isActive: a }) => ({
                        background: a || isActive ? 'var(--accent-dim)' : 'transparent',
                        color: a || isActive ? 'var(--accent)' : 'var(--text-3)',
                        borderLeft: a || isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      })} end>{item.icon}</NavLink>
                  ) : (
                    <button title={NAV_LABELS[item.id] ?? item.label}
                      className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer"
                      style={{ background: isActive ? 'var(--accent-dim)' : 'transparent', color: isActive ? 'var(--accent)' : 'var(--text-3)', border: 'none' }}>
                      {item.icon}
                    </button>
                  )}
                </div>
              )
            }

            return (
              <div key={item.id}>
                {item.children?.length ? (
                  <button onClick={() => toggle(item.id)}
                    className="w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 cursor-pointer"
                    style={{ padding: '10px 12px', background: isActive ? 'var(--accent-dim)' : 'transparent', borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent', color: isActive ? 'var(--text-1)' : 'var(--text-3)' }}>
                    <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-3)', flexShrink: 0 }}>{item.icon}</span>
                    <span className="flex-1 text-[13px] font-medium truncate">{NAV_LABELS[item.id] ?? item.label}</span>
                    <ChevronDown size={13} strokeWidth={2.5}
                      className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--text-4)' }} />
                  </button>
                ) : itemPath ? (
                  <NavLink to={itemPath} onClick={onClose}
                    className="w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 cursor-pointer"
                    style={({ isActive: a }) => ({ padding: '10px 12px', background: a ? 'var(--accent-dim)' : 'transparent', borderLeft: a ? '2px solid var(--accent)' : '2px solid transparent', color: a ? 'var(--text-1)' : 'var(--text-3)' })} end>
                    {({ isActive: a }) => (
                      <>
                        <span style={{ color: a ? 'var(--accent)' : 'var(--text-3)', flexShrink: 0 }}>{item.icon}</span>
                        <span className="flex-1 text-[13px] font-medium truncate">{NAV_LABELS[item.id] ?? item.label}</span>
                      </>
                    )}
                  </NavLink>
                ) : null}

                {item.children && isExpanded && (
                  <div className="mt-1 space-y-1">
                    {item.children.map(child => (
                      <NavLink key={child.id} to={ADMIN_PATHS[child.id] ?? '/admin/dashboard'} onClick={onClose}
                        className="w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 cursor-pointer"
                        style={({ isActive: a }) => ({ padding: '9px 12px 9px 40px', background: a ? 'var(--accent-dim)' : 'transparent', borderLeft: a ? '2px solid var(--accent)' : '2px solid transparent', color: a ? 'var(--text-1)' : 'var(--text-3)' })} end>
                        {({ isActive: a }) => (
                          <>
                            <span style={{ color: a ? 'var(--accent)' : 'var(--text-3)', flexShrink: 0 }}>{child.icon}</span>
                            <span className="flex-1 text-[13px] font-medium truncate">{NAV_LABELS[child.id] ?? child.label}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
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
        style={{ width: collapsed ? 68 : 280, background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)', transition: 'width 260ms cubic-bezier(0.4,0,0.2,1)' }}>

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
        width: 280,
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
