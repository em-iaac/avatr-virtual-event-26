<template>
  <section ref="section" class="car-reveal">
    <div class="car-reveal__sticky">
      <!-- Background gradient mask -->
      <div class="car-reveal__mask" ref="mask"></div>

      <!-- Placeholder car image area -->
      <div class="car-reveal__image" ref="image">
        <div class="car-reveal__placeholder">
          <span class="car-reveal__model-name">AVATR 11</span>
          <span class="car-reveal__model-sub">Revealed</span>
        </div>
      </div>

      <!-- Text overlay -->
      <div class="car-reveal__text" ref="textBlock">
        <h2 class="car-reveal__title">The Future Unveiled</h2>
        <p class="car-reveal__subtitle">Scroll to reveal</p>
      </div>

      <!-- Gold accent particles -->
      <div class="car-reveal__particles">
        <span v-for="i in 6" :key="i" class="car-reveal__particle" :style="particleStyle(i)"></span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)
const mask = ref(null)
const image = ref(null)
const textBlock = ref(null)

let ctx = null

function particleStyle(i) {
  const top = 20 + Math.random() * 60
  const left = 10 + Math.random() * 80
  const size = 2 + Math.random() * 3
  const delay = i * 0.3
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
  }
}

onMounted(() => {
  if (!section.value) return

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: '+=150%',
        scrub: 1,
        pin: true,
      },
    })

    // Mask opens from center circle to full viewport
    tl.fromTo(
      mask.value,
      { clipPath: 'circle(0% at 50% 50%)' },
      { clipPath: 'circle(100% at 50% 50%)', duration: 1, ease: 'none' }
    )

    // Image scales from slightly zoomed to normal
    tl.fromTo(
      image.value,
      { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'none' },
      0
    )

    // Text fades in at the end
    tl.fromTo(
      textBlock.value,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      0.7
    )
  }, section.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.car-reveal {
  position: relative;
  width: 100%;
  /* ScrollTrigger pin needs actual height */
}

.car-reveal__sticky {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.car-reveal__mask {
  position: absolute;
  inset: 0;
  background: var(--color-surface);
  clip-path: circle(0% at 50% 50%);
  z-index: 1;
}

.car-reveal__image {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: 0;
}

.car-reveal__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(200, 169, 110, 0.05) 0%, transparent 60%);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.car-reveal__model-name {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--color-text);
  text-transform: uppercase;
}

.car-reveal__model-sub {
  font-family: var(--font-display);
  font-size: var(--text-caption);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.car-reveal__text {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 3;
  opacity: 0;
}

.car-reveal__title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text);
  margin-bottom: 8px;
}

.car-reveal__subtitle {
  font-size: var(--text-caption);
  letter-spacing: 0.1em;
  color: var(--color-muted);
}

/* Floating gold particles */
.car-reveal__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}

.car-reveal__particle {
  position: absolute;
  background: var(--color-accent);
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat 4s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% { opacity: 0; transform: translateY(0); }
  50% { opacity: 0.4; transform: translateY(-20px); }
}
</style>
