<template>
  <div class="section-heading" ref="headingEl">
    <TextReveal
      v-if="title"
      :text="title"
      tag="h2"
      class="section-heading__title"
    />
    <!-- SVG path-drawing divider (loader motif) -->
    <svg class="section-heading__divider-svg" viewBox="0 0 200 24" fill="none">
      <path
        class="section-heading__draw-line"
        d="M 0 12 L 80 12"
        stroke="var(--color-accent)"
        stroke-width="0.8"
      />
      <path
        class="section-heading__draw-diamond"
        d="M 92 12 L 100 2 L 108 12 L 100 22 Z"
        stroke="var(--color-accent)"
        stroke-width="0.8"
        fill="none"
      />
      <path
        class="section-heading__draw-line section-heading__draw-line--right"
        d="M 120 12 L 200 12"
        stroke="var(--color-accent)"
        stroke-width="0.8"
      />
    </svg>
    <TextReveal
      v-if="subtitle"
      :text="subtitle"
      tag="p"
      class="section-heading__subtitle"
      :delay="0.3"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from './TextReveal.vue'

gsap.registerPlugin(ScrollTrigger)

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const headingEl = ref(null)
let ctx = null

onMounted(() => {
  if (!headingEl.value) return

  ctx = gsap.context(() => {
    const paths = headingEl.value.querySelectorAll('.section-heading__draw-line, .section-heading__draw-diamond')
    paths.forEach((path) => {
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    })

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: headingEl.value,
        start: 'top 85%',
        once: true,
      },
    })
  }, headingEl.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.section-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  margin-bottom: var(--gap-lg);
}

.section-heading__title {
  font-size: var(--text-h2);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text);
  justify-content: center;
}

.section-heading__divider-svg {
  width: clamp(120px, 30vw, 200px);
  height: auto;
  opacity: 0.7;
}

.section-heading__subtitle {
  font-size: var(--text-body);
  font-weight: 300;
  color: var(--color-muted);
  letter-spacing: 0.05em;
  max-width: 500px;
  justify-content: center;
}
</style>
