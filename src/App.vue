<script setup>
import { onMounted } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from './composables/useLenis'

import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import WhatsAppFloat from './components/ui/WhatsAppFloat.vue'

import HeroSection from './components/sections/HeroSection.vue'
import BeforeAfterSection from './components/sections/BeforeAfterSection.vue'
import ServicesSection from './components/sections/ServicesSection.vue'
import GallerySection from './components/sections/GallerySection.vue'
import SurfacesSection from './components/sections/SurfacesSection.vue'
import ProcessSection from './components/sections/ProcessSection.vue'
import ServiceAreaSection from './components/sections/ServiceAreaSection.vue'
import FinalCtaSection from './components/sections/FinalCtaSection.vue'

useLenis()

onMounted(() => {
  window.addEventListener('load', () => ScrollTrigger.refresh())
  setTimeout(() => ScrollTrigger.refresh(), 600)
})
</script>

<template>
  <AppHeader />

  <main>
    <HeroSection />
    <BeforeAfterSection />
    <ServicesSection />
    <GallerySection />
    <SurfacesSection />
    <ProcessSection />
    <ServiceAreaSection />
    <FinalCtaSection />
  </main>

  <AppFooter />
  <WhatsAppFloat />
</template>