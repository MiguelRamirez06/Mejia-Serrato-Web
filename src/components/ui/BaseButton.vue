<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost
  size: { type: String, default: 'md' }, // sm | md | lg
  href: { type: String, default: '' },
  tag: { type: String, default: '' },
  block: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' },
})

const isLink = computed(() => props.tag === 'a' || !!props.href)
const componentTag = computed(() => (isLink.value ? 'a' : 'button'))

const sizeClasses = {
  sm: 'px-5 py-2.5 text-[13px]',
  md: 'px-7 py-3.5 text-sm',
  lg: 'px-9 py-4 text-base',
}

const variantClasses = {
  primary: 'text-smoke bg-gold-gradient shadow-[0_10px_30px_-10px_rgba(166,138,55,0.8)]',
  secondary: 'text-gold border border-gold/70 bg-transparent',
  ghost: 'text-smoke border border-smoke/30 bg-transparent',
}

const classes = computed(() => [
  'group relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium uppercase tracking-[0.18em] transition-all duration-500 ease-cinematic',
  sizeClasses[props.size] || sizeClasses.md,
  variantClasses[props.variant] || variantClasses.primary,
  props.variant === 'primary' ? 'shimmer hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(166,138,55,0.9)]' : 'hover:-translate-y-0.5',
  props.variant === 'secondary' ? 'hover:bg-gold hover:text-ink' : '',
  props.variant === 'ghost' ? 'hover:border-gold hover:text-gold' : '',
  props.block ? 'w-full' : '',
])
</script>

<template>
  <component
    :is="componentTag"
    :href="isLink ? href : undefined"
    :type="!isLink ? 'button' : undefined"
    :target="href && href.startsWith('http') ? '_blank' : undefined"
    :rel="href && href.startsWith('http') ? 'noopener noreferrer' : undefined"
    :aria-label="ariaLabel || undefined"
    :class="classes"
  >
    <slot name="icon-left" />
    <span class="relative z-10"><slot /></span>
    <slot name="icon-right" />
  </component>
</template>