<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionEyebrow from '../ui/SectionEyebrow.vue'
import { cartoKey } from '../../data/site'
import 'leaflet/dist/leaflet.css'

const { t, tm, locale } = useI18n()

const mapEl = ref(null)
let map = null

const cities = computed(() => {
  void locale.value
  return tm('serviceArea.cities')
})

// Coordinates aligned with the city order: Moreno Valley, Riverside, San Bernardino,
// Redlands, Corona, Perris, Hemet.
const coords = [
  [33.9425, -117.2297], // Moreno Valley
  [33.9533, -117.3962], // Riverside
  [34.1083, -117.2898], // San Bernardino
  [34.0556, -117.1825], // Redlands
  [33.8753, -117.5664], // Corona
  [33.7825, -117.2286], // Perris
  [33.7476, -116.9719], // Hemet
]

function pinIcon(L, main = false) {
  const size = main ? 18 : 14
  return L.divIcon({
    className: 'mss-pin-wrap',
    html: `<span class="mss-pin ${main ? 'mss-pin--main' : ''}" style="--pin-size:${size}px"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  })
}

onMounted(async () => {
  const L = (await import('leaflet')).default

  map = L.map(mapEl.value, {
    center: [33.9425, -117.2297],
    zoom: 10,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
  })

  L.tileLayer(
    `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`,
    {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20,
    },
  ).addTo(map)

  cities.value.forEach((city, i) => {
    const [lat, lng] = coords[i] || coords[0]
    const isMain = city.toLowerCase().includes('moreno')
    L.marker([lat, lng], { icon: pinIcon(L, isMain), title: city })
      .addTo(map)
      .bindPopup(`<strong>${city}</strong>`)
  })

  // Enable wheel zoom only after the user clicks the map (keeps page scroll smooth).
  map.on('click', () => map.scrollWheelZoom.enable())
  map.on('mouseout', () => map.scrollWheelZoom.disable())

  setTimeout(() => map && map.invalidateSize(), 250)
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <section id="service-area" class="relative bg-smoke py-24 sm:py-32">
    <div class="container-x">
      <div class="max-w-2xl">
        <SectionEyebrow :text="t('serviceArea.eyebrow')" />
        <h2 class="mt-5 font-display text-ink" style="font-size: clamp(34px, 5.5vw, 58px)">
          {{ t('serviceArea.title') }}
        </h2>
        <p class="mt-4 text-base text-ink/60 sm:text-lg">{{ t('serviceArea.subtitle') }}</p>
      </div>

      <div class="mt-14 grid items-stretch gap-12 lg:grid-cols-2">
        <!-- Leaflet map -->
        <div
          class="relative isolate z-0 min-h-[340px] overflow-hidden rounded-2xl border border-ink/10 bg-beige sm:min-h-[420px]"
        >
          <div ref="mapEl" class="absolute inset-0 h-full w-full" :aria-label="t('serviceArea.title')" />
        </div>

        <!-- City list -->
        <div>
          <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <li
              v-for="(city, i) in cities"
              :key="i"
              class="flex items-center gap-3 rounded-lg border border-ink/10 bg-ink/[0.02] px-4 py-3"
            >
              <i class="fa-solid fa-circle-check text-gold" aria-hidden="true" />
              <span class="text-sm font-medium text-ink/80">{{ city }}</span>
            </li>
          </ul>
          <p class="mt-6 text-sm italic text-ink/50">{{ t('serviceArea.note') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* Non-scoped: Leaflet injects DOM outside the component scope */
.mss-pin-wrap {
  background: transparent;
  border: none;
}

.mss-pin {
  display: block;
  width: var(--pin-size, 14px);
  height: var(--pin-size, 14px);
  border-radius: 9999px;
  background: #a68a37;
  border: 2px solid #0d0d0d;
  box-shadow: 0 0 0 0 rgba(166, 138, 55, 0.55);
  position: relative;
  animation: mss-pin-pulse 2.4s ease-out infinite;
  transform: translateZ(0);
}

.mss-pin--main {
  background: #a67841;
  box-shadow: 0 0 0 0 rgba(166, 120, 65, 0.6);
}

@keyframes mss-pin-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(166, 138, 55, 0.5);
  }
  70% {
    box-shadow: 0 0 0 16px rgba(166, 138, 55, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(166, 138, 55, 0);
  }
}

.leaflet-container {
  font-family: Inter, system-ui, sans-serif;
  background: #d9cba3;
}

.leaflet-popup-content-wrapper {
  background: #0d0d0d;
  color: #f2f2f2;
  border-radius: 10px;
  border: 1px solid rgba(166, 138, 55, 0.5);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
}
.leaflet-popup-content {
  margin: 10px 14px;
  font-size: 13px;
  letter-spacing: 0.02em;
}
.leaflet-popup-content strong {
  color: #a68a37;
  font-weight: 600;
}
.leaflet-popup-tip {
  background: #0d0d0d;
}

.leaflet-bar a {
  background: #0d0d0d;
  color: #f2f2f2;
  border-bottom-color: rgba(166, 138, 55, 0.4);
}
.leaflet-bar a:hover {
  background: #a68a37;
  color: #0d0d0d;
}

.leaflet-control-attribution {
  background: rgba(242, 242, 242, 0.7) !important;
  font-size: 10px;
}

@media (prefers-reduced-motion: reduce) {
  .mss-pin {
    animation: none;
  }
}
</style>