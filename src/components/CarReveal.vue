<template>
  <section ref="section" class="car-reveal">
    <div class="car-reveal__sticky">
      <!-- Dark overlay that reveals -->
      <div class="car-reveal__overlay" ref="overlay"></div>

      <!-- Light sweep beam -->
      <div class="car-reveal__sweep" ref="sweep"></div>

      <!-- Car image -->
      <div class="car-reveal__image" ref="image">
        <img :src="carImage" alt="AVATR 11" class="car-reveal__car-img" />
      </div>

      <!-- Light reflection sweep (after reveal) -->
      <div class="car-reveal__reflection" ref="reflection"></div>

      <!-- Text overlay -->
      <div class="car-reveal__text" ref="textBlock">
        <img :src="emblemWhite" alt="" class="car-reveal__emblem" />
        <h2 class="car-reveal__title">The Future Unveiled</h2>
        <p class="car-reveal__subtitle">AVATR 11 &middot; Luxury SUV</p>
      </div>

      <!-- Gold accent particles -->
      <div class="car-reveal__particles" ref="particles">
        <span v-for="i in 12" :key="i" class="car-reveal__particle" :style="particleStyle(i)"></span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import carImage from '../assets/avatr-011.png'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)
const overlay = ref(null)
const sweep = ref(null)
const image = ref(null)
const reflection = ref(null)
const textBlock = ref(null)
const particles = ref(null)

let ctx = null

function particleStyle(i) {
  const top = 15 + Math.random() * 70
  const left = 5 + Math.random() * 90
  const size = 2 + Math.random() * 4
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
  }
}

onMounted(() => {
  if (!section.value) return

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true,
      },
    })

    // Phase 1: Light sweep moves from left to right (0% → 50%)
    tl.fromTo(
      sweep.value,
      { left: '-10%' },
      { left: '110%', duration: 0.5, ease: 'none' }
    )

    // Car image fades in as sweep passes
    tl.fromTo(
      image.value,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'none' },
      0
    )

    // Overlay lifts (gets transparent) as sweep passes
    tl.fromTo(
      overlay.value,
      { opacity: 1 },
      { opacity: 0, duration: 0.5, ease: 'none' },
      0
    )

    // Phase 2: Reflection sweep across the car (50% → 70%)
    tl.fromTo(
      reflection.value,
      { left: '-30%', opacity: 0.6 },
      { left: '130%', opacity: 0, duration: 0.25, ease: 'power1.in' },
      0.5
    )

    // Phase 3: Text fades in (70% → 90%)
    tl.fromTo(
      textBlock.value,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
      0.7
    )

    // Particles burst
    tl.fromTo(
      '.car-reveal__particle',
      { opacity: 0, scale: 0 },
      { opacity: 0.6, scale: 1, duration: 0.2, stagger: 0.02, ease: 'back.out(2)' },
      0.6
    )

    // Particles then float and fade
    tl.to(
      '.car-reveal__particle',
      { y: -30, opacity: 0, duration: 0.3, stagger: 0.01, ease: 'power1.in' },
      0.8
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
}

.car-reveal__sticky {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #050505;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dark overlay */
.car-reveal__overlay {
  position: absolute;
  inset: 0;
  background: #050505;
  z-index: 3;
}

/* Light sweep beam */
.car-reveal__sweep {
  position: absolute;
  top: 0;
  left: -10%;
  width: 8%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(200, 169, 110, 0.03) 20%,
    rgba(200, 169, 110, 0.15) 40%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(200, 169, 110, 0.15) 60%,
    rgba(200, 169, 110, 0.03) 80%,
    transparent 100%
  );
  z-index: 4;
  pointer-events: none;
  filter: blur(2px);
}

/* Car image */
.car-reveal__image {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: 0;
  padding: 5% 8%;
}

.car-reveal__car-img {
  width: 100%;
  max-width: 900px;
  height: auto;
  object-fit: contain;
}

/* Light reflection sweep */
.car-reveal__reflection {
  position: absolute;
  top: 0;
  left: -30%;
  width: 15%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 40%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 60%,
    transparent 100%
  );
  z-index: 5;
  pointer-events: none;
  opacity: 0;
}

/* Text overlay */
.car-reveal__text {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 6;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.car-reveal__emblem {
  width: 36px;
  height: auto;
  opacity: 0.4;
  filter: brightness(2);
}

.car-reveal__title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text);
}

.car-reveal__subtitle {
  font-size: var(--text-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
}

/* Gold particles */
.car-reveal__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 7;
}

.car-reveal__particle {
  position: absolute;
  background: var(--color-accent);
  border-radius: 50%;
  opacity: 0;
  box-shadow: 0 0 6px rgba(200, 169, 110, 0.4);
}
</style>
