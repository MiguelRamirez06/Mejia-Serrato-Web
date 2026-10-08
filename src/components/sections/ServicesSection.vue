<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionEyebrow from '../ui/SectionEyebrow.vue'

const { t, tm, locale } = useI18n()
const scroller = ref(null)
const carouselIndex = ref(0)

const icons = [
  'fa-gem',
  'fa-shield-halved',
  'fa-spray-can-sparkles',
  'fa-tint',
  'fa-layer-group',
  'fa-border-all',
]

const images = [
  '/works/work_3.webp',
  '/works/work_5.webp',
  '/works/work_2.webp',
  '/before_and_after/after_3.webp',
  '/before_and_after/after_4.webp',
  '/works/work_4.webp',
]

const items = computed(() => {
  void locale.value
  return tm('services.items')
})

const atStart = computed(() => carouselIndex.value <= 0)
const atEnd = computed(() => carouselIndex.value >= items.value.length - 1)

function stepSize() {
  const el = scroller.value
  if (!el) return 0
  const first = el.querySelector('.service-card')
  if (!first) return 0
  const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || '0') || 0
  return first.getBoundingClientRect().width + gap
}

function onScroll() {
  const el = scroller.value
  if (!el) return
  const step = stepSize()
  if (!step) return
  carouselIndex.value = Math.round(el.scrollLeft / step)
}

function goTo(i) {
  const el = scroller.value
  if (!el) return
  const clamped = Math.max(0, Math.min(i, items.value.length - 1))
  el.scrollTo({ left: clamped * stepSize(), behavior: 'smooth' })
}
function nextSlide() {
  goTo(carouselIndex.value + 1)
}
function prevSlide() {
  goTo(carouselIndex.value - 1)
}
</script>

<template>
  <section id="services" class="relative bg-smoke py-24 sm:py-32">
    <div class="container-x">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div class="max-w-2xl">
          <SectionEyebrow :text="t('services.eyebrow')" />
          <h2 class="mt-5 font-display text-ink" style="font-size: clamp(38px, 6vw, 64px)">
            {{ t('services.title') }}
          </h2>
        </div>

        <!-- Mobile carousel controls -->
        <div class="flex items-center gap-3 lg:hidden">
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

      <!-- Carousel (mobile) / Grid (desktop) -->
      <div
        ref="scroller"
        class="no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible"
        @scroll.passive="onScroll"
      >
        <article
          v-for="(item, i) in items"
          :key="i"
          class="service-card group relative flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all duration-500 ease-cinematic hover:-translate-y-2 hover:shadow-card will-change-transform sm:w-[46%] lg:w-auto"
        >
          <div class="relative aspect-[4/3] w-full overflow-hidden bg-beige/40">
            <img
              :src="images[i]"
              alt=""
              aria-hidden="true"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />
          </div>

          <div class="flex flex-1 flex-col p-6">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-smoke shadow-[0_10px_24px_-10px_rgba(166,138,55,0.9)] transition-transform duration-500 ease-cinematic group-hover:rotate-6 group-hover:scale-110"
            >
              <i :class="['fa-solid', icons[i] || icons[0]]" class="text-lg" aria-hidden="true" />
            </span>

            <h3 class="mt-5 font-display text-2xl text-ink">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/60">{{ item.desc }}</p>

            <div class="mt-auto pt-6">
              <span
                class="block h-[3px] w-10 rounded-full bg-gold-gradient transition-all duration-500 ease-cinematic group-hover:w-16"
              />
            </div>
          </div>
        </article>
      </div>

      <!-- Mobile dots -->
      <div class="mt-8 flex justify-center gap-2.5 lg:hidden">
        <button
          v-for="(item, i) in items"
          :key="i"
          type="button"
          class="h-2 rounded-full transition-all duration-300 ease-cinematic"
          :class="carouselIndex === i ? 'w-7 bg-gold' : 'w-2 bg-ink/25 hover:bg-ink/50'"
          :aria-label="item.title"
          :aria-current="carouselIndex === i"
          @click="goTo(i)"
        />
      </div>
    </div>
  </section>
</template>