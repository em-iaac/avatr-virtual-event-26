<template>
  <aside class="host" :class="{ 'host--active': activeMessage }" aria-live="polite">
    <button class="host__body glass-panel glass-panel--deep" type="button" @click="toggleExpanded">
      <div class="host__avatar">
        <div class="host__head">
          <span class="host__eye"></span>
          <span class="host__eye"></span>
          <span class="host__mouth"></span>
        </div>
        <div class="host__halo"></div>
      </div>

      <div class="host__content">
        <div class="host__meta">
          <span class="host__name">Ava</span>
          <span class="host__role">Virtual Guide</span>
        </div>
        <p class="host__message">{{ currentText }}</p>
        <div class="host__chips" v-if="expanded && activeMessage?.tips?.length">
          <span v-for="tip in activeMessage.tips" :key="tip" class="host__chip">{{ tip }}</span>
        </div>
      </div>
    </button>
  </aside>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const expanded = ref(false)
const activeSection = ref('hero')

const messages = {
  hero: {
    text: 'Welcome to the pre-event lobby. Start with the invitation, then uncover the car, then enter the play rooms.',
    tips: ['Reserve your seat', 'Set your YouTube reminder', 'Follow the light'],
  },
  story: {
    text: 'This room explains why AVATR feels different: design, intelligence, and delight working together.',
    tips: ['Read the origin', 'Look for the design cues'],
  },
  reveal: {
    text: 'This is the reveal chamber. Drag to rotate the model. Move your cursor to sweep light across the bodywork.',
    tips: ['Drag to rotate', 'Hover to reveal surfaces', 'Scroll to unlock specs'],
  },
  experience: {
    text: 'You do not need to experience this like a long webpage. Think of it as a set of rooms you can jump between.',
    tips: ['Enter a room', 'Discover the mystery room'],
  },
  performance: {
    text: 'Here the product stops being abstract. Numbers start telling the story.',
    tips: ['Check the performance figures'],
  },
  challenge: {
    text: 'This is the play room. Beat the leaderboard, then share your time.',
    tips: ['Save your score', 'Share your result'],
  },
  quiz: {
    text: 'This room personalizes the brand. It helps visitors imagine their AVATR match.',
    tips: ['Find your match'],
  },
  mystery: {
    text: 'Mystery room is a teaser. Keep it strange. Keep it unfinished. It should feel like a second reveal is coming.',
    tips: ['Locked content', 'Future unlock'],
  },
  signup: {
    text: 'Finish with your seat reservation. This is the conversion moment.',
    tips: ['Claim your invite card'],
  },
}

const activeMessage = computed(() => messages[activeSection.value] || messages.hero)
const currentText = computed(() => activeMessage.value?.text || '')

function toggleExpanded() {
  expanded.value = !expanded.value
  window.__avatrSound?.playClick()
}

let observers = []

onMounted(() => {
  const targets = Object.keys(messages)
    .map((id) => document.getElementById(id))
    .filter(Boolean)

  targets.forEach((el) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      },
      { threshold: 0.45 }
    )
    observer.observe(el)
    observers.push(observer)
  })
})

onUnmounted(() => {
  observers.forEach((observer) => observer.disconnect())
})
</script>

<style scoped>
.host {
  position: fixed;
  left: 20px;
  bottom: 24px;
  z-index: 120;
  width: min(360px, calc(100vw - 40px));
  pointer-events: none;
}

.host__body {
  width: 100%;
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 14px;
  padding: 14px;
  align-items: start;
  text-align: left;
  pointer-events: auto;
}

.host__avatar {
  position: relative;
  width: 58px;
  height: 58px;
  margin-top: 2px;
}

.host__head {
  position: absolute;
  inset: 8px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(200,169,110,0.08));
  border: 1px solid rgba(200,169,110,0.25);
  box-shadow: 0 0 24px rgba(200,169,110,0.08);
}

.host__eye {
  position: absolute;
  top: 18px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 8px rgba(200,169,110,0.45);
}

.host__eye:first-child {
  left: 14px;
}

.host__eye:nth-child(2) {
  right: 14px;
}

.host__mouth {
  position: absolute;
  left: 50%;
  bottom: 12px;
  width: 18px;
  height: 6px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(200,169,110,0.1), rgba(200,169,110,0.55), rgba(200,169,110,0.1));
}

.host__halo {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,169,110,0.12), transparent 70%);
  animation: hostHalo 3.6s ease-in-out infinite;
}

@keyframes hostHalo {
  0%, 100% { transform: scale(0.9); opacity: 0.5; }
  50% { transform: scale(1.08); opacity: 0.9; }
}

.host__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.host__meta {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.host__name {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.06em;
  color: var(--color-text);
}

.host__role {
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.host__message {
  color: var(--color-text);
  font-size: 0.88rem;
  line-height: 1.45;
}

.host__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.host__chip {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(200,169,110,0.14);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
}

@media (max-width: 900px) {
  .host {
    left: 12px;
    right: 12px;
    bottom: 12px;
    width: auto;
  }
}
</style>
