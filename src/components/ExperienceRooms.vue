<template>
  <section class="rooms section" id="experience">
    <div class="section__inner">
      <SectionHeading
        title="Choose Your Room"
        subtitle="Treat the site like an event space, not a long landing page."
      />

      <div class="rooms__grid">
        <button
          v-for="room in rooms"
          :key="room.id"
          class="rooms__card glass-panel glass-panel--deep"
          :class="{ 'rooms__card--mystery': room.mystery }"
          type="button"
          @click="enterRoom(room)"
        >
          <div class="rooms__icon">
            <svg v-if="room.icon === 'reveal'" viewBox="0 0 48 48" fill="none">
              <path d="M24 3 L44 24 L24 45 L4 24 Z" stroke="currentColor" stroke-width="1.2"/>
              <path d="M14 24H34" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            <svg v-else-if="room.icon === 'play'" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="32" height="24" rx="12" stroke="currentColor" stroke-width="1.2"/>
              <path d="M16 24H24" stroke="currentColor" stroke-width="1.2"/>
              <path d="M20 20V28" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="31" cy="21" r="2" fill="currentColor"/>
              <circle cx="34" cy="26" r="2" fill="currentColor"/>
            </svg>
            <svg v-else-if="room.icon === 'story'" viewBox="0 0 48 48" fill="none">
              <path d="M10 10H38V38H10Z" stroke="currentColor" stroke-width="1.2"/>
              <path d="M18 18H30" stroke="currentColor" stroke-width="1.2"/>
              <path d="M18 24H30" stroke="currentColor" stroke-width="1.2"/>
              <path d="M18 30H26" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            <svg v-else viewBox="0 0 48 48" fill="none">
              <path d="M24 4 L40 24 L24 44 L8 24 Z" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3"/>
              <circle cx="24" cy="24" r="4" fill="currentColor"/>
            </svg>
          </div>

          <div class="rooms__eyebrow">{{ room.eyebrow }}</div>
          <h3 class="rooms__title">{{ room.title }}</h3>
          <p class="rooms__text">{{ room.text }}</p>
          <span class="rooms__cta">{{ room.cta }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from './SectionHeading.vue'

const rooms = [
  {
    id: 'story',
    eyebrow: 'Why it exists',
    title: 'Origin Room',
    text: 'Understand the design, technology, and emotional logic behind AVATR.',
    cta: 'Enter Story Room',
    icon: 'story',
  },
  {
    id: 'reveal',
    eyebrow: 'Main attraction',
    title: 'Reveal Chamber',
    text: 'Rotate the real model, chase the light, and discover the bodywork gradually.',
    cta: 'Enter Reveal Chamber',
    icon: 'reveal',
  },
  {
    id: 'challenge',
    eyebrow: 'Play zone',
    title: 'Speed Room',
    text: 'Compete, climb the leaderboard, and share your reaction time.',
    cta: 'Enter Speed Room',
    icon: 'play',
  },
  {
    id: 'mystery',
    eyebrow: 'Not yet unlocked',
    title: 'Mystery Room',
    text: 'A hidden space for the second tease. It should feel like something is still being held back.',
    cta: 'Approach the Door',
    icon: 'mystery',
    mystery: true,
  },
]

function enterRoom(room) {
  const el = document.getElementById(room.id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.__avatrSound?.playWhoosh()
  }
}
</script>

<style scoped>
.rooms__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.rooms__card {
  min-height: 300px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 14px;
}

.rooms__card--mystery {
  background: linear-gradient(180deg, rgba(12,12,18,0.8), rgba(10,10,14,0.92));
}

.rooms__icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  color: var(--color-accent);
}

.rooms__icon svg {
  width: 100%;
  height: 100%;
}

.rooms__eyebrow {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--color-accent);
}

.rooms__title {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-weight: 500;
  letter-spacing: 0.04em;
}

.rooms__text {
  color: var(--color-muted);
  line-height: 1.6;
  flex: 1;
}

.rooms__cta {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text);
}

@media (max-width: 1180px) {
  .rooms__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .rooms__grid {
    grid-template-columns: 1fr;
  }
}
</style>
