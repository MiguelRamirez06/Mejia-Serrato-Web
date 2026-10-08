<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionEyebrow from '../ui/SectionEyebrow.vue'
import { prefersReducedMotion } from '../../composables/useLenis'

gsap.registerPlugin(ScrollTrigger)

const { t, tm, locale } = useI18n()

const images = [
  '/works/work_1.webp',
  '/works/work_2.webp',
  '/works/work_3.webp',
  '/works/work_4.webp',
  '/works/work_5.webp',
]

const track = ref(null)
const lightboxImg = ref(null)
const carouselIndex = ref(0)
const openIndex = ref(-1)
const isOpen = computed(() => openIndex.value >= 0)

const items = computed(() => {
  void locale.value
  return tm('gallery.items')
})

const atStart = computed(() => carouselIndex.value <= 0)
const atEnd = computed(() => carouselIndex.value >= items.value.length - 1)

function perView() {
  if (typeof window === 'undefined') return 1
  if (window.innerWidth >= 1024) return 3
  if (window.innerWidth >= 640) return 2
  return 1
}

function stepSize() {
  const el = track.value
  if (!el) return 0
  return el.clientWidth / perView()
}

function onScroll() {
  const el = track.value
  if (!el) return
  const step = stepSize()
  if (!step) return
  carouselIndex.value = Math.round(el.scrollLeft / step)
}

function goTo(i) {
  const el = track.value
  if (!el) return
  const clamped = Math.max(0, Math.min(i, items.value.length - 1))
  el.scrollTo({
    left: clamped * stepSize(),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

function nextSlide() {
  goTo(carouselIndex.value + 1)
}
function prevSlide() {
  goTo(carouselIndex.value - 1)
}

/* ---------- Lightbox ---------- */
function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

function open(i, event) {
  const thumb = event.currentTarget.querySelector('img')
  const startRect = thumb?.getBoundingClientRect()
  openIndex.value = i
  lockScroll(true)

  nextTick(() => {
    const imgEl = lightboxImg.value
    if (!imgEl) return
    if (prefersReducedMotion() || !startRect) {
      gsap.fromTo(imgEl, { opacity: 0 }, { opacity: 1, duration: 0.35 })
      return
    }
    const endRect = imgEl.getBoundingClientRect()
    const scale = Math.max(startRect.width / endRect.width, startRect.height / endRect.height)
    const dx = startRect.left + startRect.width / 2 - (endRect.left + endRect.width / 2)
    const dy = startRect.top + startRect.height / 2 - (endRect.top + endRect.height / 2)
    gsap.fromTo(
      imgEl,
      { x: dx, y: dy, scale, opacity: 0.5 },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
    )
  })
}

function close() {
  const imgEl = lightboxImg.value
  const finish = () => {
    openIndex.value = -1
    lockScroll(false)
  }
  if (!imgEl || prefersReducedMotion()) {
    finish()
    return
  }
  gsap.to(imgEl, { opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.in', onComplete: finish })
}

function step(dir) {
  openIndex.value = (openIndex.value + dir + images.length) % images.length
}

watch(
  openIndex,
  (val, old) => {
    if (val >= 0 && old >= 0 && lightboxImg.value && !prefersReducedMotion()) {
      gsap.fromTo(
        lightboxImg.value,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
      )
    }
  },
  { flush: 'post' },
)

function onKeydown(e) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  if (prefersReducedMotion()) return

  gsap.from('.gallery-head', {
    opacity: 0,
    y: 36,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#gallery', start: 'top 78%', once: true },
  })

  gsap.from('.gallery-slide', {
    opacity: 0,
    y: 50,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: track.value, start: 'top 85%', once: true },
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  lockScroll(false)
})
</script>

<template>
  <section id="gallery" class="relative bg-beige py-24 sm:py-32">
    <div class="container-x">
      <div class="mx-auto max-w-2xl text-center">
        <SectionEyebrow :text="t('gallery.eyebrow')" centered class="gallery-head" />
        <h2 class="gallery-head mt-5 font-display text-ink" style="font-size: clamp(38px, 6vw, 64px)">
          {{ t('gallery.title') }}
        </h2>
        <p class="gallery-head mt-4 text-base text-ink/60">{{ t('gallery.subtitle') }}</p>
      </div>

      <!-- Controls -->
      <div class="mt-12 flex items-center justify-end gap-3">
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-300 hover:border-gold hover:bg-gold hover:text-smoke disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink/20 disabled:hover:bg-transparent disabled:hover:text-ink"
          :disabled="atStart"
          :aria-label="t('gallery.lightbox.prev')"
          @click="prevSlide"
        >
          <i class="fa-solid fa-arrow-left" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-300 hover:border-gold hover:bg-gold hover:text-smoke disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink/20 disabled:hover:bg-transparent disabled:hover:text-ink"
          :disabled="atEnd"
          :aria-label="t('gallery.lightbox.next')"
          @click="nextSlide"
        >
          <i class="fa-solid fa-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Carousel -->
    <div class="container-x">
      <div
        ref="track"
        class="no-scrollbar mt-6 flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        @scroll.passive="onScroll"
      >
        <div
          v-for="(item, i) in items"
          :key="i"
          class="gallery-slide w-full shrink-0 snap-start px-3 sm:w-1/2 lg:w-1/3"
        >
          <button
            type="button"
            class="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink/5 text-left will-change-transform"
            :aria-label="item.title"
            @click="open(i, $event)"
          >
            <img
              :src="images[i]"
              :alt="item.title"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />
            <div
              class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/20 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
              <span class="font-display text-xl text-gold">{{ item.title }}</span>
              <span class="text-[11px] uppercase tracking-[0.25em] text-smoke/70">{{ item.caption }}</span>
            </div>
            <i
              class="fa-solid fa-expand absolute right-4 top-4 text-sm text-smoke opacity-0 transition-opacity duration-500 group-hover:opacity-90"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Dots -->
    <div class="mt-8 flex justify-center gap-2.5">
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        class="h-2 rounded-full transition-all duration-400 ease-cinematic"
        :class="carouselIndex === i ? 'w-7 bg-gold' : 'w-2 bg-ink/25 hover:bg-ink/50'"
        :aria-label="item.title"
        :aria-current="carouselIndex === i"
        @click="goTo(i)"
      />
    </div>

    <Teleport to="body">
      <Transition name="lb">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          :aria-label="items[openIndex]?.title"
          @click.self="close"
        >
          <button
            type="button"
            class="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-smoke/20 text-smoke transition-colors hover:border-gold hover:text-gold"
            :aria-label="t('gallery.lightbox.close')"
            @click="close"
          >
            <i class="fa-solid fa-xmark text-lg" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-smoke/20 text-smoke transition-colors hover:border-gold hover:text-gold sm:left-8"
            :aria-label="t('gallery.lightbox.prev')"
            @click.stop="step(-1)"
          >
            <i class="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>

          <figure class="relative max-h-[85vh] w-[92vw] max-w-5xl" @click.stop>
            <img
              ref="lightboxImg"
              :src="images[openIndex]"
              :alt="items[openIndex]?.title"
              class="mx-auto max-h-[78vh] w-auto rounded-lg object-contain shadow-card"
            />
            <figcaption class="mt-4 text-center">
              <span class="font-display text-xl text-gold">{{ items[openIndex]?.title }}</span>
              <span class="ml-3 text-[11px] uppercase tracking-[0.25em] text-smoke/60">{{ items[openIndex]?.caption }}</span>
            </figcaption>
          </figure>

          <button
            type="button"
            class="absolute right-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-smoke/20 text-smoke transition-colors hover:border-gold hover:text-gold"
            :aria-label="t('gallery.lightbox.next')"
            @click.stop="step(1)"
          >
            <i class="fa-solid fa-chevron-right text-lg" aria-hidden="true" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.35s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}
</style>