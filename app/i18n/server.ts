import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'
import { getOptions } from './settings'
import { languages } from './settings'

const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => {
      if (!languages.includes(language)) {
        throw new Error(`Language ${language} is not supported`)
      }
      return import(`./locales/${language}/${namespace}.json`)
    }))
    .init({
      ...getOptions(lng, ns),
      lng, // Force the language
      fallbackLng: false, // Disable fallback
      react: {
        useSuspense: false
      }
    })
  return i18nInstance
}

export async function createTranslation(lng: string, ns: string) {
  const i18nInstance = await initI18next(lng, ns)
  return {
    t: i18nInstance.getFixedT(lng, ns),
    i18n: i18nInstance
  }
} 