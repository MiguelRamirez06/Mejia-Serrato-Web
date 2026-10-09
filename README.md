# Mejia Serrato Stone Restoration

Sitio web de una sola página (one-page) para **Mejia Serrato Stone Restoration**, empresa de restauración de piedra natural (mármol, granito, travertino y caliza) que da servicio en Moreno Valley y el Inland Empire, California.

Enfoque **mobile-first** y estética cinematográfica: animaciones suaves al hacer scroll, video en el hero, comparador "antes y después" y un mosaico editorial de proyectos.

## Stack

- **Vue 3** (`<script setup>` + Composition API)
- **Vite 5** como bundler / dev server
- **Tailwind CSS 3** para estilos
- **GSAP + ScrollTrigger** para animaciones y parallax
- **Lenis** para scroll suave
- **vue-i18n 9** para contenido bilingüe (Inglés / Español)
- **Leaflet** para el mapa de área de servicio
- **Font Awesome** (iconos) vía paquete local

## Requisitos

- Node.js 18 o superior
- npm

## Inicio rápido

```bash
npm install
npm run dev
```

El servidor de desarrollo queda expuesto en la red local (`host: true`, puerto `5173`), por lo que también puedes abrirlo desde tu teléfono en `http://<IP-DE-TU-PC>:5173`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR (host `0.0.0.0`) |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción (puerto `4173`) |

## Estructura del proyecto

```
.
├── index.html                 # HTML raíz (meta SEO, fuentes, preload)
├── vite.config.js             # Config de Vite (publicDir: resources, alias @, server)
├── tailwind.config.js         # Paleta, tipografías y utilidades de tema
├── postcss.config.js
├── resources/                 # Assets estáticos servidos desde la raíz (/)
│   ├── logo.webp
│   ├── works/                 # Fotos de proyectos (work_1..5)
│   ├── before_and_after/      # Pares antes/después
│   ├── hero-1080.mp4          # Video del hero (desktop)
│   └── hero-720.mp4           # Video del hero (móvil)
└── src/
    ├── main.js                # Punto de entrada
    ├── App.vue                # Composición de secciones
    ├── i18n.js                # Config de vue-i18n y detección de idioma
    ├── data/site.js           # Datos de contacto y config del mapa
    ├── locales/               # Textos en.json / es.json
    ├── styles/main.css        # Tailwind + estilos globales (keys, noise, etc.)
    ├── composables/           # useLenis, useI18n, useScrollReveal
    └── components/
        ├── layout/            # AppHeader, AppFooter
        ├── ui/                # BaseButton, BeforeAfterSlider, LanguageSwitcher, ...
        └── sections/          # Hero, BeforeAfter, Services, Gallery, Surfaces,
                               # Process, ServiceArea, FinalCta
```

## Contenido y traducciones

- Todos los textos viven en **`src/locales/en.json`** y **`src/locales/es.json`**.
- Se accede a ellos con `t('seccion.clave')` y a las listas con `tm('seccion.items')`.
- El idioma se detecta del navegador y se guarda en `localStorage` bajo la clave **`mss-locale`**. Se puede cambiar desde el selector del header.
- Si agregas textos, **hazlo en ambos archivos** para mantener la paridad EN/ES.

> Muchos componentes tienen las rutas de las imágenes en arrays locales (galería, servicios, superficies, antes/después). Si cambias una imagen, revisa el componente correspondiente en `src/components/sections/`.

## Datos de contacto y configuración

Todo lo editable de contacto está en **`src/data/site.js`**:

```js
export const contact = {
  phoneDisplay: '...',
  phoneHref: 'tel:...',
  whatsappNumber: '...',
  email: '...',
}
```

- `whatsappLink(message)` genera enlaces de WhatsApp con mensaje predefinido.
- `cartoKey` / `cartoTiles` configuran las tiles del mapa (ver nota más abajo).

## Assets y video del hero

- La carpeta **`resources/`** es el `publicDir` de Vite: todo allí se sirve desde la raíz (`/logo.webp`, `/works/work_1.webp`, etc.).
- El video del hero tiene dos versiones optimizadas (H.264, sin audio, `faststart`):
  - `hero-1080.mp4` para desktop
  - `hero-720.mp4` para móvil
- El master sin comprimir (`video_1_original.mp4`) está en `.gitignore` y **no** se despliega.
- Al reemplazar el video, genera versiones optimizadas para no afectar la carga. Ejemplo con ffmpeg:

```bash
ffmpeg -i original.mp4 -an -vf "scale=-2:1080" \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart hero-1080.mp4
```

## Diseño

- **Paleta** (definida en `tailwind.config.js`):
  - `gold #A68A37`, `beige #D9CBA3`, `bronze #A67841`, `smoke #F2F2F2`, `ink #0D0D0D`
- **Tipografías**: `font-display` (Cormorant Garamond) y `font-body` (Inter), cargadas en `index.html`.
- Utilidades de tema: `ease-cinematic`, `shadow-gold`, `shadow-card`, y clases globales como `.container-x`, `.eyebrow`, `.noise`, `.bg-gold-gradient`.

## Área de servicio (mapa)

El mapa usa **Leaflet** con tiles de **CARTO** (estilo Positron). La API key está en `src/data/site.js` (`cartoKey`).

> La key es de uso **client-side**: es visible en el bundle. Protégela restringiéndola por dominio/referrer desde el panel de CARTO.

## Despliegue (Vercel)

El proyecto está pensado para desplegarse en **Vercel**:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Vite genera un SPA estático; no requiere variables de entorno.

## Pendientes / mejoras sugeridas

- Sustituir los datos de contacto de ejemplo en `src/data/site.js` por los definitivos.
- **Integrar un CMS** para que el cliente gestione textos e imágenes (propuesta: CMS basado en Git tipo Decap/Sveltia, o headless alojado tipo Sanity). Requiere normalizar el contenido (hoy repartido entre `locales/` y arrays en los componentes).
- Añadir un pipeline de optimización de imágenes en el build.
- Reemplazar los textos de `title`/`description` de `index.html` si cambia la propuesta de valor.

## Licencia

Proyecto privado. Todos los derechos reservados.
