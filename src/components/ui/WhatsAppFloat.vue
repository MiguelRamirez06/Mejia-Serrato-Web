<script setup>
import { useI18n } from 'vue-i18n'
import { contact, whatsappLink } from '../../data/site'

const { t } = useI18n()
</script>

<template>
  <a
    :href="whatsappLink(t('common.whatsappMessage'))"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="t('finalCta.quote') + ' — WhatsApp'"
    class="group fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.9)] transition-transform duration-500 ease-cinematic hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:bottom-8 sm:left-8"
  >
    <span
      class="pointer-events-none absolute inset-0 rounded-full"
      style="animation: pulse-halo 2.4s ease-in-out infinite"
    />
    <i class="fa-brands fa-whatsapp text-2xl" aria-hidden="true" />
    <span class="sr-only">{{ contact.phoneDisplay }}</span>
  </a>
</template>