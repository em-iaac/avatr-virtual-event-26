<template>
  <section class="hero">
    <!-- Ambient glow layers -->
    <div class="hero__glow hero__glow--1"></div>
    <div class="hero__glow hero__glow--2"></div>

    <div class="hero__content">
      <!-- Pre-event state: countdown -->
      <template v-if="!eventStarted">
        <div ref="wordmark" class="hero__wordmark">AVATR</div>
        <div class="hero__divider"></div>
        <p class="hero__event-title">Virtual Event 2026</p>

        <CountdownTimer @complete="onCountdownComplete" />

        <p class="hero__premiere-label">
          Premiering May 1, 2026 &middot; 8:00 PM Kuwait
        </p>

        <MagneticButton class="hero__cta" @click="scrollToRSVP">
          Reserve Your Seat
        </MagneticButton>
      </template>

      <!-- Post-event state: video player -->
      <template v-else>
        <div ref="wordmark" class="hero__wordmark hero__wordmark--small">AVATR</div>
        <VideoPlayer :video-id="EVENT.videoId" />
      </template>
    </div>

    <!-- Scroll indicator -->
    <div v-if="!eventStarted" class="hero__scroll-hint">
      <div class="hero__scroll-line"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { EVENT } from '../config.js'
import CountdownTimer from './CountdownTimer.vue'
import VideoPlayer from './VideoPlayer.vue'
import MagneticButton from './MagneticButton.vue'

const eventStarted = ref(Date.now() >= EVENT.date.getTime())
const wordmark = ref(null)

function onCountdownComplete() {
  eventStarted.value = true
}

function scrollToRSVP() {
  const el = document.getElementById('signup')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  if (!wordmark.value) return

  // Entrance animation
  const tl = gsap.timeline({ delay: 0.3 })
  tl.from(wordmark.value, {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power3.out',
  })

  const siblings = wordmark.value.parentElement?.children
  if (siblings) {
    tl.from(
      Array.from(siblings).slice(1),
      { opacity: 0, y: 20, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      '-=0.5'
    )
  }
})
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-bg);
}

/* Ambient glow orbs */
.hero__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.hero__glow--1 {
  top: 30%;
  left: 50%;
  width: 700px;
  height: 700px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(200, 169, 110, 0.06) 0%, transparent 70%);
}

.hero__glow--2 {
  bottom: -10%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(200, 169, 110, 0.03) 0%, transparent 70%);
}

.hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  padding: 2rem;
  max-width: 800px;
}

.hero__wordmark {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--color-text);
  line-height: 1;
}

.hero__wordmark--small {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  margin-bottom: 24px;
}

.hero__divider {
  width: 60px;
  height: 1px;
  background-color: var(--color-accent);
  opacity: 0.7;
}

.hero__event-title {
  font-family: var(--font-display);
  font-size: clamp(0.9rem, 2.5vw, 1.2rem);
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.hero__premiere-label {
  font-size: var(--text-caption);
  letter-spacing: 0.1em;
  color: var(--color-muted);
  margin-top: 8px;
}

.hero__cta {
  margin-top: 16px;
}

/* Scroll indicator */
.hero__scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.hero__scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--color-accent), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
  50% { opacity: 0.8; transform: scaleY(1); }
}
</style>
