<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionEyebrow from '../ui/SectionEyebrow.vue'
import BaseButton from '../ui/BaseButton.vue'
import BeforeAfterSlider from '../ui/BeforeAfterSlider.vue'
import { whatsappLink } from '../../data/site'
import { prefersReducedMotion } from '../../composables/useLenis'

gsap.registerPlugin(ScrollTrigger)

const { t, locale } = useI18n()

const tabs = ['floors', 'showers', 'countertops']

const pairs = {
  floors: { before: '/before_and_after/before_1.webp', after: '/before_and_after/after_1.webp' },
  showers: { before: '/before_and_after/before_2.webp', after: '/before_and_after/after_2.webp' },
  countertops: { before: '/before_and_after/before_3.webp', after: '/before_and_after/after_3.webp' },
}

const activeTab = ref('floors')
const hintVisible = ref(true)
const sliderRef = ref(null)
const stageRef = ref(null)
const sectionRef = ref(null)
const headRef = ref(null)

const activePair = computed(() => pairs[activeTab.value])
const activeIndex = computed(() => tabs.indexOf(activeTab.value))
const waLink = computed(() => whatsappLink(t('common.whatsappMessage')))

function selectTab(tab) {
  if (tab === activeTab.value) return
  if (prefersReducedMotion()) {
    activeTab.value = tab
    return
  }
  const el = stageRef.value
  gsap.to(el, {
    opacity: 0,
    x: -36,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      activeTab.value = tab
      gsap.fromTo(
        el,
        { opacity: 0, x: 36 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
      )
    },
  })
}

onMounted(() => {
  if (prefersReducedMotion()) return

  const headTl = gsap.timeline({
    scrollTrigger: { trigger: headRef.value, start: 'top 82%', once: true },
  })
  headTl
    .from(headRef.value.querySelectorAll('.reveal'), {
      opacity: 0,
      y: 36,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    })
    .from(
      headRef.value.querySelectorAll('.tabs-wrap'),
      { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' },
      '-=0.5',
    )

  gsap.from(stageRef.value, {
    opacity: 0,
    y: 60,
    scale: 0.95,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: stageRef.value, start: 'top 85%', once: true },
  })

  ScrollTrigger.create({
    trigger: stageRef.value,
    start: 'top 70%',
    once: true,
    onEnter: () => {
      window.setTimeout(() => sliderRef.value?.animateAuto(), 500)
    },
  })
})

void locale
</script>

<template>
  <section id="before-after" ref="sectionRef" class="relative overflow-hidden bg-ink py-24 sm:py-32">
    <div class="noise" />
    <div
      class="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full opacity-20 blur-3xl"
      style="background: radial-gradient(circle, #a68a37 0%, transparent 70%)"
    />

    <div class="container-x relative z-10">
      <div ref="headRef" class="mx-auto max-w-3xl text-center">
        <SectionEyebrow :text="t('beforeAfter.eyebrow')" centered class="reveal" />
        <h2 class="reveal mt-5 font-display text-smoke" style="font-size: clamp(38px, 6vw, 64px)">
          {{ t('beforeAfter.title') }}
        </h2>
        <p class="reveal mt-4 text-base text-smoke/60 sm:text-lg">
          {{ t('beforeAfter.subtitle') }}
        </p>

        <div class="tabs-wrap mx-auto mt-10 max-w-md">
          <div
            class="relative grid grid-cols-3 border-b border-smoke/15"
            role="tablist"
            :aria-label="t('beforeAfter.title')"
          >
            <button
              v-for="tab in tabs"
              :key="tab"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab"
              class="pb-3 text-[12px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 sm:text-[13px]"
              :class="activeTab === tab ? 'text-gold' : 'text-smoke/50 hover:text-smoke/80'"
              @click="selectTab(tab)"
            >
              {{ t(`beforeAfter.tabs.${tab}`) }}
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
      </div>

      <div ref="stageRef" class="mx-auto mt-12 max-w-4xl">
        <div class="relative aspect-[4/3] w-full sm:aspect-video">
          <BeforeAfterSlider
            ref="sliderRef"
            :before="activePair.before"
            :after="activePair.after"
            :alt-before="t('beforeAfter.captions.' + activeTab) + ' — ' + t('beforeAfter.before')"
            :alt-after="t('beforeAfter.captions.' + activeTab) + ' — ' + t('beforeAfter.after')"
            :aria-label="t('beforeAfter.title')"
            @interact="hintVisible = false"
          />
        </div>

        <p
          class="mt-5 flex items-center justify-center gap-3 text-center text-[12px] uppercase tracking-[0.25em] text-gold/80 transition-opacity duration-500"
          :class="hintVisible ? 'opacity-100' : 'opacity-0'"
          aria-hidden="true"
        >
          <i class="fa-solid fa-arrows-left-right" />
          {{ t('beforeAfter.drag') }}
          <i class="fa-solid fa-arrows-left-right" />
        </p>

        <p class="mt-3 text-center text-sm italic text-smoke/50">
          {{ t('beforeAfter.captions.' + activeTab) }}
        </p>

        <div class="mt-9 flex justify-center">
          <BaseButton :href="waLink">
            <template #icon-left><i class="fa-brands fa-whatsapp" aria-hidden="true" /></template>
            {{ t('beforeAfter.cta') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>