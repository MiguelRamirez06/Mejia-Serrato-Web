<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { contact, whatsappLink } from '../../data/site'

const { t, tm, locale } = useI18n()
const year = new Date().getFullYear()

const waLink = computed(() => whatsappLink(t('common.whatsappMessage')))
const cities = computed(() => {
  void locale.value
  return tm('serviceArea.cities')
})

const links = computed(() => [
  { id: 'services', label: t('header.nav.services') },
  { id: 'gallery', label: t('header.nav.gallery') },
  { id: 'process', label: t('header.nav.process') },
  { id: 'contact', label: t('header.nav.contact') },
])

function goTo(id) {
  const target = document.getElementById(id)
  if (!target) return
  const lenis = window.__lenis
  if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.2 })
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <footer class="relative overflow-hidden bg-ink pt-20 text-smoke">
    <div class="noise" />
    <div class="container-x relative z-10">
      <!-- Logo lockup -->
      <div class="flex flex-col items-center pb-14 text-center">
        <span class="text-xl font-semibold uppercase tracking-[0.28em] text-smoke sm:text-2xl">
          Mejia Serrato
        </span>
        <span class="mt-2 text-[11px] uppercase tracking-[0.5em] text-gold">
          {{ t('footer.tagline') }}
        </span>
        <p class="mt-5 max-w-md text-sm text-smoke/50">{{ t('footer.blurb') }}</p>
      </div>

      <div class="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div class="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Contact -->
        <div>
          <h3 class="text-[11px] uppercase tracking-[0.3em] text-gold">{{ t('footer.contactTitle') }}</h3>
          <ul class="mt-5 space-y-3 text-sm text-smoke/70">
            <li>
              <a :href="contact.phoneHref" class="inline-flex items-center gap-3 transition-colors hover:text-gold">
                <i class="fa-solid fa-phone text-gold/80" aria-hidden="true" />
                {{ contact.phoneDisplay }}
              </a>
            </li>
            <li>
              <a
                :href="waLink"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-3 transition-colors hover:text-gold"
              >
                <i class="fa-brands fa-whatsapp text-gold/80" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                :href="`mailto:${contact.email}`"
                class="inline-flex items-center gap-3 transition-colors hover:text-gold"
              >
                <i class="fa-solid fa-envelope text-gold/80" aria-hidden="true" />
                {{ contact.email }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Service area -->
        <div>
          <h3 class="text-[11px] uppercase tracking-[0.3em] text-gold">{{ t('footer.areasTitle') }}</h3>
          <ul class="mt-5 space-y-2 text-sm text-smoke/70">
            <li v-for="city in cities" :key="city" class="flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-[10px] text-gold/70" aria-hidden="true" />
              {{ city }}
            </li>
          </ul>
        </div>

        <!-- Quick links -->
        <div>
          <h3 class="text-[11px] uppercase tracking-[0.3em] text-gold">{{ t('footer.linksTitle') }}</h3>
          <ul class="mt-5 space-y-3 text-sm text-smoke/70">
            <li v-for="link in links" :key="link.id">
              <button type="button" class="transition-colors hover:text-gold" @click="goTo(link.id)">
                {{ link.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <p class="py-7 text-center text-[11px] uppercase tracking-[0.2em] text-smoke/40">
        © {{ year }} Mejia Serrato Stone Restoration. {{ t('footer.rights') }}
      </p>
    </div>
  </footer>
</template>