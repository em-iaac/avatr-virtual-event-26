<template>
  <section class="hero">
    <!-- Ambient glow layers -->
    <div class="hero__glow hero__glow--1"></div>
    <div class="hero__glow hero__glow--2"></div>

    <!-- Large faded emblem background -->
    <div class="hero__emblem-bg">
      <img :src="emblemWhite" alt="" class="hero__emblem-img" />
    </div>

    <!-- Faded car silhouette at bottom -->
    <div class="hero__car-silhouette">
      <img :src="carImage" alt="" class="hero__car-img" />
    </div>

    <div class="hero__content">
      <!-- Pre-event state: countdown -->
      <template v-if="!eventStarted">
        <div ref="wordmark" class="hero__wordmark">
          <img :src="textLogoWhite" alt="AVATR" class="hero__logo-img" />
        </div>
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
        <div ref="wordmark" class="hero__wordmark hero__wordmark--small">
          <img :src="textLogoWhite" alt="AVATR" class="hero__logo-img hero__logo-img--small" />
        </div>
        <VideoPlayer :video-id="EVENT.videoId" />
      </template>
    </div>

    <!-- Floating geometric diamonds -->
    <div class="hero__diamonds">
      <span v-for="i in 5" :key="i" class="hero__diamond" :style="diamondStyle(i)">
        <svg viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0 L24 15 L12 40 L0 15 Z" stroke="currentColor" stroke-width="0.5" fill="none" />
        </svg>
      </span>
    </div>

    <!-- Scroll indicator with chevron -->
    <div v-if="!eventStarted" class="hero__scroll-hint">
      <svg class="hero__chevron" width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M2 2L10 10L18 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
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

import textLogoWhite from '../assets/avatr-text-logo-white.png'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'
import carImage from '../assets/avatr-011.png'

const eventStarted = ref(Date.now() >= EVENT.date.getTime())
const wordmark = ref(null)

function onCountdownComplete() {
  eventStarted.value = true
}

function scrollToRSVP() {
  const el = document.getElementById('signup')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function diamondStyle(i) {
  const positions = [
    { top: '15%', left: '8%', size: 28, delay: 0, dur: 18 },
    { top: '25%', right: '12%', size: 20, delay: 2, dur: 22 },
    { top: '60%', left: '5%', size: 16, delay: 4, dur: 20 },
    { top: '70%', right: '8%', size: 24, delay: 1, dur: 16 },
    { top: '45%', left: '85%', size: 14, delay: 3, dur: 24 },
  ]
  const p = positions[i - 1]
  return {
    position: 'absolute',
    top: p.top,
    left: p.left || 'auto',
    right: p.right || 'auto',
    width: p.size + 'px',
    height: p.size * 1.67 + 'px',
    animationDelay: p.delay + 's',
    animationDuration: p.dur + 's',
  }
}

onMounted(() => {
  if (!wordmark.value) return

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
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(200, 169, 110, 0.07) 0%, transparent 70%);
}

.hero__glow--2 {
  bottom: -10%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(200, 169, 110, 0.04) 0%, transparent 70%);
}

/* Large emblem background */
.hero__emblem-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(300px, 50vw, 500px);
  pointer-events: none;
  opacity: 0.04;
  animation: emblemFloat 20s ease-in-out infinite;
}

.hero__emblem-img {
  width: 100%;
  height: auto;
  filter: brightness(2);
}

@keyframes emblemFloat {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -52%) scale(1.03); }
}

/* Faded car silhouette */
.hero__car-silhouette {
  position: absolute;
  bottom: -5%;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(600px, 80vw, 1100px);
  pointer-events: none;
  opacity: 0.08;
  mask-image: linear-gradient(to top, transparent 0%, black 40%, black 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, transparent 0%, black 40%, black 60%, transparent 100%);
}

.hero__car-img {
  width: 100%;
  height: auto;
}

/* Content */
.hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  padding: 2rem;
  max-width: 800px;
}

.hero__wordmark {
  display: flex;
  justify-content: center;
}

.hero__logo-img {
  height: clamp(36px, 8vw, 60px);
  width: auto;
  filter: brightness(1.1);
}

.hero__logo-img--small {
  height: clamp(20px, 4vw, 32px);
  margin-bottom: 24px;
}

.hero__divider {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  opacity: 0.8;
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

/* Floating diamonds */
.hero__diamonds {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.hero__diamond {
  color: var(--color-accent);
  opacity: 0.08;
  animation: diamondDrift 20s ease-in-out infinite;
}

@keyframes diamondDrift {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.05; }
  25% { opacity: 0.12; }
  50% { transform: translateY(-30px) rotate(5deg); opacity: 0.08; }
  75% { opacity: 0.1; }
}

/* Scroll indicator */
.hero__scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.hero__chevron {
  color: var(--color-accent);
  opacity: 0.5;
  animation: chevronBounce 2s ease-in-out infinite;
}

@keyframes chevronBounce {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(6px); opacity: 0.7; }
}

.hero__scroll-line {
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, var(--color-accent), transparent);
  opacity: 0.4;
}
</style>
