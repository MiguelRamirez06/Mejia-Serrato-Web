<script setup>
defineProps({
  text: { type: String, required: true },
  centered: { type: Boolean, default: false },
})
</script>

<template>
  <p class="eyebrow" :class="{ 'eyebrow--center': centered }">
    <span>{{ text }}</span>
  </p>
</template>

<style scoped>
.eyebrow--center {
  justify-content: center;
}
.eyebrow--center::after {
  content: '';
  display: inline-block;
  height: 1px;
  width: 2rem;
  background: rgba(166, 138, 55, 0.6);
}
</style>