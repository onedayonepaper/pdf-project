import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'
import { getOptions, languages, fallbackLng } from './settings'

let i18nInstance: any // singleton

export async function getI18n(lng: string) {
  if (!i18nInstance) {
    i18nInstance = createInstance()
      .use(initReactI18next)
      .use(
        resourcesToBackend((language: string, ns: string) => {
          if (!languages.includes(language)) throw new Error(`Unsupported ${language}`)
          return import(`./locales/${language}/${ns}.json`)
        })
      )
    await i18nInstance.init({
      ...getOptions(lng, 'common'), // 서버와 동일 언어로
      lng,
      fallbackLng,
      react: { useSuspense: false },
    })
  } else if (i18nInstance.language !== lng) {
    await i18nInstance.changeLanguage(lng) // URL-변경 대응
  }
  return i18nInstance
}

export function createUseTranslation(lng: string) {
  return function useTranslation() {
    const i18n = i18nInstance
    return {
      t: (key: string, opts?: any) => i18n?.t(key, opts) ?? '',
      i18n,
      ready: !!i18n?.isInitialized,
    }
  }
} 