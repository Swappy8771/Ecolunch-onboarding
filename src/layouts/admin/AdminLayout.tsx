import { AdminHeader } from './AdminHeader'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AdminLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <AdminHeader />
      <Sidebar />
      <main className="ml-[232px] pt-[52px] min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <Outlet />
      </main>
    </div>
  )
}
