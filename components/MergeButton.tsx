import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'react-toastify'

interface MergeButtonProps {
  files: { id: string; file: File }[]
  onMergeComplete: () => void
  t: (key: string, options?: { [key: string]: string }) => string
}

export default function MergeButton({ files, onMergeComplete, t }: MergeButtonProps) {
  const [isMerging, setIsMerging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')

  const mergePDFs = useCallback(async () => {
    if (files.length === 0) {
      toast.error(t('errors.noFiles'))
      return
    }

    setIsMerging(true)
    setProgress(0)
    try {
      const mergedPdf = await PDFDocument.create()
      const totalFiles = files.length
      let totalPages = 0
      let processedPages = 0
      
      // 전체 페이지 수 계산
      for (const { file } of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        totalPages += pdfDoc.getPageCount()
      }

      // 페이지별 병합 진행
      for (let i = 0; i < files.length; i++) {
        const { file } = files[i]
        setCurrentFile(file.name)
        
        const arrayBuffer = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        
        for (const page of pages) {
          mergedPdf.addPage(page)
          processedPages++
          setProgress((processedPages / totalPages) * 100)
        }
      }

      setProgress(100)
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

      toast.success(t('merge.success'))
      onMergeComplete()
    } catch (error) {
      console.error('PDF 병합 중 오류 발생:', error)
      toast.error(t('merge.error'))
    } finally {
      setIsMerging(false)
      setProgress(0)
      setCurrentFile('')
    }
  }, [files, onMergeComplete, t])

  return (
    <div className="mt-8">
      {isMerging && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              {currentFile ? t('merge.currentFile', { fileName: currentFile }) : t('merge.processing')}
            </span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <button
        onClick={mergePDFs}
        disabled={isMerging || files.length === 0}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white
          ${isMerging || files.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isMerging ? t('merge.processing') : t('merge.button')}
      </button>
    </div>
  )
} 