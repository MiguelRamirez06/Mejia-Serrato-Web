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

const speeds = [5, 2, 3, 6, 3]

const section = ref(null)
const lightboxImg = ref(null)
const openIndex = ref(-1)
const isOpen = computed(() => openIndex.value >= 0)

const items = computed(() => {
  void locale.value
  return tm('gallery.items')
})

const pad = (n) => String(n).padStart(2, '0')
const sizeClass = (size) => `size-${size || 'normal'}`

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
  if (prefersReducedMotion() || !imgEl) {
    openIndex.value = -1
    lockScroll(false)
    return
  }
  gsap.to(imgEl, {
    opacity: 0,
    scale: 0.94,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      openIndex.value = -1
      lockScroll(false)
    },
  })
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

  // Subtle inner parallax on desktop only — animates a wrapper so it never
  // clashes with the CSS hover/scale transform on the <img>.
  if (window.innerWidth < 1024) return
  section.value?.querySelectorAll('.js-parallax').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0')
    if (!speed) return
    gsap.fromTo(
      el,
      { yPercent: -speed },
      {
        yPercent: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.gallery-tile'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  lockScroll(false)
})
</script>

<template>
  <section id="gallery" ref="section" class="relative bg-ink py-24 sm:py-32">
    <div class="container-x">
      <div class="mx-auto max-w-2xl text-center">
        <SectionEyebrow :text="t('gallery.eyebrow')" centered class="gallery-head" />
        <h2 class="gallery-head mt-5 font-display text-smoke" style="font-size: clamp(38px, 6vw, 64px)">
          {{ t('gallery.title') }}
        </h2>
        <p class="gallery-head mt-4 text-base text-smoke/60">{{ t('gallery.subtitle') }}</p>
      </div>
    </div>

    <!-- Editorial mosaic -->
    <div class="mt-12 px-4 sm:mt-16 sm:px-6 lg:px-8">
      <div class="gallery-mosaic mx-auto max-w-[1600px]">
        <button
          v-for="(item, i) in items"
          :key="i"
          type="button"
          class="gallery-tile group relative w-full overflow-hidden rounded-2xl border border-smoke/10 bg-ink text-left outline-none transition-[box-shadow,transform] duration-500 ease-cinematic hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          :class="sizeClass(item.size)"
          :aria-label="`${item.title} — ${item.location}`"
          @click="open(i, $event)"
        >
          <div class="js-parallax absolute inset-0 will-change-transform" :data-speed="speeds[i % speeds.length]">
            <img
              :src="images[i]"
              :alt="item.title"
              loading="lazy"
              decoding="async"
              class="h-full w-full scale-[1.15] object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.25]"
            />
          </div>

          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-95"
          />

          <div class="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div class="flex items-center gap-3 text-gold">
              <span class="text-[11px] font-medium tracking-[0.3em]">{{ pad(i + 1) }}</span>
              <span class="h-px flex-1 bg-gold/30" />
            </div>
            <h3 class="mt-2 font-display text-xl leading-tight text-smoke sm:text-2xl lg:text-[28px]">
              {{ item.title }}
            </h3>
            <p class="mt-1 text-[11px] uppercase tracking-[0.22em] text-smoke/60">
              {{ item.location }}<span v-if="item.service" class="text-gold/80"> · {{ item.service }}</span>
            </p>
            <span
              class="mt-3 block h-[3px] w-10 rounded-full bg-gold-gradient transition-all duration-500 ease-cinematic group-hover:w-20"
            />
          </div>

          <i
            class="fa-solid fa-expand absolute right-4 top-4 text-sm text-smoke/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
        </button>
      </div>
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
              <span class="ml-3 text-[11px] uppercase tracking-[0.25em] text-smoke/60">
                {{ items[openIndex]?.location }}
              </span>
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
/* Mobile & tablet: balanced 2-column masonry with a full-width feature tile.
   CSS multi-column avoids the empty gaps a 2-col grid would leave and keeps
   varied image heights, so it reads as a real mosaic instead of a single stack. */
.gallery-mosaic {
  column-count: 2;
  column-gap: 0.75rem;
}

.gallery-mosaic > .gallery-tile {
  display: block;
  width: 100%;
  margin-bottom: 0.75rem;
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
}

.size-large {
  column-span: all;
  aspect-ratio: 16 / 10;
}
.size-normal {
  aspect-ratio: 3 / 4;
}
.size-half {
  aspect-ratio: 1 / 1;
}
.size-wide {
  aspect-ratio: 4 / 5;
}

@media (min-width: 640px) {
  .gallery-mosaic {
    column-gap: 1rem;
  }
  .gallery-mosaic > .gallery-tile {
    margin-bottom: 1rem;
  }
}

/* Desktop: 12-column editorial grid with variable row spans */
@media (min-width: 1024px) {
  .gallery-mosaic {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: 80px;
    gap: 1.25rem;
    column-count: auto;
  }
  .gallery-mosaic > .gallery-tile {
    margin-bottom: 0;
    aspect-ratio: auto;
  }
  .size-large {
    grid-column: span 7;
    grid-row: span 6;
  }
  .size-normal {
    grid-column: span 5;
    grid-row: span 3;
  }
  .size-half {
    grid-column: span 5;
    grid-row: span 4;
  }
  .size-wide {
    grid-column: span 7;
    grid-row: span 4;
  }
}

.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.35s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}
</style>