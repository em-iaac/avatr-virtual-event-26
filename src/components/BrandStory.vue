<template>
  <section ref="section" class="brand-story section" id="story">
    <div class="section__inner">
      <SectionHeading
        title="Born from the Future"
        subtitle="A convergence of three industry titans"
      />

      <!-- Connecting lines SVG (desktop) -->
      <div class="brand-story__flow">
        <svg ref="flowSvg" class="brand-story__flow-svg" viewBox="0 0 1000 60" preserveAspectRatio="none">
          <!-- Left to center -->
          <path ref="line1" d="M 167 30 C 300 30, 350 30, 500 30" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3" stroke-dasharray="400" stroke-dashoffset="400"/>
          <!-- Center to right -->
          <path ref="line2" d="M 500 30 C 650 30, 700 30, 833 30" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3" stroke-dasharray="400" stroke-dashoffset="400"/>
          <!-- Center diamond node -->
          <path d="M 500 18 L 512 30 L 500 42 L 488 30 Z" fill="none" stroke="var(--color-accent)" stroke-width="1" opacity="0.4"/>
        </svg>
      </div>

      <div class="brand-story__cards">
        <ScrollReveal
          v-for="(card, i) in cards"
          :key="i"
          :delay="i * 0.15"
          class="brand-story__card"
        >
          <TiltCard>
            <div class="brand-story__card-inner">
              <div class="brand-story__icon" v-html="card.svg"></div>
              <h3 class="brand-story__card-title">{{ card.title }}</h3>
              <p class="brand-story__card-text">{{ card.text }}</p>
              <span class="brand-story__card-partner">{{ card.partner }}</span>
            </div>
          </TiltCard>
        </ScrollReveal>
      </div>

      <!-- Emblem visual anchor -->
      <div class="brand-story__emblem-wrap">
        <img :src="emblemWhite" alt="" class="brand-story__emblem" />
      </div>

      <ScrollReveal class="brand-story__footer-text" :delay="0.4">
        <p>
          AVATR is the result of Changan Automobile's manufacturing expertise, Huawei's
          intelligent technology, and CATL's next-generation battery innovation — united to
          redefine what an electric vehicle can be.
        </p>
      </ScrollReveal>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from './SectionHeading.vue'
import ScrollReveal from './ScrollReveal.vue'
import TiltCard from './TiltCard.vue'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)
const line1 = ref(null)
const line2 = ref(null)
let ctx = null

const cards = [
  {
    svg: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="14" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="20" cy="20" r="6" stroke="currentColor" stroke-width="1.2"/>
      <path d="M20 6V12M20 28V34M6 20H12M28 20H34" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M10 10L14 14M26 26L30 30M30 10L26 14M14 26L10 30" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
    title: 'Manufacturing',
    text: 'Decades of automotive engineering excellence and world-class production capabilities.',
    partner: 'Changan Automobile',
  },
  {
    svg: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="14" r="3" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="10" cy="28" r="3" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="30" cy="28" r="3" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="32" cy="12" r="2" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <circle cx="8" cy="16" r="2" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <path d="M20 17V22M13 26L18 17M27 26L22 17" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M30 14L22 15M10 18L18 16" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
      <rect x="16" y="22" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/>
    </svg>`,
    title: 'Intelligence',
    text: 'HarmonyOS smart cockpit and ADS 2.0 autonomous driving — technology that thinks ahead.',
    partner: 'Huawei',
  },
  {
    svg: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="12" width="20" height="16" rx="3" stroke="currentColor" stroke-width="1.2"/>
      <rect x="30" y="18" width="4" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/>
      <path d="M18 17L15 22H20L17 27" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M24 16V24" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      <path d="M14 20H16M14 23H16" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" opacity="0.3"/>
    </svg>`,
    title: 'Power',
    text: 'CTP battery technology delivering class-leading range, safety, and charging speed.',
    partner: 'CATL',
  },
]

onMounted(() => {
  if (!section.value) return

  ctx = gsap.context(() => {
    // Animate connecting lines drawing on scroll
    if (line1.value && line2.value) {
      gsap.to([line1.value, line2.value], {
        strokeDashoffset: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section.value,
          start: 'top 60%',
          once: true,
        },
      })
    }
  }, section.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.brand-story {
  background-color: var(--color-surface);
}

.brand-story__flow {
  margin-bottom: -20px;
  padding: 0 2rem;
}

.brand-story__flow-svg {
  width: 100%;
  height: 60px;
}

@media (max-width: 768px) {
  .brand-story__flow {
    display: none;
  }
}

.brand-story__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
}

@media (max-width: 768px) {
  .brand-story__cards {
    grid-template-columns: 1fr;
    gap: var(--gap-md);
  }
}

.brand-story__card-inner {
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--color-bg);
  border: 1px solid rgba(200, 169, 110, 0.06);
  border-radius: 8px;
  min-height: 280px;
  transition: border-color var(--duration-fast) ease;
}

.brand-story__card-inner:hover {
  border-color: rgba(200, 169, 110, 0.15);
}

.brand-story__icon {
  color: var(--color-accent);
  opacity: 0.7;
  line-height: 0;
}

.brand-story__card-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text);
}

.brand-story__card-text {
  font-size: var(--text-body);
  color: var(--color-muted);
  line-height: 1.7;
  flex: 1;
}

.brand-story__card-partner {
  font-size: var(--text-small);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  font-weight: 500;
}

.brand-story__emblem-wrap {
  display: flex;
  justify-content: center;
  margin-top: var(--gap-lg);
}

.brand-story__emblem {
  width: 48px;
  height: auto;
  opacity: 0.08;
  filter: brightness(2);
}

.brand-story__footer-text {
  margin-top: var(--gap-md);
  text-align: center;
}

.brand-story__footer-text p {
  font-size: var(--text-body);
  color: var(--color-muted);
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto;
}
</style>
