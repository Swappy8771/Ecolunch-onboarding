import { useLang } from '../context/LangContext'

export function LangToggle() {
  const { lang, toggleLang } = useLang()
  return (
    <button
      onClick={toggleLang}
      className="flex items-center justify-center h-8 px-2.5 rounded-lg transition-all cursor-pointer shrink-0 font-bold text-[12px] tracking-wider"
      style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}
      title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
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
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  )
}
