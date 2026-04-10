<template>
  <Transition name="host-slide">
    <aside v-if="visible" class="host" aria-live="polite">
      <div class="host__body glass-panel glass-panel--deep">
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
            <span class="host__role">Host</span>
            <button class="host__close-btn" title="Dismiss" @click="dismiss">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" class="host__close-icon">
                <line x1="5" y1="5" x2="15" y2="15" />
                <line x1="15" y1="5" x2="5" y2="15" />
              </svg>
            </button>
          </div>
          <p class="host__message">{{ message }}</p>
          <div class="host__chips">
            <span v-for="tip in tips" :key="tip" class="host__chip">{{ tip }}</span>
          </div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const visible = ref(false)
const dismissed = ref(false)

const message = 'Welcome to the AVATR virtual experience. Explore interactive rooms — discover the brand story, reveal the car in 3D, watch the premiere, and unlock an exclusive invitation by completing the quiz.'
const tips = ['Explore each room', 'Complete the quiz to unlock the invitation']

function dismiss() {
  visible.value = false
  dismissed.value = true
  window.speechSynthesis?.cancel()
}

function speakMessage(text) {
  if (!window.speechSynthesis) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.92
  utterance.pitch = 1.05
  utterance.volume = 0.7

  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  ) || voices.find(v =>
    v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google'))
  ) || voices.find(v => v.lang.startsWith('en'))

  if (preferred) utterance.voice = preferred

  window.speechSynthesis.speak(utterance)
}

// Show only in the lobby, once per session
watch(() => route?.name, (roomName) => {
  if (roomName === 'lobby' && !dismissed.value && !sessionStorage.getItem('avatr-host-shown')) {
    sessionStorage.setItem('avatr-host-shown', '1')
    setTimeout(() => {
      visible.value = true
      speakMessage(message)
    }, 1000)
  } else if (roomName !== 'lobby') {
    visible.value = false
    window.speechSynthesis?.cancel()
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
  width: min(400px, calc(100vw - 40px));
}

.host__body {
  width: 100%;
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 14px;
  padding: 18px;
  align-items: start;
  text-align: left;
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
  gap: 10px;
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

.host__close-btn {
  margin-left: auto;
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-muted);
  transition: color 0.2s ease;
}

.host__close-btn:hover {
  color: var(--color-accent);
}

.host__close-icon {
  width: 14px;
  height: 14px;
}

.host__message {
  color: var(--color-text);
  font-size: 0.86rem;
  line-height: 1.5;
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

/* Slide-in transition */
.host-slide-enter-active {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
}
.host-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.25s ease;
}
.host-slide-enter-from {
  transform: translateY(30px);
  opacity: 0;
}
.host-slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
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
