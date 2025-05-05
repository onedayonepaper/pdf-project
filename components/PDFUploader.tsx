import { useCallback, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { toast } from 'react-toastify'

interface PDFUploaderProps {
  onFilesSelected: (files: File[]) => void
}

export default function PDFUploader({ onFilesSelected }: PDFUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setIsDragging(false)

    // 거절된 파일에 대한 상세 오류 메시지
    if (fileRejections.length > 0) {
      const errors = fileRejections.map(({ file, errors }) => {
        const errorMessages = errors.map(error => {
          if (error.code === 'file-too-large') {
            return `파일 크기가 20MB를 초과합니다 (${(file.size / (1024 * 1024)).toFixed(2)}MB)`
          }
          if (error.code === 'file-invalid-type') {
            return 'PDF 파일만 업로드 가능합니다'
          }
          return error.message
        })
        return `${file.name}: ${errorMessages.join(', ')}`
      })
      toast.error(errors.join('\n'))
    }

    // PDF 파일만 필터링
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf')
    
    // 파일 개수 제한 검사
    if (pdfFiles.length > 10) {
      toast.error('최대 10개의 PDF 파일만 업로드 가능합니다')
      return
    }

    onFilesSelected(pdfFiles)
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    maxFiles: 10,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  })

  return (
    <div
      {...getRootProps()}
      role="button"
      tabIndex={0}
      aria-label="PDF 파일 업로드 영역"
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      <input {...getInputProps()} aria-label="PDF 파일 선택" />
      <div className="space-y-2">
        <p className="text-lg font-medium">
          {isDragActive ? 'PDF 파일을 여기에 놓으세요' : 'PDF 파일을 드래그하거나 클릭하여 선택하세요'}
        </p>
        <p className="text-sm text-gray-500">
          최대 10개의 PDF 파일, 각 파일 최대 20MB
        </p>
        <p className="text-xs text-gray-400">
          지원 형식: PDF (.pdf)
        </p>
      </div>
    </div>
  )
} 