<template>
  <!-- Full host overlay -->
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

        <!-- Message lines -->
        <div class="host-card__message">
          <p v-for="(line, i) in messageLines" :key="i" :class="{ 'host-card__line--ar': isArabic(line) }">{{ line }}</p>
        </div>

        <!-- Dismiss button -->
        <button class="host-card__dismiss" @click="dismiss">Enter the Experience</button>
      </div>
    </div>
  </Transition>

  <!-- Mini host button (visible after first dismiss, lobby only) -->
  <Transition name="mini-pop">
    <button
      v-if="showMini"
      class="host-mini"
      title="Talk to Ava"
      @click="reopen"
    >
      <div class="host-mini__halo"></div>
      <img :src="hostFigure" alt="Ava" class="host-mini__image" />
    </button>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import hostFigure from '../assets/host-figure-logo.png'
import hostSpeechUrl from '../assets/host-speech.mp3'

const route = useRoute()
const visible = ref(false)
const hasBeenShown = ref(false)
let audio = null

const messageLines = [
  "مرحبا! I'm Ava — your guide to the Avatr Virtual Experience. \u{1F44B}",
  "Welcome to a world where emotional intelligence meets motion, and every detail is designed to delight.",
  "أهلاً وسهلاً — tonight, you're not just watching. You're exploring. Ahead of you are rooms to discover, games to play, surprises hidden along the way, and a reveal that Kuwait has been waiting for.",
  "Take your time. Tap, scroll, compete on the leaderboard — and share the journey with friends. أحلى التجارب ما تنعاش لحالك.",
  "The countdown is ticking. The premiere is coming.",
  "هل بتكون من الحضور؟",
  "Intelligent Luxury. Motion in Delight.",
  "يلا، نبدأ. \u{2726}",
]

function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text.charAt(0))
}

// Show the mini button when overlay is closed and we're in the lobby
const showMini = computed(() => !visible.value && hasBeenShown.value && route?.name === 'lobby')

function playNarration() {
  stopNarration()
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
  hasBeenShown.value = true
  stopNarration()
}

function reopen() {
  visible.value = true
  playNarration()
}

// Auto-show in the lobby once per session
watch(() => route?.name, (roomName) => {
  if (roomName === 'lobby' && !hasBeenShown.value && !sessionStorage.getItem('avatr-host-shown')) {
    sessionStorage.setItem('avatr-host-shown', '1')
    setTimeout(() => {
      visible.value = true
      hasBeenShown.value = true
      playNarration()
    }, 1000)
  } else if (roomName === 'lobby' && !hasBeenShown.value) {
    // Returning to lobby after session storage was set (e.g. page reload)
    hasBeenShown.value = true
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
/* ── Full overlay ── */
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
  overflow-y: auto;
}

.host-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 48px 40px 36px;
  text-align: center;
  max-width: 480px;
  width: 100%;
  margin: auto;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.host-card__message p {
  color: var(--color-text);
  font-size: 0.88rem;
  line-height: 1.65;
  opacity: 0.9;
  margin: 0;
}

.host-card__line--ar {
  direction: rtl;
  font-size: 0.92rem;
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

/* ── Mini host button ── */
.host-mini {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 120;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(200,169,110,0.25);
  background: rgba(10, 10, 14, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.host-mini:hover {
  border-color: rgba(200,169,110,0.6);
  transform: scale(1.08);
  box-shadow: 0 0 20px rgba(200,169,110,0.15);
}

.host-mini__halo {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,169,110,0.1), transparent 70%);
  animation: miniHalo 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes miniHalo {
  0%, 100% { transform: scale(0.9); opacity: 0.4; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

.host-mini__image {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 50%;
  filter: drop-shadow(0 0 8px rgba(200,169,110,0.15));
}

/* ── Overlay transition ── */
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

/* ── Mini button transition ── */
.mini-pop-enter-active {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}
.mini-pop-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.mini-pop-enter-from {
  transform: scale(0.5);
  opacity: 0;
}
.mini-pop-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

@media (max-width: 600px) {
  .host-card {
    padding: 36px 24px 28px;
  }

  .host-card__figure {
    width: 90px;
    height: 90px;
  }

  .host-card__message p {
    font-size: 0.82rem;
  }

  .host-mini {
    bottom: 16px;
    left: 16px;
    width: 46px;
    height: 46px;
  }

  .host-mini__image {
    width: 30px;
    height: 30px;
  }
}
</style>
