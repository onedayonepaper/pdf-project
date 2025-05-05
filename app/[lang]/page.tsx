import PDFMergerClient from '@/components/PDFMergerClient'
import { languages, fallbackLng } from '../i18n/settings'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lang: lng }))
}

export default function Home({ params: { lang } }: { params: { lang: string } }) {
  // Validate language parameter
  const validLang = languages.includes(lang) ? lang : fallbackLng
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">PDF Merge</h1>
      <PDFMergerClient lang={validLang} />
    </div>
  )
} 