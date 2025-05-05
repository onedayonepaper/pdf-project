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

export default function PDFMerger() {
  const [files, setFiles] = useState<{ id: string; file: File }[]>([])
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouchStart = 'ontouchstart' in window
      const hasMaxTouchPoints = typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0
      setIsTouchDevice(hasTouchStart || hasMaxTouchPoints)
    }
    checkTouchDevice()
  }, [])

  const handleFilesSelected = (newFiles: File[]) => {
    const newFileItems = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file
    }))
    setFiles(prev => [...prev, ...newFileItems])
  }

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
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
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <PDFUploader onFilesSelected={handleFilesSelected} />
      <PDFList
        files={files}
        onRemove={handleRemoveFile}
        onReorder={handleReorder}
      />
      <MergeButton
        files={files}
        onMergeComplete={handleMergeComplete}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </DndProvider>
  )
} 