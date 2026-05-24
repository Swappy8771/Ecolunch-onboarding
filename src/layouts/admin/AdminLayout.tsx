import { useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 68 : 280

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <AdminHeader sidebarWidth={sidebarWidth} />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
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
