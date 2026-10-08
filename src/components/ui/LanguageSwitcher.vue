<script setup>
import { useLocale } from '../../composables/useI18n'

const { locale, setLocale } = useLocale()
</script>

<template>
  <div
    class="flex items-center gap-1 text-[12px] font-medium uppercase tracking-[0.2em]"
    role="group"
    aria-label="Language"
  >
    <button
      type="button"
      class="px-1.5 py-1 transition-colors duration-300"
      :class="locale === 'en' ? 'text-gold' : 'text-smoke/50 hover:text-smoke'"
      :aria-pressed="locale === 'en'"
      @click="setLocale('en')"
    >
      EN
    </button>
    <span class="text-smoke/20">/</span>
    <button
      type="button"
      class="px-1.5 py-1 transition-colors duration-300"
      :class="locale === 'es' ? 'text-gold' : 'text-smoke/50 hover:text-smoke'"
      :aria-pressed="locale === 'es'"
      @click="setLocale('es')"
    >
      ES
    </button>
  </div>
</template>