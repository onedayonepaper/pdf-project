import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { FileRejection } from 'react-dropzone'

interface PDFUploaderProps {
  onFilesSelected: (files: File[]) => void
  t: (key: string) => string
}

export default function PDFUploader({ onFilesSelected, t }: PDFUploaderProps) {
  const [mounted, setMounted] = useState(false)
  const [key, setKey] = useState(0) // Add key for forcing re-render

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Force re-render when translation function changes
  useEffect(() => {
    setKey(prev => prev + 1)
  }, [t])

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (!mounted) return

    // 거부된 파일 처리
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach(error => {
        if (error.code === 'file-too-large') {
          toast.error(t('errors.fileTooLarge'))
        } else if (error.code === 'file-invalid-type') {
          toast.error(t('errors.invalidType'))
        } else {
          toast.error(error.message)
        }
      })
    })

    // PDF 파일만 필터링
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf')
    
    // 최대 10개 파일 제한
    if (pdfFiles.length > 10) {
      toast.error(t('errors.tooManyFiles'))
      return
    }

    onFilesSelected(pdfFiles)
  }, [onFilesSelected, t, mounted])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    maxFiles: 10
  })

  if (!mounted) return null

  return (
    <div
      key={key} // Add key to force re-render
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        transition-colors duration-200`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <p className="text-lg font-medium">{t('upload.drag')}</p>
        <p className="text-sm text-gray-500">{t('upload.click')}</p>
        <div className="text-xs text-gray-400 space-y-1">
          <p>{t('upload.maxSize')}</p>
          <p>{t('upload.maxFiles')}</p>
          <p>{t('upload.supported')}</p>
        </div>
      </div>
    </div>
  )
} 