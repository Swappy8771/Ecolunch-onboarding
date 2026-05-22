import { ClientHeader } from './ClientHeader'
import { Outlet } from 'react-router-dom'
import { ClientSidebar } from './ClientSidebar'

export function ClientLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <ClientHeader />
      <ClientSidebar />
      <main className="ml-[232px] pt-[52px] min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <Outlet />
      </main>
    </div>
  )
}
