import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'
import { getOptions } from './settings'
import { languages, fallbackLng } from './settings'

// Create a singleton instance
let i18nInstance: any = null

export const initI18n = (lng = fallbackLng) => {
  if (!i18nInstance) {
    i18nInstance = createInstance()
    i18nInstance
      .use(initReactI18next)
      .use(resourcesToBackend((language: string, namespace: string) => {
        if (!languages.includes(language)) {
          throw new Error(`Language ${language} is not supported`)
        }
        return import(`./locales/${language}/${namespace}.json`)
      }))
      .init({
        ...getOptions(lng, 'common'),
        lng,
        fallbackLng,
        detection: {
          order: ['path', 'htmlTag', 'navigator', 'cookie'],
          caches: ['cookie'],
          lookupCookie: 'i18next',
          cookieOptions: { path: '/', sameSite: 'strict' }
        },
        react: {
          useSuspense: false,
          bindI18n: 'languageChanged loaded',
          bindI18nStore: 'added removed',
          transEmptyNodeValue: '',
          transSupportBasicHtmlNodes: true,
          transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
        },
        interpolation: {
          escapeValue: false
        },
        load: 'languageOnly',
        ns: ['common'],
        defaultNS: 'common',
        debug: process.env.NODE_ENV === 'development',
        initImmediate: true
      })
  }
  return i18nInstance
}

// Initialize i18n
initI18n()

export function useTranslation() {
  if (!i18nInstance) {
    initI18n()
  }

  return {
    t: (key: string, options?: any) => {
      if (!i18nInstance.isInitialized) {
        return key
      }
      const translation = i18nInstance.t(key, options)
      return translation || key
    },
    i18n: i18nInstance,
    ready: i18nInstance.isInitialized
  }
} 