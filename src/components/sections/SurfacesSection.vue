<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionEyebrow from '../ui/SectionEyebrow.vue'
import { prefersReducedMotion } from '../../composables/useLenis'

gsap.registerPlugin(ScrollTrigger)

const { t, tm, locale } = useI18n()

const tabs = ['floors', 'showers', 'countertops']
const images = {
  floors: '/works/floors/floor_1.webp',
  showers: '/works/showers/shower_1.webp',
  countertops: '/works/countertops/countertop_2.webp',
}
const notes = ['fa-gem', 'fa-tint', 'fa-border-all']

const activeTab = ref('floors')
const panelRef = ref(null)
const imageRef = ref(null)
const headRef = ref(null)
const sectionRef = ref(null)

const activeIndex = computed(() => tabs.indexOf(activeTab.value))
const bullets = computed(() => {
  void locale.value
  return tm(`surfaces.${activeTab.value}.bullets`)
})

function selectTab(tab) {
  if (tab === activeTab.value) return
  if (prefersReducedMotion()) {
    activeTab.value = tab
    return
  }
  gsap.to(panelRef.value, {
    opacity: 0,
    x: -40,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      activeTab.value = tab
      gsap.fromTo(
        panelRef.value,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
      )
    },
  })
}

onMounted(() => {
  if (prefersReducedMotion()) return

  gsap.from(headRef.value.querySelectorAll('.reveal'), {
    opacity: 0,
    y: 36,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: headRef.value, start: 'top 82%', once: true },
  })

  gsap.fromTo(
    panelRef.value,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: panelRef.value, start: 'top 82%', once: true },
    },
  )

  gsap.fromTo(
    imageRef.value,
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: panelRef.value, start: 'top 80%', once: true },
    },
  )
})

function selectAndAnimate(tab) {
  if (tab === activeTab.value) return
  if (prefersReducedMotion()) {
    activeTab.value = tab
    return
  }
  const el = panelRef.value
  gsap.to(el, {
    opacity: 0,
    x: -36,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      activeTab.value = tab
      gsap.fromTo(el, { opacity: 0, x: 36 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' })
    },
  })
}
</script>

<template>
  <section id="surfaces" ref="sectionRef" class="relative bg-smoke py-24 sm:py-32">
    <div class="container-x">
      <div ref="headRef" class="mx-auto max-w-2xl text-center">
        <SectionEyebrow :text="t('surfaces.eyebrow')" centered class="reveal" />
        <h2 class="reveal mt-5 font-display text-ink" style="font-size: clamp(38px, 6vw, 64px)">
          {{ t('surfaces.title') }}
        </h2>
      </div>

      <div class="mx-auto mt-12 max-w-3xl">
        <div class="relative grid grid-cols-3 border-b border-ink/10" role="tablist" :aria-label="t('surfaces.title')">
          <button
            v-for="tab in tabs"
            :key="tab"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab"
            class="pb-4 font-display text-lg transition-colors duration-300 sm:text-2xl md:text-[32px]"
            :class="activeTab === tab ? 'text-ink' : 'text-ink/40 hover:text-ink/70'"
            @click="selectAndAnimate(tab)"
          >
            {{ t(`surfaces.tabs.${tab}`) }}
          </button>
          <span
            class="absolute bottom-0 left-0 h-[2px] w-1/3 transition-transform duration-500 ease-cinematic"
            :style="{
              background: 'linear-gradient(90deg, #a68a37, #a67841)',
              transform: `translateX(${activeIndex * 100}%)`,
            }"
          />
        </div>
      </div>

      <div ref="panelRef" class="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-5">
        <div class="lg:col-span-3">
          <div class="overflow-hidden rounded-2xl">
            <img
              ref="imageRef"
              :src="images[activeTab]"
              :alt="t(`surfaces.${activeTab}.title`)"
              loading="lazy"
              class="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>

        <div class="lg:col-span-2">
          <h3 class="font-display text-3xl text-ink sm:text-4xl">{{ t(`surfaces.${activeTab}.title`) }}</h3>
          <p class="mt-4 text-base leading-relaxed text-ink/70">{{ t(`surfaces.${activeTab}.desc`) }}</p>

          <ul class="mt-7 space-y-3">
            <li v-for="(bullet, i) in bullets" :key="i" class="flex items-start gap-3 text-ink/80">
              <i :class="['fa-solid', notes[i] || 'fa-check']" class="mt-1 text-gold" aria-hidden="true" />
              <span class="text-sm">{{ bullet }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>