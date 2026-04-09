<template>
  <div v-if="isDesktop" class="cursor-root" aria-hidden="true">
    <!-- Ambient trailing halo (follows with lag) -->
    <div ref="halo" class="cursor-halo" :class="{ 'cursor-halo--active': isActive }"></div>

    <!-- The AVATR diamond cursor -->
    <div ref="cursor" class="cursor-diamond" :class="{ 'cursor-diamond--active': isActive }" :style="{ '--angle': angle + 'deg' }">
      <svg class="cursor-diamond__svg" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer rectangle (AVATR emblem outer border) -->
        <rect x="2" y="2" width="36" height="52" rx="1"
          stroke="rgba(200,169,110,0.9)" stroke-width="1.2" fill="rgba(10,10,14,0.4)" />
        <!-- Inner hourglass / diamond -->
        <path d="M 2 2 L 20 24 L 38 2 M 2 54 L 20 32 L 38 54"
          stroke="rgba(200,169,110,0.8)" stroke-width="1" fill="none" />
        <!-- Center connector dot -->
        <circle cx="20" cy="28" r="1.5" fill="rgba(200,169,110,1)" />
        <!-- Velocity motion lines (appear when moving fast) -->
        <line class="cursor-diamond__trail" x1="20" y1="40" x2="20" y2="50" stroke="rgba(200,169,110,0.4)" stroke-width="0.8" />
      </svg>
    </div>

    <!-- Click burst: expanding diamond rings -->
    <div
      v-for="burst in bursts"
      :key="burst.id"
      class="cursor-burst"
      :style="{ left: burst.x + 'px', top: burst.y + 'px' }"
    >
      <svg viewBox="0 0 60 60" fill="none" class="cursor-burst__svg">
        <path d="M30 2 L58 30 L30 58 L2 30 Z" stroke="rgba(200,169,110,0.7)" stroke-width="1"/>
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
const angle = ref(0)
let burstId = 0

let lastX = 0
let lastY = 0
let currentX = 0
let currentY = 0

function onMouseMove(e) {
  isActive.value = true
  currentX = e.clientX
  currentY = e.clientY

  // Velocity-based rotation
  const dx = currentX - lastX
  const dy = currentY - lastY
  const speed = Math.sqrt(dx * dx + dy * dy)
  if (speed > 1) {
    const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) - 90
    gsap.to(angle, {
      value: targetAngle,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: true,
    })
  }
  lastX = currentX
  lastY = currentY

  if (!cursor.value) return
  // Diamond moves instantly
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
    duration: 0.8,
    ease: 'power3.out',
  })
}

function onMouseLeave() {
  isActive.value = false
}

function onMouseEnterInteractive() {
  if (!cursor.value) return
  gsap.to(cursor.value, { scale: 1.5, duration: 0.3, ease: 'back.out(2)' })
  gsap.to(halo.value, { scale: 2, opacity: 0.5, duration: 0.4 })
}

function onMouseLeaveInteractive() {
  if (!cursor.value) return
  gsap.to(cursor.value, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
  gsap.to(halo.value, { scale: 1, opacity: 1, duration: 0.4 })
}

function onClick(e) {
  const id = burstId++
  bursts.push({ id, x: e.clientX, y: e.clientY })
  // Quick scale punch on cursor
  if (cursor.value) {
    gsap.fromTo(cursor.value, { scale: 0.7 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1.5, 0.5)' })
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

/* ── Ambient halo (lags behind) ── */
.cursor-halo {
  position: fixed;
  top: 0;
  left: 0;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(200, 169, 110, 0.07) 0%,
    rgba(180, 210, 255, 0.03) 40%,
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
.cursor-diamond {
  position: fixed;
  top: 0;
  left: 0;
  width: 28px;
  height: 40px;
  transform: translate(-50%, -50%) rotate(var(--angle, 0deg));
  opacity: 0;
  pointer-events: none;
  transition: transform 0.15s ease, opacity 0.4s ease;
  filter: drop-shadow(0 0 6px rgba(200, 169, 110, 0.5));
}

.cursor-diamond--active {
  opacity: 1;
}

.cursor-diamond__svg {
  width: 100%;
  height: 100%;
}

.cursor-diamond__trail {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.cursor-diamond:global(.fast) .cursor-diamond__trail {
  opacity: 1;
}

/* ── Click burst: expanding diamond ── */
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
