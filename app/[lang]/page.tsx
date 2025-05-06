'use client'

import { useState, useEffect } from 'react'
import { getI18n, createUseTranslation } from '@/app/i18n/client'
import PDFUploader from '@/components/PDFUploader'
import PDFList from '@/components/PDFList'
import PDFMergerClient from '@/components/PDFMergerClient'
import LanguageSelector from '@/components/LanguageSelector'
import { languages, fallbackLng } from '../i18n/settings'

interface PDFItem {
  id: string
  file: File
}

export default function Home({ params: { lang } }: { params: { lang: string } }) {
  const [files, setFiles] = useState<PDFItem[]>([])
  const [currentLang, setCurrentLang] = useState(lang || fallbackLng)
  const [ready, setReady] = useState(false)
  const [tHook, setTHook] = useState<() => any>(() => () => ({ t: () => '', i18n: null }))

  // i18n 초기화
  useEffect(() => {
    getI18n(currentLang).then(i18n => {
      setTHook(() => createUseTranslation(currentLang))
      setReady(true)
    })
  }, [currentLang])

  // 브라우저 언어 설정 확인
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]
    if (languages.includes(browserLang)) {
      setCurrentLang(browserLang)
    }
  }, [])

  const { t, i18n } = tHook()

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang)
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

  if (!ready) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold" suppressHydrationWarning>{t('title')}</h1>
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
          <PDFMergerClient files={files} lang={currentLang} />
        </div>
      </div>
    </main>
  )
} 