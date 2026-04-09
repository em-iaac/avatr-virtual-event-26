<template>
  <div
    ref="card"
    class="tilt-card"
    @mouseenter="onEnter"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <div ref="cardInner" class="tilt-card__inner">
      <slot />
    </div>
    <div class="tilt-card__shine" ref="shine"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'
import { useMediaQuery } from '@vueuse/core'

const props = defineProps({
  maxTilt: { type: Number, default: 8 },
  scale: { type: Number, default: 1.02 },
})

const card = ref(null)
const cardInner = ref(null)
const shine = ref(null)
const isDesktop = useMediaQuery('(hover: hover)')

function onEnter() {
  if (!isDesktop.value) return
  gsap.to(card.value, { scale: props.scale, duration: 0.4, ease: 'power2.out' })
}

function onMove(e) {
  if (!isDesktop.value || !card.value) return

  const rect = card.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  gsap.to(card.value, {
    rotateY: x * props.maxTilt,
    rotateX: -y * props.maxTilt,
    duration: 0.4,
    ease: 'power2.out',
  })

  gsap.to(shine.value, {
    opacity: 0.08,
    background: `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(200, 169, 110, 0.15), transparent 60%)`,
    duration: 0.3,
  })
}

function onLeave() {
  if (!isDesktop.value) return
  gsap.to(card.value, {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)',
  })
  gsap.to(shine.value, { opacity: 0, duration: 0.4 })
}
</script>

<style scoped>
.tilt-card {
  position: relative;
  perspective: 800px;
  transform-style: preserve-3d;
  will-change: transform;
}

.tilt-card__inner {
  position: relative;
  z-index: 1;
}

.tilt-card__shine {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  z-index: 2;
}
</style>
