<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '../ui/LanguageSwitcher.vue'
import BaseButton from '../ui/BaseButton.vue'
import { whatsappLink } from '../../data/site'

const { t } = useI18n()

const scrolled = ref(false)
const menuOpen = ref(false)
const menuVisible = ref(false)

const navItems = computed(() => [
  { id: 'services', label: t('header.nav.services') },
  { id: 'gallery', label: t('header.nav.gallery') },
  { id: 'process', label: t('header.nav.process') },
  { id: 'contact', label: t('header.nav.contact') },
])

const waLink = computed(() => whatsappLink(t('common.whatsappMessage')))

function onScroll() {
  scrolled.value = window.scrollY > 50
}

function goTo(id) {
  menuOpen.value = false
  lockScroll(false)
  const target = document.getElementById(id)
  if (!target) return
  requestAnimationFrame(() => {
    const lenis = window.__lenis
    if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.2 })
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? 'hidden' : ''
  const lenis = window.__lenis
  if (lenis) lock ? lenis.stop() : lenis.start()
}

watch(menuOpen, (open) => {
  lockScroll(open)
  if (open) {
    requestAnimationFrame(() => (menuVisible.value = true))
  } else {
    menuVisible.value = false
  }
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  lockScroll(false)
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinematic"
    :class="scrolled || menuOpen ? 'bg-ink/95 backdrop-blur-md shadow-[0_10px_30px_-20px_rgba(0,0,0,0.9)]' : 'bg-transparent'"
  >
    <div class="container-x flex h-[76px] items-center justify-between">
      <!-- Logo -->
      <button
        type="button"
        class="group flex items-center gap-3 text-left"
        :aria-label="'Mejia Serrato Stone Restoration'"
        @click="goTo('home')"
      >
        <img
          src="/logo.webp"
          alt="Mejia Serrato Stone Restoration logo"
          class="h-9 w-auto shrink-0 object-contain transition-transform duration-500 ease-cinematic group-hover:scale-105 sm:h-10"
          fetchpriority="high"
        />
        <span class="flex flex-col">
          <span class="block text-[15px] font-semibold uppercase leading-none tracking-[0.2em] text-smoke sm:text-base">
            Mejia Serrato
          </span>
          <span class="mt-1 block text-[10px] uppercase leading-none tracking-[0.42em] text-gold sm:text-[11px]">
            {{ t('header.tagline') }}
          </span>
        </span>
      </button>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-9 lg:flex" aria-label="Primary">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="nav-link text-[13px] font-medium uppercase tracking-[0.18em] text-smoke/80 transition-colors hover:text-smoke"
          @click="goTo(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>

      <!-- Right actions -->
      <div class="flex items-center gap-5">
        <LanguageSwitcher class="hidden sm:flex" />
        <BaseButton :href="waLink" size="sm" class="hidden sm:inline-flex">
          {{ t('common.freeQuote') }}
        </BaseButton>

        <!-- Hamburger -->
        <button
          type="button"
          class="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
          :aria-label="menuOpen ? t('common.close') : t('common.menu')"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span
            class="block h-[2px] w-6 bg-smoke transition-all duration-300"
            :class="menuOpen ? 'translate-y-[7px] rotate-45' : ''"
          />
          <span
            class="block h-[2px] w-6 bg-smoke transition-all duration-300"
            :class="menuOpen ? 'opacity-0' : ''"
          />
          <span
            class="block h-[2px] w-6 bg-smoke transition-all duration-300"
            :class="menuOpen ? '-translate-y-[7px] -rotate-45' : ''"
          />
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile full-screen menu -->
  <Transition name="menu">
    <div
      v-if="menuOpen"
      class="fixed inset-0 z-40 flex flex-col bg-ink lg:hidden"
      :class="{ 'menu-visible': menuVisible }"
      role="dialog"
      aria-modal="true"
    >
      <div class="noise" />
      <nav class="relative z-10 mt-[76px] flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Mobile">
        <button
          v-for="(item, i) in navItems"
          :key="item.id"
          type="button"
          class="menu-item py-3 text-left font-display text-4xl text-smoke transition-colors hover:text-gold"
          :style="{ transitionDelay: menuVisible ? `${0.08 + i * 0.07}s` : '0s' }"
          @click="goTo(item.id)"
        >
          <span class="mr-4 text-xs align-middle text-gold/60">0{{ i + 1 }}</span>{{ item.label }}
        </button>

        <div
          class="menu-item mt-10 flex flex-col gap-4"
          :style="{ transitionDelay: menuVisible ? '0.4s' : '0s' }"
        >
          <LanguageSwitcher />
          <BaseButton :href="waLink" size="md">
            <template #icon-left><i class="fa-brands fa-whatsapp" aria-hidden="true" /></template>
            {{ t('common.freeQuote') }}
          </BaseButton>
        </div>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.4s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-item {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.menu-visible .menu-item {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .menu-item {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>