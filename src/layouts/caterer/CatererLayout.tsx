import { useState } from 'react'
import { CatererHeader } from './CatererHeader'
import { Outlet } from 'react-router-dom'
import { CatererSidebar } from './CatererSidebar'
import { useIsDesktop } from '@shared/hooks/useIsDesktop'

export function CatererLayout() {
  const isDesktop = useIsDesktop()
  const [collapsed, setCollapsed]   = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sidebarWidth = isDesktop ? (collapsed ? 68 : 280) : 0

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-base)' }}>
      <CatererHeader
        sidebarWidth={sidebarWidth}
        isDesktop={isDesktop}
        onMenuClick={() => setDrawerOpen(o => !o)}
      />

      <CatererSidebar
        isDesktop={isDesktop}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        drawerOpen={drawerOpen}
        onDrawerClose={() => setDrawerOpen(false)}
      />

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
          transition: 'margin-left 260ms cubic-bezier(0.4,0,0.2,1)',
          background: 'var(--bg-base)',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
