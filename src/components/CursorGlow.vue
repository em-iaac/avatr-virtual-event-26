<template>
  <div v-if="isDesktop" class="cursor-glow-container" aria-hidden="true">
    <div
      ref="glow"
      class="cursor-glow"
      :class="{ 'cursor-glow--active': isActive }"
    ></div>
    <!-- Click burst rings -->
    <div
      v-for="burst in bursts"
      :key="burst.id"
      class="cursor-glow__burst"
      :style="{ left: burst.x + 'px', top: burst.y + 'px' }"
    ></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useMediaQuery } from '@vueuse/core'

const glow = ref(null)
const isDesktop = useMediaQuery('(hover: hover)')
const isActive = ref(false)
const bursts = reactive([])
let burstId = 0

function onMouseMove(e) {
  if (!glow.value) return
  isActive.value = true

  gsap.to(glow.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.6,
    ease: 'power2.out',
  })
}

function onMouseLeave() {
  isActive.value = false
}

function onClick(e) {
  const id = burstId++
  bursts.push({ id, x: e.clientX, y: e.clientY })
  setTimeout(() => {
    const idx = bursts.findIndex(b => b.id === id)
    if (idx !== -1) bursts.splice(idx, 1)
  }, 600)
}

onMounted(() => {
  if (!isDesktop.value) return
  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('click', onClick)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('click', onClick)
})
</script>

<style scoped>
.cursor-glow-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.cursor-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 169, 110, 0.06) 0%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.cursor-glow--active {
  opacity: 1;
}

.cursor-glow__burst {
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(200, 169, 110, 0.3);
  transform: translate(-50%, -50%) scale(0);
  animation: clickBurst 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes clickBurst {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.6;
    border-width: 2px;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
    border-width: 0.5px;
  }
}
</style>
