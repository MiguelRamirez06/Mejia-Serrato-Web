<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { prefersReducedMotion } from '../../composables/useLenis'

const props = defineProps({
  before: { type: String, required: true },
  after: { type: String, required: true },
  altBefore: { type: String, default: 'Before restoration' },
  altAfter: { type: String, default: 'After restoration' },
  labelBefore: { type: String, default: 'BEFORE' },
  labelAfter: { type: String, default: 'AFTER' },
  ariaLabel: { type: String, default: 'Before and after comparison slider' },
})

const emit = defineEmits(['interact'])

const root = ref(null)
const position = ref(50)
const dragging = ref(false)
const interacted = ref(false)
const proxied = ref(false)
let timeline = null

const clipAfter = computed(() => `inset(0 ${100 - position.value}% 0 0)`)
const showFlash = computed(() => position.value >= 40)

function clamp(v, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v))
}

function setFromClientX(clientX) {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  position.value = clamp(((clientX - rect.left) / rect.width) * 100)
}

function markInteracted() {
  if (!interacted.value) {
    interacted.value = true
    emit('interact')
  }
  if (timeline) {
    timeline.kill()
    timeline = null
  }
}

function onPointerDown(e) {
  dragging.value = true
  markInteracted()
  root.value?.setPointerCapture?.(e.pointerId)
  setFromClientX(e.clientX)
}

function onPointerMove(e) {
  if (!dragging.value) return
  setFromClientX(e.clientX)
}

function onPointerUp(e) {
  dragging.value = false
  root.value?.releasePointerCapture?.(e.pointerId)
}

function onKeydown(e) {
  let delta = 0
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -5
  else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = 5
  else if (e.key === 'Home') {
    markInteracted()
    position.value = 0
    return
  } else if (e.key === 'End') {
    markInteracted()
    position.value = 100
    return
  } else return
  e.preventDefault()
  markInteracted()
  position.value = clamp(position.value + delta)
}

function animateAuto({ from = 0, to = 100, mid = 2.5, hold = 0.8, back = 1, settle = 50 } = {}) {
  if (interacted.value || prefersReducedMotion()) return
  proxied.value = true
  const proxy = { v: from }
  position.value = from

  timeline = gsap.timeline({
    onComplete: () => {
      proxied.value = false
      timeline = null
    },
  })

  timeline
    .to(proxy, {
      v: to,
      duration: mid,
      ease: 'power2.inOut',
      onUpdate: () => (position.value = proxy.v),
    })
    .to({}, { duration: hold })
    .to(proxy, {
      v: settle,
      duration: back,
      ease: 'power2.inOut',
      onUpdate: () => (position.value = proxy.v),
    })
}

defineExpose({ animateAuto })

onBeforeUnmount(() => timeline?.kill())
</script>

<template>
  <div
    ref="root"
    class="group relative h-full w-full select-none overflow-hidden rounded-[20px] border border-gold/30 bg-ink shadow-card"
    :class="dragging ? 'cursor-grabbing' : 'cursor-ew-resize'"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- BEFORE (base) -->
    <img
      :src="before"
      :alt="altBefore"
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
      draggable="false"
      loading="lazy"
    />

    <!-- AFTER (clipped) -->
    <div class="pointer-events-none absolute inset-0" :style="{ clipPath: clipAfter }">
      <img
        :src="after"
        :alt="altAfter"
        class="absolute inset-0 h-full w-full object-cover"
        draggable="false"
        loading="lazy"
      />
      <div
        v-if="showFlash"
        class="absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div class="flash" />
      </div>
    </div>

    <!-- Labels -->
    <span
      class="pointer-events-none absolute left-3 top-3 rounded-full border border-gold/40 bg-ink/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-smoke/90 backdrop-blur-sm sm:left-4 sm:top-4"
    >
      {{ labelBefore }}
    </span>
    <span
      class="pointer-events-none absolute right-3 top-3 rounded-full border border-gold/40 bg-ink/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-smoke/90 backdrop-blur-sm sm:right-4 sm:top-4"
    >
      {{ labelAfter }}
    </span>

    <!-- Divider -->
    <div
      class="pointer-events-none absolute inset-y-0 z-10 w-[3px] -translate-x-1/2"
      :style="{ left: position + '%', background: 'linear-gradient(180deg,#A68A37,#A67841,#A68A37)' }"
      aria-hidden="true"
    />

    <!-- Handle -->
    <div
      class="absolute top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-smoke text-ink shadow-gold outline-none sm:h-14 sm:w-14"
      :class="{ 'pulse-twice': proxied, 'animate-[pulse-halo_2s_ease-in-out_infinite]': !proxied }"
      :style="{ left: position + '%' }"
      role="slider"
      tabindex="0"
      :aria-label="ariaLabel"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(position)"
      aria-orientation="horizontal"
      @keydown="onKeydown"
    >
      <i class="fa-solid fa-chevron-left text-xs" aria-hidden="true" />
      <i class="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.flash {
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.28) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-18deg);
  animation: flash-loop 5s ease-in-out infinite;
}

@keyframes flash-loop {
  0% {
    transform: translateX(-180%) skewX(-20deg);
  }
  55%,
  100% {
    transform: translateX(180%) skewX(-20deg);
  }
}

.pulse-twice {
  animation: handle-pop 1.5s ease-in-out 2;
}

@keyframes handle-pop {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .flash,
  .pulse-twice {
    animation: none !important;
  }
}
</style>