import { onBeforeUnmount, onMounted, ref } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useLenis() {
  const lenis = ref(null)

  onMounted(() => {
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh()
      return
    }

    lenis.value = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      gestureOrientation: 'vertical',
    })

    lenis.value.on('scroll', ScrollTrigger.update)

    if (typeof window !== 'undefined') window.__lenis = lenis.value

    const tick = (time) => lenis.value?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    onBeforeUnmount(() => {
      gsap.ticker.remove(tick)
      lenis.value?.destroy()
      lenis.value = null
      if (typeof window !== 'undefined') window.__lenis = null
    })
  })

  return { lenis }
}