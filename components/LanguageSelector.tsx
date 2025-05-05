'use client'

import { languages } from '@/app/i18n/settings'

interface LanguageSelectorProps {
  currentLang: string
  onLanguageChange: (lang: string) => void
}

export default function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex justify-end mb-4">
      <select
        value={currentLang}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
      >
        {languages.map((lng) => (
          <option key={lng} value={lng}>
            {lng === 'en' ? 'English' : '한국어'}
          </option>
        ))}
      </select>
    </div>
  )
} 