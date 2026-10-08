<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseButton from '../ui/BaseButton.vue'
import { whatsappLink } from '../../data/site'
import { prefersReducedMotion } from '../../composables/useLenis'

gsap.registerPlugin(ScrollTrigger)

const { t, tm, locale } = useI18n()

const section = ref(null)
const bg = ref(null)
const content = ref(null)

const reduce = prefersReducedMotion()

const words = computed(() => {
  void locale.value
  return tm('hero.titleWords')
})
const waLink = computed(() => whatsappLink(t('common.whatsappMessage')))

onMounted(() => {
  if (!reduce) {
    const els = content.value.querySelectorAll('.hero-word')
    gsap.set(els, { opacity: 0, yPercent: 60, filter: 'blur(14px)' })
    gsap.set(['.hero-sub', '.hero-cta', '.hero-scroll'], { opacity: 0, y: 20 })

    const tl = gsap.timeline({ delay: 0.3 })
    tl.to(els, {
      opacity: 1,
      yPercent: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
    })
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.4')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .to('.hero-scroll', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')

    gsap.to(bg.value, {
      scale: 1.12,
      ease: 'none',
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    gsap.to(content.value, {
      opacity: 0,
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: '70% top',
        scrub: true,
      },
    })
  }
})
</script>

<template>
  <section
    id="home"
    ref="section"
    class="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-ink"
  >
    <div ref="bg" class="absolute inset-0 will-change-transform">
      <video
        class="h-full w-full object-cover"
        poster="/works/work_3.webp"
        :autoplay="!reduce"
        :loop="!reduce"
        muted
        playsinline
        preload="auto"
        disablepictureinpicture
        aria-hidden="true"
      >
        <source src="/hero-1080.mp4" media="(min-width: 768px)" type="video/mp4" />
        <source src="/hero-720.mp4" type="video/mp4" />
      </video>
    </div>

    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.5) 40%, rgba(13,13,13,0.85) 100%)"
    />
    <div class="noise" />

    <div ref="content" class="container-x relative z-10 flex flex-col items-center text-center">
      <p class="eyebrow mb-6 text-gold">{{ t('hero.eyebrow') }}</p>

      <h1
        class="flex max-w-5xl flex-wrap items-center justify-center gap-x-[0.28em] gap-y-2 font-display text-smoke"
        style="font-size: clamp(48px, 8vw, 96px); line-height: 1.02"
      >
        <span
          v-for="(word, i) in words"
          :key="i"
          class="hero-word inline-block will-change-transform"
          >{{ word }}</span
        >
      </h1>

      <p class="hero-sub mt-7 max-w-xl text-base text-[#B8B8B8] sm:text-lg">
        {{ t('hero.subtitle') }}
      </p>

      <div class="hero-cta mt-9">
        <BaseButton :href="waLink" size="lg" :aria-label="t('hero.cta')">
          <template #icon-left><i class="fa-brands fa-whatsapp" aria-hidden="true" /></template>
          {{ t('hero.cta') }}
        </BaseButton>
      </div>
    </div>

    <div
      class="hero-scroll absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-gold/70"
    >
      <span class="text-[10px] uppercase tracking-[0.3em]">{{ t('hero.scroll') }}</span>
      <i class="fa-solid fa-arrow-down animate-[bounce-arrow_1.8s_ease-in-out_infinite]" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
@keyframes bounce-arrow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}
</style>