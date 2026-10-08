import { onBeforeUnmount, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './useLenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reveal a group of elements with a staggered fade-up on scroll.
 *
 * @param {import('vue').Ref<HTMLElement|null>} targetRef container ref
 * @param {object} [options]
 * @param {string} [options.selector] child selector; defaults to the container itself
 * @param {number} [options.y=40] translateY offset in px
 * @param {number} [options.scale=1] initial scale
 * @param {number} [options.duration=1] seconds
 * @param {number} [options.stagger=0.12] seconds between elements
 * @param {number} [options.delay=0] seconds
 * @param {string} [options.start='top 85%'] ScrollTrigger start
 * @param {boolean} [options.once=true] play only once
 */
export function useScrollReveal(targetRef, options = {}) {
  const {
    selector = null,
    y = 40,
    scale = 1,
    duration = 1,
    stagger = 0.12,
    delay = 0,
    start = 'top 85%',
    once = true,
  } = options

  let ctx

  onMounted(() => {
    const el = targetRef?.value
    if (!el) return

    const els = selector ? el.querySelectorAll(selector) : [el]

    if (prefersReducedMotion()) {
      gsap.set(els, { opacity: 1, y: 0, scale: 1 })
      return
    }

    ctx = gsap.context(() => {
      gsap.from(els, {
        opacity: 0,
        y,
        scale,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start, once },
      })
    }, el)
  })

  onBeforeUnmount(() => ctx?.revert())
}