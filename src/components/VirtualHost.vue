<template>
  <Transition name="host-fade">
    <div v-if="visible" class="host-overlay" @click.self="dismiss">
      <div class="host-card glass-panel glass-panel--deep">
        <!-- Close button -->
        <button class="host-card__close" title="Dismiss" @click="dismiss">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
            <line x1="5" y1="5" x2="15" y2="15" />
            <line x1="15" y1="5" x2="5" y2="15" />
          </svg>
        </button>

        <!-- Host figure -->
        <div class="host-card__figure">
          <div class="host-card__halo"></div>
          <img :src="hostFigure" alt="Event Host" class="host-card__image" />
        </div>

        <!-- Label -->
        <div class="host-card__label">
          <span class="host-card__name">Ava</span>
          <span class="host-card__role">Your Host</span>
        </div>

        <!-- Message -->
        <p class="host-card__message">{{ message }}</p>

        <!-- Tips -->
        <div class="host-card__chips">
          <span v-for="tip in tips" :key="tip" class="host-card__chip">{{ tip }}</span>
        </div>

        <!-- Dismiss button -->
        <button class="host-card__dismiss" @click="dismiss">Enter the Experience</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import hostFigure from '../assets/host-figure-logo.png'
import hostSpeechUrl from '../assets/host-speech.mp3'

const route = useRoute()
const visible = ref(false)
const dismissed = ref(false)
let audio = null

const message = 'Welcome to the AVATR virtual experience. Explore interactive rooms — discover the brand story, reveal the car in 3D, watch the premiere, and unlock an exclusive invitation by completing the quiz.'
const tips = ['Explore each room', 'Complete the quiz to unlock the invitation']

function playNarration() {
  audio = new Audio(hostSpeechUrl)
  audio.volume = 0.8
  audio.play().catch(() => {})
}

function stopNarration() {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
    audio = null
  }
}

function dismiss() {
  visible.value = false
  dismissed.value = true
  stopNarration()
}

// Show only in the lobby, once per session
watch(() => route?.name, (roomName) => {
  if (roomName === 'lobby' && !dismissed.value && !sessionStorage.getItem('avatr-host-shown')) {
    sessionStorage.setItem('avatr-host-shown', '1')
    setTimeout(() => {
      visible.value = true
      playNarration()
    }, 1000)
  } else if (roomName !== 'lobby') {
    visible.value = false
    stopNarration()
  }
}, { immediate: true })

onUnmounted(() => {
  stopNarration()
})
</script>

<style scoped>
.host-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 6, 8, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 20px;
}

.host-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 48px 40px 36px;
  text-align: center;
  max-width: 440px;
  width: 100%;
}

.host-card__close {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-muted);
  transition: color 0.2s ease;
}

.host-card__close:hover {
  color: var(--color-accent);
}

/* Host figure with halo */
.host-card__figure {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.host-card__halo {
  position: absolute;
  inset: -16px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,169,110,0.15), transparent 70%);
  animation: hostHalo 3.6s ease-in-out infinite;
}

.host-card__image {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  filter: drop-shadow(0 0 20px rgba(200,169,110,0.2));
}

@keyframes hostHalo {
  0%, 100% { transform: scale(0.92); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
}

/* Label */
.host-card__label {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.host-card__name {
  font-family: var(--font-display);
  font-size: 1.3rem;
  letter-spacing: 0.06em;
  color: var(--color-text);
}

.host-card__role {
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent);
}

/* Message */
.host-card__message {
  color: var(--color-text);
  font-size: 0.92rem;
  line-height: 1.6;
  max-width: 360px;
  opacity: 0.9;
}

/* Chips */
.host-card__chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.host-card__chip {
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(200,169,110,0.14);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
}

/* Dismiss CTA */
.host-card__dismiss {
  margin-top: 8px;
  padding: 14px 36px;
  font-family: var(--font-display);
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-bg);
  background: var(--color-accent);
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.host-card__dismiss:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}

/* Overlay transition */
.host-fade-enter-active {
  transition: opacity 0.5s ease;
}
.host-fade-leave-active {
  transition: opacity 0.3s ease;
}
.host-fade-enter-from,
.host-fade-leave-to {
  opacity: 0;
}

.host-fade-enter-active .host-card {
  animation: hostCardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes hostCardIn {
  from { opacity: 0; transform: translateY(24px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 600px) {
  .host-card {
    padding: 36px 24px 28px;
  }

  .host-card__figure {
    width: 90px;
    height: 90px;
  }

  .host-card__message {
    font-size: 0.85rem;
  }
}
</style>
