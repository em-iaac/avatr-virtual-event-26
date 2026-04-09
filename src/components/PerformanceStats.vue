<template>
  <section ref="section" class="stats section" id="performance">
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
          <div class="stats__value">
            <span ref="counterRefs" class="stats__number" :data-target="stat.value">0</span>
            <span class="stats__unit">{{ stat.unit }}</span>
          </div>
          <span class="stats__label">{{ stat.label }}</span>
          <span class="stats__desc">{{ stat.description }}</span>
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

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)
const counterRefs = ref([])
let ctx = null

const stats = [
  { value: 3.9, unit: 's', label: '0–100 km/h', description: 'Blistering acceleration' },
  { value: 700, unit: 'km', label: 'CLTC Range', description: 'Go the distance' },
  { value: 578, unit: 'HP', label: 'Peak Power', description: 'Dual-motor AWD' },
  { value: 730, unit: 'Nm', label: 'Peak Torque', description: 'Instant response' },
]

onMounted(() => {
  if (!section.value) return

  ctx = gsap.context(() => {
    counterRefs.value.forEach((el) => {
      if (!el) return
      const target = parseFloat(el.dataset.target)
      const isDecimal = target % 1 !== 0

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 }
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val)
            },
          })
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
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap-md);
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
  padding: 32px 16px;
}

.stats__value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stats__number {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.stats__unit {
  font-family: var(--font-display);
  font-size: var(--text-h3);
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
</style>
