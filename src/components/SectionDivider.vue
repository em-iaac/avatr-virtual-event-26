<template>
  <div class="section-divider" :class="`section-divider--${variant}`" ref="dividerEl">
    <!-- Diamond line variant (SVG path-drawing) -->
    <template v-if="variant === 'diamond'">
      <svg class="section-divider__svg" viewBox="0 0 300 30" fill="none">
        <path
          class="section-divider__path"
          d="M 0 15 L 125 15"
          stroke="rgba(200, 169, 110, 0.2)"
          stroke-width="0.5"
        />
        <path
          class="section-divider__path section-divider__path--diamond"
          d="M 140 15 L 150 3 L 160 15 L 150 27 Z"
          stroke="var(--color-accent)"
          stroke-width="0.8"
          fill="none"
        />
        <path
          class="section-divider__path"
          d="M 175 15 L 300 15"
          stroke="rgba(200, 169, 110, 0.2)"
          stroke-width="0.5"
        />
      </svg>
    </template>

    <!-- Gold gradient line with dots (pulse-animated) -->
    <template v-if="variant === 'dots'">
      <svg class="section-divider__svg section-divider__svg--dots" viewBox="0 0 200 10" fill="none">
        <path
          class="section-divider__path"
          d="M 0 5 L 85 5"
          stroke="rgba(200, 169, 110, 0.15)"
          stroke-width="0.5"
        />
        <circle class="section-divider__path section-divider__dot-circle" cx="92" cy="5" r="1.5" fill="var(--color-accent)" opacity="0.3"/>
        <circle class="section-divider__path section-divider__dot-circle" cx="100" cy="5" r="2" fill="var(--color-accent)" opacity="0.45"/>
        <circle class="section-divider__path section-divider__dot-circle" cx="108" cy="5" r="1.5" fill="var(--color-accent)" opacity="0.3"/>
        <path
          class="section-divider__path"
          d="M 115 5 L 200 5"
          stroke="rgba(200, 169, 110, 0.15)"
          stroke-width="0.5"
        />
      </svg>
    </template>

    <!-- Emblem-motif line (mini version of the loader shape) -->
    <template v-if="variant === 'line'">
      <svg class="section-divider__svg section-divider__svg--emblem" viewBox="0 0 300 20" fill="none">
        <path
          class="section-divider__path"
          d="M 0 10 L 120 10"
          stroke="rgba(200, 169, 110, 0.15)"
          stroke-width="0.5"
        />
        <path
          class="section-divider__path section-divider__path--emblem"
          d="M 135 3 L 150 10 L 165 3 M 135 17 L 150 10 L 165 17"
          stroke="var(--color-accent)"
          stroke-width="0.8"
          fill="none"
        />
        <path
          class="section-divider__path"
          d="M 180 10 L 300 10"
          stroke="rgba(200, 169, 110, 0.15)"
          stroke-width="0.5"
        />
      </svg>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps({
  variant: { type: String, default: 'diamond' },
})

const dividerEl = ref(null)
let ctx = null

onMounted(() => {
  if (!dividerEl.value) return

  ctx = gsap.context(() => {
    const paths = dividerEl.value.querySelectorAll('.section-divider__path')
    paths.forEach((path) => {
      if (path.tagName === 'circle') return
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    })

    const circles = dividerEl.value.querySelectorAll('.section-divider__dot-circle')
    if (circles.length) {
      gsap.set(circles, { scale: 0, transformOrigin: 'center' })
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: dividerEl.value,
        start: 'top 90%',
        once: true,
      },
    })

    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
    })

    if (circles.length) {
      tl.to(circles, {
        scale: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(3)',
      }, '-=0.3')
    }
  }, dividerEl.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
}

.section-divider__svg {
  width: clamp(150px, 40vw, 300px);
  height: auto;
}

.section-divider__svg--dots {
  width: clamp(100px, 30vw, 200px);
}

.section-divider__svg--emblem {
  width: clamp(150px, 40vw, 300px);
}
</style>
