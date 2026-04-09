<template>
  <button
    ref="btn"
    class="magnetic-btn"
    @mouseenter="onEnter"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <span ref="btnInner" class="magnetic-btn__inner">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'
import { useMediaQuery } from '@vueuse/core'

const props = defineProps({
  strength: { type: Number, default: 0.3 },
  innerStrength: { type: Number, default: 0.15 },
})

const btn = ref(null)
const btnInner = ref(null)
const isDesktop = useMediaQuery('(hover: hover)')

function onEnter() {
  if (!isDesktop.value) return
  gsap.to(btn.value, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
}

function onMove(e) {
  if (!isDesktop.value || !btn.value) return

  const rect = btn.value.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2

  gsap.to(btn.value, {
    x: x * props.strength,
    y: y * props.strength,
    duration: 0.3,
    ease: 'power2.out',
  })

  gsap.to(btnInner.value, {
    x: x * props.innerStrength,
    y: y * props.innerStrength,
    duration: 0.3,
    ease: 'power2.out',
  })
}

function onLeave() {
  if (!isDesktop.value) return
  gsap.to(btn.value, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  gsap.to(btnInner.value, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
}
</script>

<style scoped>
.magnetic-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 40px;
  font-family: var(--font-display);
  font-size: var(--text-caption);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-bg);
  background-color: var(--color-accent);
  border: none;
  cursor: pointer;
  overflow: hidden;
  will-change: transform;
  transition: background-color var(--duration-fast) ease;
}

.magnetic-btn:hover {
  background-color: var(--color-accent-hover);
}

.magnetic-btn__inner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  will-change: transform;
  pointer-events: none;
}
</style>
