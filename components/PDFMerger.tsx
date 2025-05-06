'use client'

import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getI18n, createUseTranslation } from '../app/i18n/client'
import PDFUploader from './PDFUploader'
import PDFList from './PDFList'
import MergeButton from './MergeButton'
import LanguageSelector from './LanguageSelector'

interface PDFItem {
  id: string
  file: File
}

export default function PDFMerger() {
  const [files, setFiles] = useState<PDFItem[]>([])
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')
  const [ready, setReady] = useState(false)
  const [tHook, setTHook] = useState<() => any>(() => () => ({ t: () => '' }))

  useEffect(() => {
    setMounted(true)
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      )
    }
    checkTouchDevice()
  }, [])

  useEffect(() => {
    getI18n(currentLang).then(i18n => {
      setTHook(() => createUseTranslation(currentLang))
      setReady(true)
    })
  }, [currentLang])

  if (!mounted || !ready) {
    return null
  }

  const { t } = tHook()

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

  const handleRemove = (id: string) => {
    setFiles(files.filter(file => file.id !== id))
  }

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    const newFiles = [...files]
    const [removed] = newFiles.splice(dragIndex, 1)
    newFiles.splice(hoverIndex, 0, removed)
    setFiles(newFiles)
  }

  const handleMergeComplete = () => {
    setFiles([])
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
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
        <MergeButton files={files} lang={currentLang} onMergeComplete={handleMergeComplete} />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
} 