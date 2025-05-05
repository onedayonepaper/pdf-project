import { useRef, useState, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface PDFItem {
  id: string
  file: File
}

interface PDFListProps {
  files: PDFItem[]
  onReorder: (dragIndex: number, hoverIndex: number) => void
  onRemove: (id: string) => void
  t: (key: string) => string
}

const PDFItem = ({ file, index, onRemove, onReorder, t }: { 
  file: PDFItem, 
  index: number, 
  onRemove: (id: string) => void, 
  onReorder: (dragIndex: number, hoverIndex: number) => void,
  t: (key: string) => string 
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    setKey(prev => prev + 1)
  }, [t])

  const [{ isDragging: isDndDragging }, drag] = useDrag({
    type: 'PDF_ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'PDF_ITEM',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current || !mounted) return
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

  const handleTouchStart = () => {
    if (!mounted) return
    setIsDragging(true)
  }

  const handleTouchEnd = () => {
    if (!mounted) return
    setIsDragging(false)
  }

  if (!mounted) return null

  return (
    <div
      key={key}
      ref={ref}
      role="listitem"
      aria-label={`${file.file.name}, ${(file.file.size / (1024 * 1024)).toFixed(2)} MB`}
      className={`flex items-center justify-between p-4 mb-2 rounded-lg border
        ${isDragging || isDndDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
        transition-colors duration-200`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center space-x-4">
        <div 
          role="button"
          tabIndex={0}
          aria-label={t('list.reorder')}
          className="text-gray-400 cursor-move focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded
            touch-none select-none"
        >
          ⋮⋮
        </div>
        <span className="font-medium truncate max-w-[200px] sm:max-w-none">{file.file.name}</span>
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {(file.file.size / (1024 * 1024)).toFixed(2)} MB
        </span>
      </div>
      <button
        onClick={() => onRemove(file.id)}
        aria-label={`${t('list.remove')} ${file.file.name}`}
        className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded
          p-1"
      >
        ✕
      </button>
    </div>
  )
}

export default function PDFList({ files, onReorder, onRemove, t }: PDFListProps) {
  const [mounted, setMounted] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    setKey(prev => prev + 1)
  }, [t])

  if (!mounted || files.length === 0) return null

  return (
    <div key={key} className="mt-8">
      <h2 className="text-lg font-medium mb-4">{t('list.title')}</h2>
      <div 
        role="list"
        aria-label={t('list.title')}
        className="space-y-2"
      >
        {files.map((file, index) => (
          <PDFItem
            key={file.id}
            file={file}
            index={index}
            onRemove={onRemove}
            onReorder={onReorder}
            t={t}
          />
        ))}
      </div>
    </div>
  )
} 