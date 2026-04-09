<template>
  <div v-if="isDesktop" class="cursor-root" aria-hidden="true">
    <div ref="halo" class="cursor-halo" :class="{ 'cursor-halo--active': isActive }"></div>

    <div ref="cursor" class="cursor-core" :class="{ 'cursor-core--active': isActive }">
      <span class="cursor-core__dot"></span>
    </div>

    <div
      v-for="burst in bursts"
      :key="burst.id"
      class="cursor-burst"
      :style="{ left: burst.x + 'px', top: burst.y + 'px' }"
    >
      <svg viewBox="0 0 60 60" fill="none" class="cursor-burst__svg">
        <circle cx="30" cy="30" r="24" stroke="rgba(200,169,110,0.55)" stroke-width="1"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useMediaQuery } from '@vueuse/core'

const cursor = ref(null)
const halo = ref(null)
const isDesktop = useMediaQuery('(hover: hover)')
const isActive = ref(false)
const bursts = reactive([])
let burstId = 0

function onMouseMove(e) {
  isActive.value = true

  if (!cursor.value) return
  gsap.to(cursor.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: 'none',
  })
  // Halo lags behind for depth
  gsap.to(halo.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.7,
    ease: 'power3.out',
  })
}

function onMouseLeave() {
  isActive.value = false
}

function onMouseEnterInteractive() {
  if (!cursor.value) return
  gsap.to(cursor.value, { scale: 1.35, duration: 0.25, ease: 'power2.out' })
  gsap.to(halo.value, { scale: 1.5, opacity: 0.55, duration: 0.3 })
}

function onMouseLeaveInteractive() {
  if (!cursor.value) return
  gsap.to(cursor.value, { scale: 1, duration: 0.25, ease: 'power2.out' })
  gsap.to(halo.value, { scale: 1, opacity: 1, duration: 0.4 })
}

function onClick(e) {
  const id = burstId++
  bursts.push({ id, x: e.clientX, y: e.clientY })
  if (cursor.value) {
    gsap.fromTo(cursor.value, { scale: 0.85 }, { scale: 1, duration: 0.25, ease: 'power2.out' })
  }
  setTimeout(() => {
    const idx = bursts.findIndex(b => b.id === id)
    if (idx !== -1) bursts.splice(idx, 1)
  }, 700)
}

onMounted(() => {
  if (!isDesktop.value) return
  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('click', onClick)

  // Grow cursor on interactive elements
  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', onMouseEnterInteractive)
    el.addEventListener('mouseleave', onMouseLeaveInteractive)
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('click', onClick)
})
</script>

<style scoped>
/* Hide system cursor sitewide when this component mounts */
:global(*, *::before, *::after) {
  cursor: none !important;
}

.cursor-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;
}

.cursor-halo {
  position: fixed;
  top: 0;
  left: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(200, 169, 110, 0.09) 0%,
    rgba(180, 210, 255, 0.02) 40%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.cursor-halo--active {
  opacity: 1;
}

/* ── Diamond cursor ── */
.cursor-core {
  position: fixed;
  top: 0;
  left: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(200, 169, 110, 0.65);
  background: rgba(10, 10, 14, 0.18);
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.15s ease, opacity 0.4s ease;
  display: grid;
  place-items: center;
  box-shadow: 0 0 10px rgba(200, 169, 110, 0.14);
}

.cursor-core--active {
  opacity: 1;
}

.cursor-core__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-accent);
}

.cursor-burst {
  position: fixed;
  width: 60px;
  height: 60px;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.cursor-burst__svg {
  width: 100%;
  height: 100%;
  animation: burstDiamond 0.7s var(--ease-out) forwards;
}

@keyframes burstDiamond {
  0%   { transform: scale(0.2); opacity: 0.9; }
  60%  { opacity: 0.5; }
  100% { transform: scale(2.2); opacity: 0; }
}
</style>
