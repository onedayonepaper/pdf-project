'use client'

import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PDFUploader from './PDFUploader'
import PDFList from './PDFList'
import MergeButton from './MergeButton'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from '../app/i18n/client'

interface PDFItem {
  id: string
  file: File
}

export default function PDFMerger() {
  const [files, setFiles] = useState<PDFItem[]>([])
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentLang, setCurrentLang] = useState('ko')
  const { t, i18n, ready } = useTranslation()

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

  if (!mounted || !ready) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <LanguageSelector 
        currentLang={currentLang} 
        onLanguageChange={handleLanguageChange} 
      />
      <h1 className="text-2xl font-bold mb-8 text-center transition-opacity duration-200">
        {t('title')}
      </h1>
      <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
        <div className="transition-opacity duration-200">
          <PDFUploader onFilesSelected={handleFilesSelected} t={t} />
          <PDFList
            files={files}
            onRemove={handleRemove}
            onReorder={handleReorder}
            t={t}
          />
          <MergeButton
            files={files}
            onMergeComplete={handleMergeComplete}
            t={t}
          />
        </div>
      </DndProvider>
      <ToastContainer position="bottom-right" />
    </div>
  )
} 