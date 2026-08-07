import { useState } from 'react'
import { CatererHeader } from './CatererHeader'
import { Outlet } from 'react-router-dom'
import { CatererSidebar } from './CatererSidebar'
import { SupportSessionBanner } from './SupportSessionBanner'
import { useIsDesktop } from '../../shared/hooks/useIsDesktop'
import { useCatererAuth } from '@/auth/caterer'

export function CatererLayout() {
  const isDesktop = useIsDesktop()
  const [collapsed, setCollapsed]   = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { supportSession } = useCatererAuth()

  const sidebarWidth = isDesktop ? (collapsed ? 68 : 280) : 0
  const bannerHeight = supportSession ? 36 : 0

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
        topOffset={bannerHeight}
      />

      {isDesktop && <SupportSessionBanner sidebarWidth={sidebarWidth} />}

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
        className="min-h-screen"
        style={{
          paddingTop: 52 + bannerHeight,
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
