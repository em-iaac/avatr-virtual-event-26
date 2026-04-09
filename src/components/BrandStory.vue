<template>
  <section class="brand-story section" id="story">
    <div class="section__inner">
      <SectionHeading
        title="Born from the Future"
        subtitle="A convergence of three industry titans"
      />

      <div class="brand-story__cards">
        <ScrollReveal
          v-for="(card, i) in cards"
          :key="i"
          :delay="i * 0.15"
          class="brand-story__card"
        >
          <TiltCard>
            <div class="brand-story__card-inner">
              <div class="brand-story__icon">{{ card.icon }}</div>
              <h3 class="brand-story__card-title">{{ card.title }}</h3>
              <p class="brand-story__card-text">{{ card.text }}</p>
              <span class="brand-story__card-partner">{{ card.partner }}</span>
            </div>
          </TiltCard>
        </ScrollReveal>
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
import SectionHeading from './SectionHeading.vue'
import ScrollReveal from './ScrollReveal.vue'
import TiltCard from './TiltCard.vue'

const cards = [
  {
    icon: '&#9881;',
    title: 'Manufacturing',
    text: 'Decades of automotive engineering excellence and world-class production capabilities.',
    partner: 'Changan Automobile',
  },
  {
    icon: '&#9055;',
    title: 'Intelligence',
    text: 'HarmonyOS smart cockpit and ADS 2.0 autonomous driving — technology that thinks ahead.',
    partner: 'Huawei',
  },
  {
    icon: '&#9889;',
    title: 'Power',
    text: 'CTP battery technology delivering class-leading range, safety, and charging speed.',
    partner: 'CATL',
  },
]
</script>

<style scoped>
.brand-story {
  background-color: var(--color-surface);
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
  font-size: 1.8rem;
  line-height: 1;
  opacity: 0.6;
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

.brand-story__footer-text {
  margin-top: var(--gap-lg);
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
