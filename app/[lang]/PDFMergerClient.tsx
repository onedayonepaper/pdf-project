'use client'
import { useEffect, useState } from 'react'
import { getI18n, createUseTranslation } from '@/app/i18n/client'

export default function PDFMergerClient({ lang }: { lang: string }) {
  const [ready, setReady] = useState(false)
  const [tHook, setTHook] = useState<() => any>(() => () => ({ t: () => '' }))

  useEffect(() => {
    getI18n(lang).then(i18n => {
      setTHook(() => createUseTranslation(lang))
      setReady(true)
    })
  }, [lang])

  if (!ready) return null
  const { t } = tHook()

  return (
    <>
      <h1 className="text-2xl font-bold mb-8 text-center" suppressHydrationWarning>
        {t('title')}
      </h1>
      {/* 이하 컴포넌트 내용 */}
    </>
  )
} 