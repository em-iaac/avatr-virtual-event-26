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
          <button
            class="host__mute-btn"
            :title="voiceMuted ? 'Unmute Ava' : 'Mute Ava'"
            @click.stop="toggleMute"
          >
            <svg v-if="!voiceMuted" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" class="host__mute-icon">
              <path d="M9 4L5 7H2v6h3l4 3V4z"/>
              <path d="M13 7a4 4 0 010 6"/>
            </svg>
            <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" class="host__mute-icon">
              <path d="M9 4L5 7H2v6h3l4 3V4z"/>
              <line x1="15" y1="7" x2="11" y2="13"/>
              <line x1="11" y1="7" x2="15" y2="13"/>
            </svg>
          </button>
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
import { computed, ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const expanded = ref(false)
const voiceMuted = ref(false)
const spokenRooms = new Set()

const messages = {
  lobby: {
    text: 'Welcome to the AVATR experience. Choose a room from the emblem map to begin your journey.',
    tips: ['Explore each room', 'Complete the quiz to unlock the invitation'],
  },
  'waiting-room': {
    text: 'This is the waiting room. Explore the brand story, test your reflexes, and discover your AVATR match.',
    tips: ['Try the speed challenge', 'Complete the quiz to unlock a special room'],
  },
  'reveal-room': {
    text: 'Welcome to the reveal chamber. Drag to rotate the model. Move your cursor to sweep light across the bodywork. Toggle the lights to see it fully.',
    tips: ['Drag to rotate', 'Move cursor to reveal surfaces', 'Toggle lights on'],
  },
  'watching-room': {
    text: 'The premiere theater. The show begins on May 1st at 8 PM Kuwait time.',
    tips: ['Set your YouTube reminder', 'Share the event'],
  },
  invitation: {
    text: 'Congratulations — you have earned your invitation. Reserve your seat and explore exclusive content.',
    tips: ['Claim your invite card', 'Discover hidden specs'],
  },
}

const activeMessage = computed(() => {
  const roomName = route?.name || 'lobby'
  return messages[roomName] || messages.lobby
})

const currentText = computed(() => activeMessage.value?.text || '')

function toggleExpanded() {
  expanded.value = !expanded.value
  window.__avatrSound?.playClick()
}

function toggleMute() {
  voiceMuted.value = !voiceMuted.value
  if (voiceMuted.value) {
    window.speechSynthesis?.cancel()
  }
}

function speakMessage(text) {
  if (voiceMuted.value || !window.speechSynthesis) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.92
  utterance.pitch = 1.05
  utterance.volume = 0.7

  // Try to pick a natural female voice
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  ) || voices.find(v =>
    v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google'))
  ) || voices.find(v => v.lang.startsWith('en'))

  if (preferred) utterance.voice = preferred

  window.speechSynthesis.speak(utterance)
}

// Watch route changes to speak contextually
watch(() => route?.name, (newRoom) => {
  if (!newRoom) return

  // Only speak once per room per session
  const key = `ava-spoke-${newRoom}`
  if (spokenRooms.has(key) || sessionStorage.getItem(key)) return

  spokenRooms.add(key)
  sessionStorage.setItem(key, '1')

  const msg = messages[newRoom]
  if (msg) {
    // Small delay to let the room transition finish
    setTimeout(() => speakMessage(msg.text), 800)
  }
}, { immediate: true })

onUnmounted(() => {
  window.speechSynthesis?.cancel()
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

.host__mute-btn {
  margin-left: auto;
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-muted);
  transition: color 0.2s ease;
}

.host__mute-btn:hover {
  color: var(--color-accent);
}

.host__mute-icon {
  width: 16px;
  height: 16px;
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
