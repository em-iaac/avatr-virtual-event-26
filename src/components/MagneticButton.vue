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
  color: var(--color-text);
  background: rgba(200, 169, 110, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(200, 169, 110, 0.3);
  border-radius: 60px;
  cursor: pointer;
  overflow: hidden;
  will-change: transform;
  transition: all var(--duration-fast) ease;
  box-shadow: 0 4px 20px rgba(200, 169, 110, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.magnetic-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  border-radius: inherit;
  pointer-events: none;
}

.magnetic-btn:hover {
  background: rgba(200, 169, 110, 0.2);
  border-color: rgba(200, 169, 110, 0.5);
  box-shadow: 0 6px 30px rgba(200, 169, 110, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  color: var(--color-text);
}

.magnetic-btn__inner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  will-change: transform;
  pointer-events: none;
}
</style>
