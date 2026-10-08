// Placeholder contact data — replace with real values before launch.
export const contact = {
  phoneDisplay: '+1 (714) 266-9502',
  phoneHref: 'tel:+17142669502',
  whatsappNumber: '17142669502',
  email: 'jalexmejia84@hotmail.com',
}

export function whatsappLink(message = '') {
  const base = `https://wa.me/${contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

// CARTO Basemaps API key (client-side key, domain-restricted).
export const cartoKey = 'cb1_4dnv_1_f9272d388d470ebfd2424479'
export const cartoTiles =
  `https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`