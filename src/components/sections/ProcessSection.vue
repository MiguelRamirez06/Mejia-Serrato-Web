<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionEyebrow from '../ui/SectionEyebrow.vue'
import { prefersReducedMotion } from '../../composables/useLenis'

gsap.registerPlugin(ScrollTrigger)

const { t, tm, locale } = useI18n()

const icons = [
  'fa-clipboard-check',
  'fa-tools',
  'fa-spray-can-sparkles',
  'fa-gem',
  'fa-shield-halved',
  'fa-magnifying-glass',
]

const section = ref(null)
const list = ref(null)
const fillH = ref(null)
const fillV = ref(null)

const steps = computed(() => {
  void locale.value
  return tm('process.steps')
})

onMounted(() => {
  if (prefersReducedMotion()) return

  const st = { trigger: section.value, start: 'top 65%', end: 'bottom 75%', scrub: true }
  gsap.fromTo(fillH.value, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: st })
  gsap.fromTo(fillV.value, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { ...st } })

  const nodes = list.value.querySelectorAll('.p-node')
  nodes.forEach((node) => {
    gsap.from(node, {
      scale: 0,
      duration: 0.7,
      ease: 'back.out(2.2)',
      scrollTrigger: { trigger: node, start: 'top 88%', once: true },
    })
  })

  gsap.from(list.value.querySelectorAll('.p-text'), {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: list.value, start: 'top 80%', once: true },
  })
})
</script>

<template>
  <section id="process" ref="section" class="relative overflow-hidden bg-ink py-24 sm:py-32">
    <div class="noise" />
    <div class="container-x relative z-10">
      <div class="mx-auto max-w-2xl text-center">
        <SectionEyebrow :text="t('process.eyebrow')" centered />
        <h2 class="mt-5 font-display text-smoke" style="font-size: clamp(38px, 6vw, 64px)">
          {{ t('process.title') }}
        </h2>
        <p class="mt-4 text-base text-smoke/60 sm:text-lg">{{ t('process.subtitle') }}</p>
      </div>

      <div class="relative mt-16">
        <!-- Horizontal track (desktop) -->
        <div class="absolute left-0 right-0 top-[22px] hidden h-[2px] bg-smoke/15 lg:block">
          <div
            ref="fillH"
            class="h-full w-full origin-left"
            style="background: linear-gradient(90deg, #a68a37, #a67841)"
          />
        </div>
        <!-- Vertical track (mobile) -->
        <div class="absolute bottom-0 left-[22px] top-0 w-[2px] bg-smoke/15 lg:hidden">
          <div
            ref="fillV"
            class="h-full w-full origin-top"
            style="background: linear-gradient(180deg, #a68a37, #a67841)"
          />
        </div>

        <ol ref="list" class="grid gap-12 lg:grid-cols-6 lg:gap-4">
          <li
            v-for="(step, i) in steps"
            :key="i"
            class="relative flex items-start gap-5 lg:block lg:text-center"
          >
            <div
              class="p-node relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-ink text-gold shadow-[0_0_24px_-6px_rgba(166,138,55,0.9)] lg:mx-auto"
            >
              <i :class="['fa-solid', icons[i]]" aria-hidden="true" />
            </div>

            <div class="p-text pt-1 lg:pt-6">
              <span class="text-[11px] font-medium uppercase tracking-[0.3em] text-gold/70">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <h3 class="mt-2 font-display text-xl text-smoke">{{ step.title }}</h3>
              <p class="mt-1.5 text-sm leading-relaxed text-smoke/55">{{ step.desc }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>