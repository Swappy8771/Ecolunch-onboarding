import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer shrink-0"
      style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'var(--accent-border)'
        el.style.color = 'var(--accent)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'var(--border-default)'
        el.style.color = 'var(--text-3)'
      }}
    >
      {theme === 'dark'
        ? <Sun size={14} strokeWidth={2} />
        : <Moon size={14} strokeWidth={2} />}
    </button>
  )
}
