import { useState, type ReactNode } from 'react'

export interface PageTab {
  id: string
  label: string
  icon?: ReactNode
  badge?: number | string
}

interface PageTabsProps {
  tabs: PageTab[]
  children: (activeId: string) => ReactNode
  defaultTab?: string
}

export function PageTabs({ tabs, children, defaultTab }: PageTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? '')

  return (
    <>
      {/* Tab bar */}
      <div
        className="sticky top-[52px] z-10 px-5 flex items-end gap-1 overflow-x-auto"
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          scrollbarWidth: 'none',
        }}>
        {tabs.map(tab => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="relative flex items-center gap-1.5 shrink-0 px-4 py-3 text-[12.5px] font-semibold cursor-pointer transition-colors"
              style={{
                color: isActive ? 'var(--accent)' : 'var(--text-3)',
                background: 'transparent',
                border: 'none',
              }}>
              {tab.icon && (
                <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-4)' }}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                  style={{
                    background: isActive ? 'var(--accent-dim)' : 'var(--bg-inner)',
                    color: isActive ? 'var(--accent)' : 'var(--text-4)',
                    border: `1px solid ${isActive ? 'var(--accent-border)' : 'var(--border-default)'}`,
                  }}>
                  {tab.badge}
                </span>
              )}
              {/* Active underline */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div>{children(active)}</div>
    </>
  )
}
