<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseButton from '../ui/BaseButton.vue'
import { contact, whatsappLink } from '../../data/site'
import { prefersReducedMotion } from '../../composables/useLenis'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const section = ref(null)
const waLink = computed(() => whatsappLink(t('common.whatsappMessage')))

onMounted(() => {
  if (prefersReducedMotion()) return
  gsap.from(section.value.querySelectorAll('.cta-reveal'), {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.14,
    ease: 'power3.out',
    scrollTrigger: { trigger: section.value, start: 'top 72%', once: true },
  })
})
</script>

<template>
  <section id="contact" ref="section" class="relative overflow-hidden bg-ink py-28 sm:py-36">
    <img
      src="/works/work_2.webp"
      alt=""
      aria-hidden="true"
      loading="lazy"
      class="absolute inset-0 h-full w-full object-cover opacity-30"
    />
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, rgba(13,13,13,0.78) 0%, rgba(13,13,13,0.92) 100%)"
    />
    <div class="noise" />

    <div class="container-x relative z-10 text-center">
      <h2
        class="cta-reveal mx-auto max-w-4xl font-display text-smoke"
        style="font-size: clamp(36px, 6vw, 68px)"
      >
        {{ t('finalCta.title') }}
      </h2>
      <p class="cta-reveal mx-auto mt-6 max-w-xl text-base text-smoke/65 sm:text-lg">
        {{ t('finalCta.subtitle') }}
      </p>

      <div class="cta-reveal mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <BaseButton
          :href="waLink"
          size="lg"
          class="animate-[soft-pulse_2.4s_ease-in-out_infinite]"
        >
          <template #icon-left><i class="fa-brands fa-whatsapp text-lg" aria-hidden="true" /></template>
          {{ t('finalCta.quote') }}
        </BaseButton>

        <BaseButton :href="contact.phoneHref" variant="secondary" size="lg" :aria-label="t('finalCta.call')">
          <template #icon-left><i class="fa-solid fa-phone" aria-hidden="true" /></template>
          {{ t('finalCta.call') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>