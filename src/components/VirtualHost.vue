<template>
  <!-- Full host overlay -->
  <Transition name="host-fade">
    <div v-if="visible" class="host-overlay" @click.self="dismiss">
      <div class="host-layout">
        <!-- Ava figure (left / top on mobile) -->
        <div class="host-figure">
          <div class="host-figure__halo"></div>
          <img :src="hostFigure" alt="Ava" class="host-figure__image" />
          <div class="host-figure__label">
            <span class="host-figure__name">Ava</span>
            <span class="host-figure__role">Your Host</span>
          </div>
        </div>

        <!-- Speech bubble -->
        <div class="host-bubble">
          <div class="host-bubble__arrow"></div>
          <button class="host-bubble__close" title="Dismiss" @click="dismiss">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </button>

          <div class="host-bubble__body">
            <p v-for="(line, i) in messageLines" :key="i" :class="{ 'host-bubble__line--ar': isArabic(line) }">{{ line }}</p>
          </div>

          <button class="host-bubble__cta" @click="dismiss">Enter the Experience</button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Mini host button -->
  <Transition name="mini-pop">
    <button
      v-if="showMini"
      class="host-mini"
      title="Talk to Ava"
      @click="reopen"
    >
      <div class="host-mini__halo"></div>
      <img :src="hostFigure" alt="Ava" class="host-mini__image" />
      <span class="host-mini__label">Ava</span>
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
  "\u0645\u0631\u062D\u0628\u0627! I\u2019m Ava \u2014 your guide to the Avatr Virtual Experience. \u{1F44B}",
  "Welcome to a world where emotional intelligence meets motion, and every detail is designed to delight.",
  "\u0623\u0647\u0644\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B \u2014 tonight, you\u2019re not just watching. You\u2019re exploring. Ahead of you are rooms to discover, games to play, surprises hidden along the way, and a reveal that Kuwait has been waiting for.",
  "Take your time. Tap, scroll, compete on the leaderboard \u2014 and share the journey with friends. \u0623\u062D\u0644\u0649 \u0627\u0644\u062A\u062C\u0627\u0631\u0628 \u0645\u0627 \u062A\u0646\u0639\u0627\u0634 \u0644\u062D\u0627\u0644\u0643.",
  "The countdown is ticking. The premiere is coming.",
  "\u0647\u0644 \u0628\u062A\u0643\u0648\u0646 \u0645\u0646 \u0627\u0644\u062D\u0636\u0648\u0631\u061F",
  "Intelligent Luxury. Motion in Delight.",
  "\u064A\u0644\u0627\u060C \u0646\u0628\u062F\u0623. \u2726",
]

function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text.charAt(0))
}

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
/* ── Overlay ── */
.host-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 6, 8, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 24px;
  overflow-y: auto;
}

/* ── Layout: figure + bubble side by side ── */
.host-layout {
  display: flex;
  align-items: flex-start;
  gap: 0;
  max-width: 720px;
  width: 100%;
  margin: auto;
}

/* ── Ava figure ── */
.host-figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  position: relative;
  padding-top: 20px;
}

.host-figure__halo {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,169,110,0.12), transparent 70%);
  animation: hostHalo 4s ease-in-out infinite;
  pointer-events: none;
}

.host-figure__image {
  position: relative;
  width: 140px;
  height: 140px;
  object-fit: contain;
  filter: drop-shadow(0 4px 24px rgba(200,169,110,0.18));
}

.host-figure__label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.host-figure__name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.06em;
  color: var(--color-text);
}

.host-figure__role {
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
}

@keyframes hostHalo {
  0%, 100% { transform: translateX(-50%) scale(0.92); opacity: 0.4; }
  50% { transform: translateX(-50%) scale(1.1); opacity: 0.9; }
}

/* ── Speech bubble ── */
.host-bubble {
  position: relative;
  background: rgba(18, 18, 22, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(200, 169, 110, 0.18);
  border-radius: 20px 20px 20px 4px;
  padding: 28px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
  min-width: 0;
  box-shadow:
    0 8px 40px rgba(0,0,0,0.4),
    0 0 0 1px rgba(200,169,110,0.06) inset;
}

/* Arrow pointing to Ava */
.host-bubble__arrow {
  position: absolute;
  left: -10px;
  top: 40px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid rgba(18, 18, 22, 0.85);
  filter: drop-shadow(-2px 0 2px rgba(200,169,110,0.08));
}

.host-bubble__close {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-muted);
  transition: color 0.2s ease;
}

.host-bubble__close:hover {
  color: var(--color-accent);
}

/* Message text */
.host-bubble__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.host-bubble__body p {
  color: var(--color-text);
  font-size: 0.86rem;
  line-height: 1.65;
  opacity: 0.92;
  margin: 0;
}

.host-bubble__line--ar {
  direction: rtl;
  font-size: 0.9rem;
}

/* CTA */
.host-bubble__cta {
  align-self: flex-start;
  margin-top: 4px;
  padding: 12px 32px;
  font-family: var(--font-display);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-bg);
  background: var(--color-accent);
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.host-bubble__cta:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}

/* ── Mini host button ── */
.host-mini {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 120;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px 6px 6px;
  border-radius: 999px;
  border: 1px solid rgba(200,169,110,0.2);
  background: rgba(10, 10, 14, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  cursor: pointer;
  transition: border-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.host-mini:hover {
  border-color: rgba(200,169,110,0.55);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(200,169,110,0.12);
}

.host-mini__halo {
  position: absolute;
  left: -4px;
  top: -4px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,169,110,0.1), transparent 70%);
  animation: miniHalo 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes miniHalo {
  0%, 100% { transform: scale(0.9); opacity: 0.4; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.host-mini__image {
  width: 38px;
  height: 38px;
  object-fit: contain;
  border-radius: 50%;
  filter: drop-shadow(0 0 8px rgba(200,169,110,0.12));
  flex-shrink: 0;
}

.host-mini__label {
  font-family: var(--font-display);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  white-space: nowrap;
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

.host-fade-enter-active .host-bubble {
  animation: bubbleIn 0.5s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.host-fade-enter-active .host-figure {
  animation: figureIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes figureIn {
  from { opacity: 0; transform: translateY(20px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes bubbleIn {
  from { opacity: 0; transform: translateX(-16px) scale(0.95); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}

/* ── Mini button transition ── */
.mini-pop-enter-active {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}
.mini-pop-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.mini-pop-enter-from {
  transform: scale(0.5) translateY(10px);
  opacity: 0;
}
.mini-pop-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .host-overlay {
    padding: 16px;
    align-items: flex-start;
    padding-top: 60px;
  }

  .host-layout {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .host-figure {
    padding-top: 0;
  }

  .host-figure__image {
    width: 100px;
    height: 100px;
  }

  .host-figure__halo {
    width: 130px;
    height: 130px;
  }

  /* On mobile the bubble is below the figure, arrow points up */
  .host-bubble {
    border-radius: 4px 20px 20px 20px;
    padding: 24px 20px 20px;
  }

  .host-bubble__arrow {
    left: 30px;
    top: -10px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid rgba(18, 18, 22, 0.85);
    border-top: none;
  }

  .host-bubble__body p {
    font-size: 0.82rem;
  }

  .host-bubble__cta {
    align-self: center;
    width: 100%;
    text-align: center;
  }

  .host-fade-enter-active .host-bubble {
    animation: bubbleInMobile 0.5s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes bubbleInMobile {
    from { opacity: 0; transform: translateY(-12px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .host-mini {
    bottom: 16px;
    left: 16px;
    padding: 5px 12px 5px 5px;
  }

  .host-mini__image {
    width: 32px;
    height: 32px;
  }

  .host-mini__halo {
    width: 44px;
    height: 44px;
  }

  .host-mini__label {
    font-size: 0.6rem;
  }
}
</style>
