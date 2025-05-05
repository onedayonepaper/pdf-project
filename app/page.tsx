import PDFMerger from '@/components/PDFMerger'

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">PDF Merge</h1>
      <PDFMerger />
    </main>
  )
} 