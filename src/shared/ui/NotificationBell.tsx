import { Bell } from 'lucide-react'
import { useState } from 'react'

interface NotificationBellProps {
  count?: number
}

export function NotificationBell({ count = 0 }: NotificationBellProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer shrink-0"
      style={{
        background: hovered ? 'var(--bg-card)' : 'var(--bg-inner)',
        border: hovered ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
        color: hovered ? 'var(--accent)' : 'var(--text-3)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Notifications"
    >
      <Bell size={14} strokeWidth={2} />

      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-black px-1 leading-none"
          style={{
            background: 'var(--accent)',
            color: '#07070a',
            boxShadow: '0 0 0 2px var(--bg-surface)',
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
