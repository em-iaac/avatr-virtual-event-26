<template>
  <section ref="section" class="stats section" id="performance">
    <!-- Faded car silhouette background -->
    <div class="stats__car-bg">
      <img :src="carBg" alt="" class="stats__car-bg-img" />
    </div>

    <div class="section__inner">
      <SectionHeading
        title="Performance"
        subtitle="Numbers that move you"
      />

      <div class="stats__grid">
        <ScrollReveal
          v-for="(stat, i) in stats"
          :key="i"
          :delay="i * 0.1"
          class="stats__item"
        >
          <!-- Circular gauge -->
          <div class="stats__gauge">
            <svg class="stats__gauge-svg" viewBox="0 0 120 120">
              <!-- Track ring -->
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="rgba(200, 169, 110, 0.08)"
                stroke-width="3"
              />
              <!-- Progress ring -->
              <circle
                :ref="el => gaugeRefs[i] = el"
                cx="60" cy="60" r="52"
                fill="none"
                stroke="var(--color-accent)"
                stroke-width="3"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference"
                transform="rotate(-90 60 60)"
                class="stats__gauge-ring"
              />
              <!-- Tick marks -->
              <g opacity="0.15">
                <line v-for="t in 12" :key="t"
                  :x1="60 + 46 * Math.cos((t * 30 - 90) * Math.PI / 180)"
                  :y1="60 + 46 * Math.sin((t * 30 - 90) * Math.PI / 180)"
                  :x2="60 + 50 * Math.cos((t * 30 - 90) * Math.PI / 180)"
                  :y2="60 + 50 * Math.sin((t * 30 - 90) * Math.PI / 180)"
                  stroke="var(--color-accent)"
                  stroke-width="1"
                />
              </g>
            </svg>
            <div class="stats__value">
              <span ref="counterRefs" class="stats__number" :data-target="stat.value">0</span>
              <span class="stats__unit">{{ stat.unit }}</span>
            </div>
          </div>
          <span class="stats__label">{{ stat.label }}</span>
          <span class="stats__desc">{{ stat.description }}</span>
          <div class="stats__accent-line"></div>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from './SectionHeading.vue'
import ScrollReveal from './ScrollReveal.vue'
import carBg from '../assets/avatr-012.png'

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)
const counterRefs = ref([])
const gaugeRefs = ref([])
let ctx = null

const circumference = 2 * Math.PI * 52 // ~326.73

const stats = [
  { value: 3.9, unit: 's', label: '0–100 km/h', description: 'Blistering acceleration', fill: 0.95 },
  { value: 700, unit: 'km', label: 'CLTC Range', description: 'Go the distance', fill: 0.85 },
  { value: 578, unit: 'HP', label: 'Peak Power', description: 'Dual-motor AWD', fill: 0.78 },
  { value: 730, unit: 'Nm', label: 'Peak Torque', description: 'Instant response', fill: 0.88 },
]

onMounted(() => {
  if (!section.value) return

  ctx = gsap.context(() => {
    counterRefs.value.forEach((el, i) => {
      if (!el) return
      const target = parseFloat(el.dataset.target)
      const isDecimal = target % 1 !== 0
      const gaugeEl = gaugeRefs.value[i]
      const fillAmount = stats[i].fill

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          // Animate number
          const obj = { val: 0 }
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val)
            },
          })

          // Animate gauge ring
          if (gaugeEl) {
            gsap.to(gaugeEl, {
              strokeDashoffset: circumference * (1 - fillAmount),
              duration: 2,
              ease: 'power2.out',
            })
          }
        },
      })
    })
  }, section.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.stats {
  background-color: var(--color-bg);
  position: relative;
  overflow: hidden;
}

.stats__car-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(600px, 80vw, 1000px);
  opacity: 0.035;
  pointer-events: none;
  mask-image: radial-gradient(ellipse 70% 70% at center, black 0%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at center, black 0%, transparent 100%);
}

.stats__car-bg-img {
  width: 100%;
  height: auto;
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap-md);
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stats__item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--glass-radius);
  box-shadow: var(--glass-shadow);
  position: relative;
  overflow: hidden;
  transition: background var(--duration-fast) ease,
              border-color var(--duration-fast) ease,
              box-shadow var(--duration-fast) ease,
              transform var(--duration-fast) ease;
}

.stats__item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--glass-shine);
  pointer-events: none;
  border-radius: inherit;
}

.stats__item:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  box-shadow: var(--glass-shadow-hover);
  transform: translateY(-4px);
}

.stats__gauge {
  position: relative;
  width: clamp(100px, 15vw, 130px);
  height: clamp(100px, 15vw, 130px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.stats__gauge-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.stats__gauge-ring {
  transition: stroke-dashoffset 0.1s ease;
}

.stats__value {
  display: flex;
  align-items: baseline;
  gap: 3px;
  position: relative;
  z-index: 1;
}

.stats__number {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.stats__unit {
  font-family: var(--font-display);
  font-size: var(--text-body);
  font-weight: 400;
  color: var(--color-accent);
}

.stats__label {
  font-size: var(--text-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  font-weight: 500;
}

.stats__desc {
  font-size: var(--text-small);
  color: var(--color-muted);
  letter-spacing: 0.05em;
}

.stats__accent-line {
  width: 24px;
  height: 1px;
  background: var(--color-accent);
  opacity: 0.3;
  margin-top: 8px;
}
</style>
