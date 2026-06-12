import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useIsDesktop } from '../../shared/hooks/useIsDesktop'

export function AdminLayout() {
  const isDesktop = useIsDesktop()
  const [collapsed, setCollapsed]   = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sidebarWidth = isDesktop ? (collapsed ? 68 : 300) : 0

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-base)' }}>
      <AdminHeader
        sidebarWidth={sidebarWidth}
        isDesktop={isDesktop}
        onMenuClick={() => setDrawerOpen(o => !o)}
      />

      <Sidebar
        isDesktop={isDesktop}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        drawerOpen={drawerOpen}
        onDrawerClose={() => setDrawerOpen(false)}
      />

      {/* Mobile backdrop */}
      {!isDesktop && (
        <div
          className="fixed inset-0 backdrop-blur-sm"
          style={{
            zIndex: 40,
            background: 'var(--shadow-backdrop)',
            opacity: drawerOpen ? 1 : 0,
            visibility: drawerOpen ? 'visible' : 'hidden',
            transition: 'opacity 280ms ease, visibility 280ms ease',
          }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <main
        className="pt-[52px] min-h-screen"
        style={{
          marginLeft: sidebarWidth,
          paddingLeft: isDesktop ? 28 : 0,
          transition: 'margin-left 260ms cubic-bezier(0.4,0,0.2,1)',
          background: 'var(--bg-base)',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
