'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/app/i18n/client'
import PDFUploader from '@/components/PDFUploader'
import PDFList from '@/components/PDFList'
import PDFMergerClient from '@/components/PDFMergerClient'
import LanguageSelector from '@/components/LanguageSelector'
import { languages, fallbackLng } from './i18n/settings'

interface PDFItem {
  id: string
  file: File
}

export default function Home() {
  const [files, setFiles] = useState<PDFItem[]>([])
  const [currentLang, setCurrentLang] = useState(fallbackLng)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    // 브라우저의 기본 언어 설정 확인
    const browserLang = navigator.language.split('-')[0]
    if (languages.includes(browserLang)) {
      setCurrentLang(browserLang)
      i18n.changeLanguage(browserLang)
    }
  }, [i18n])

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang)
    i18n.changeLanguage(lang)
  }

  const handleFilesSelected = (newFiles: File[]) => {
    const newPDFItems = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file
    }))
    setFiles(prev => [...prev, ...newPDFItems])
  }

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    const newFiles = [...files]
    const [removed] = newFiles.splice(dragIndex, 1)
    newFiles.splice(hoverIndex, 0, removed)
    setFiles(newFiles)
  }

  const handleRemove = (id: string) => {
    setFiles(files.filter(file => file.id !== id))
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <LanguageSelector 
            currentLang={currentLang} 
            onLanguageChange={handleLanguageChange} 
          />
        </div>
        
        <div className="space-y-6">
          <PDFUploader onFilesSelected={handleFilesSelected} t={t} />
          <PDFList 
            files={files} 
            onReorder={handleReorder} 
            onRemove={handleRemove} 
            t={t} 
          />
          <PDFMergerClient files={files} />
        </div>
      </div>
    </main>
  )
} 