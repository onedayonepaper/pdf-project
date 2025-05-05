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
import { I18nextProvider, useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { initI18n } from '@/app/i18n/client'

interface PDFMergerClientProps {
  lang: string
}

function PDFMergerContent({ lang }: PDFMergerClientProps) {
  const [files, setFiles] = useState<{ id: string; file: File }[]>([])
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t, i18n } = useTranslation('common')
  const router = useRouter()

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
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang)
    router.push(`/${newLang}`)
  }

  const handleFilesSelected = (newFiles: File[]) => {
    const newFileItems = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file
    }))
    setFiles(prevFiles => [...prevFiles, ...newFileItems])
  }

  const handleRemoveFile = (id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id))
  }

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = files[dragIndex]
    const newFiles = [...files]
    newFiles.splice(dragIndex, 1)
    newFiles.splice(hoverIndex, 0, draggedItem)
    setFiles(newFiles)
  }

  const handleMergeComplete = () => {
    setFiles([])
  }

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8 text-center">PDF Merge</h1>
      </div>
    )
  }

  return (
    <>
      <LanguageSelector currentLang={lang} onLanguageChange={handleLanguageChange} />
      <h1 className="text-2xl font-bold mb-8 text-center">{t('title')}</h1>
      <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
        <PDFUploader onFilesSelected={handleFilesSelected} t={t} />
        <PDFList
          files={files}
          onRemove={handleRemoveFile}
          onReorder={handleReorder}
          t={t}
        />
        <MergeButton
          files={files}
          onMergeComplete={handleMergeComplete}
          t={t}
        />
      </DndProvider>
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default function PDFMergerClient({ lang }: PDFMergerClientProps) {
  const i18n = initI18n(lang)

  return (
    <I18nextProvider i18n={i18n}>
      <PDFMergerContent lang={lang} />
    </I18nextProvider>
  )
} 