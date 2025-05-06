'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { useTranslation } from '@/app/i18n/client'

interface PDFItem {
  id: string
  file: File
}

interface PDFMergerClientProps {
  files: PDFItem[]
}

export default function PDFMergerClient({ files }: PDFMergerClientProps) {
  const [isMerging, setIsMerging] = useState(false)
  const [progress, setProgress] = useState(0)
  const { t } = useTranslation()

  const mergePDFs = async () => {
    if (files.length === 0) return
    setIsMerging(true)
    setProgress(0)

    try {
      const mergedPdf = await PDFDocument.create()
      const totalPages = files.length
      let processedPages = 0

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        pages.forEach(page => mergedPdf.addPage(page))
        
        processedPages++
        setProgress((processedPages / totalPages) * 100)
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error merging PDFs:', error)
    } finally {
      setIsMerging(false)
      setProgress(0)
    }
  }

  if (files.length === 0) return null

  return (
    <div className="space-y-4">
      <button
        onClick={mergePDFs}
        disabled={isMerging}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isMerging ? t('merging') : t('merge')}
      </button>
      
      {isMerging && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
} 