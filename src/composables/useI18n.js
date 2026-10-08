import { computed } from 'vue'
import { useI18n as useVueI18n } from 'vue-i18n'
import { persistLocale } from '../i18n'

export function useLocale() {
  const { locale, t } = useVueI18n()

  function setLocale(next) {
    if (next === locale.value) return
    const root = typeof document !== 'undefined' ? document.documentElement : null
    root?.classList.add('locale-changing')
    gsapFade(() => {
      locale.value = next
      persistLocale(next)
    })
    window.setTimeout(() => document.documentElement.classList.remove('locale-changing'), 320)
  }

  function toggle() {
    setLocale(locale.value === 'en' ? 'es' : 'en')
  }

  return {
    locale,
    setLocale,
    toggle,
    t,
  }
}

function gsapFade(fn) {
  window.requestAnimationFrame(fn)
}