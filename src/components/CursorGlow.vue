<template>
  <div
    v-if="isDesktop"
    ref="glow"
    class="cursor-glow"
    :class="{ 'cursor-glow--active': isActive }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useMediaQuery } from '@vueuse/core'

const glow = ref(null)
const isDesktop = useMediaQuery('(hover: hover)')
const isActive = ref(false)

let raf = null

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

onMounted(() => {
  if (!isDesktop.value) return
  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.cursor-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 169, 110, 0.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.cursor-glow--active {
  opacity: 1;
}
</style>
