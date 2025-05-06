'use client'

import { useState, useEffect } from 'react'
import { getI18n, createUseTranslation } from '@/app/i18n/client'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'react-toastify'

interface PDFItem {
  id: string
  file: File
}

interface Props {
  files: PDFItem[]
  lang?: string
}

export default function PDFMergerClient({ files, lang = 'en' }: Props) {
  const [isMerging, setIsMerging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [tHook, setTHook] = useState<() => any>(() => () => ({ t: () => '' }))

  useEffect(() => {
    getI18n(lang).then(i18n => {
      setTHook(() => createUseTranslation(lang))
      setReady(true)
    })
  }, [lang])

  if (!ready) return null
  const { t } = tHook()

  const mergePDFs = async () => {
    if (files.length === 0) return

    setIsMerging(true)
    setProgress(0)

    try {
      const mergedPdf = await PDFDocument.create()
      const totalFiles = files.length

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i].file
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(page => mergedPdf.addPage(page))
        
        setProgress(Math.round(((i + 1) / totalFiles) * 100))
      }

      const mergedPdfFile = await mergedPdf.save()
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = 'merged.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(t('merge.success'))
    } catch (error) {
      console.error('PDF 병합 중 오류:', error)
      toast.error(t('merge.error'))
    } finally {
      setIsMerging(false)
      setProgress(0)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={mergePDFs}
        disabled={isMerging || files.length === 0}
        className={`px-6 py-2 rounded-lg font-medium transition-colors
          ${isMerging || files.length === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        {isMerging ? t('merge.processing') : t('merge.button')}
      </button>

      {isMerging && (
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {t('merge.currentFile', { fileName: files[Math.floor(progress / 100 * files.length)]?.file.name })}
          </p>
        </div>
      )}
    </div>
  )
} 