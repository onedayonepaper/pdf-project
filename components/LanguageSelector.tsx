'use client'

import { useState, useEffect } from 'react'
import { getI18n, createUseTranslation } from '@/app/i18n/client'
import { languages } from '@/app/i18n/settings'

interface LanguageSelectorProps {
  currentLang: string
  onLanguageChange: (lang: string) => void
}

export default function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
  const [ready, setReady] = useState(false)
  const [tHook, setTHook] = useState<() => any>(() => () => ({ t: () => '' }))

  useEffect(() => {
    getI18n(currentLang).then(i18n => {
      setTHook(() => createUseTranslation(currentLang))
      setReady(true)
    })
  }, [currentLang])

  if (!ready) return null
  const { t } = tHook()

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
            ${currentLang === lang
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
} 