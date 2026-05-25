import { createContext, useContext, useState, type ReactNode } from 'react'
import { fr } from '../i18n/fr'
import { en } from '../i18n/en'
import type { Translations } from '../i18n/fr'

type Lang = 'fr' | 'en'

interface LangContextValue {
  lang: Lang
  toggleLang: () => void
  t: Translations
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('ecolunch-lang')
    return stored === 'en' ? 'en' : 'fr'
  })

  function toggleLang() {
    setLang(l => {
      const next = l === 'fr' ? 'en' : 'fr'
      localStorage.setItem('ecolunch-lang', next)
      return next
    })
  }

  const t = lang === 'fr' ? fr : en

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
