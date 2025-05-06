import { languages } from '../i18n/settings'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lang: lng }))
}

export default function Layout({
  children,
  params: { lang }
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 