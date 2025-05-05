import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface PDFItem {
  id: string
  file: File
}

interface PDFListProps {
  files: PDFItem[]
  onReorder: (dragIndex: number, hoverIndex: number) => void
  onRemove: (id: string) => void
}

const PDFItem = ({ file, index, onRemove, onReorder }: { file: PDFItem, index: number, onRemove: (id: string) => void, onReorder: (dragIndex: number, hoverIndex: number) => void }) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'PDF_ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'PDF_ITEM',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      onReorder(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      role="listitem"
      aria-label={`${file.file.name}, ${(file.file.size / (1024 * 1024)).toFixed(2)} MB`}
      className={`flex items-center justify-between p-4 mb-2 rounded-lg border
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
    >
      <div className="flex items-center space-x-4">
        <div 
          role="button"
          tabIndex={0}
          aria-label="파일 순서 변경"
          className="text-gray-400 cursor-move focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          ⋮⋮
        </div>
        <span className="font-medium">{file.file.name}</span>
        <span className="text-sm text-gray-500">
          {(file.file.size / (1024 * 1024)).toFixed(2)} MB
        </span>
      </div>
      <button
        onClick={() => onRemove(file.id)}
        aria-label={`${file.file.name} 삭제`}
        className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
      >
        ✕
      </button>
    </div>
  )
}

export default function PDFList({ files, onReorder, onRemove }: PDFListProps) {
  if (files.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-4">업로드된 PDF 파일</h2>
      <div 
        role="list"
        aria-label="업로드된 PDF 파일 목록"
        className="space-y-2"
      >
        {files.map((file, index) => (
          <PDFItem
            key={file.id}
            file={file}
            index={index}
            onRemove={onRemove}
            onReorder={onReorder}
          />
        ))}
      </div>
    </div>
  )
} 