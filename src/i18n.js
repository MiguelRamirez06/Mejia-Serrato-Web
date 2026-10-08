import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'

const STORAGE_KEY = 'mss-locale'

function detectLocale() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  if (stored === 'en' || stored === 'es') return stored
  const nav = typeof navigator !== 'undefined' ? navigator.language?.toLowerCase() ?? '' : ''
  return nav.startsWith('es') ? 'es' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, es },
})

export function persistLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', locale)
  }
}

persistLocale(i18n.global.locale.value)