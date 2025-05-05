import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { languages, fallbackLng } from './i18n/settings'

export default function Home() {
  const headersList = headers()
  const acceptLanguage = headersList.get('accept-language')
  const preferredLanguages = acceptLanguage?.split(',') || []
  const preferredLanguage = preferredLanguages[0]?.split('-')[0] || fallbackLng
  const language = languages.includes(preferredLanguage) ? preferredLanguage : fallbackLng

  redirect(`/${language}`)
} 