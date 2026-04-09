<template>
  <section class="hero" id="hero">

    <!-- ── Ambient glow layers ── -->
    <div class="hero__glow hero__glow--center"></div>
    <div class="hero__glow hero__glow--edge"></div>

    <!-- ── Background: faded AVATR emblem ── -->
    <div class="hero__emblem-bg" ref="emblemBg">
      <img :src="emblemWhite" alt="" class="hero__emblem-img" />
    </div>

    <!-- ── Particle constellation ── -->
    <canvas ref="particles" class="hero__particles"></canvas>

    <!-- ── Faded car silhouette (barely visible — teaser) ── -->
    <div class="hero__car-silhouette" ref="carSilhouette">
      <img :src="carImage" alt="" class="hero__car-img" />
    </div>

    <!-- ── Phase: PRE-EVENT ── -->
    <div v-if="phase === 'pre'" class="hero__content" ref="content">
      <div class="hero__eyebrow">{{ EVENT.tagline }}</div>

      <div class="hero__wordmark" ref="wordmark">
        <img :src="textLogoWhite" alt="AVATR" class="hero__logo-img" />
      </div>

      <div class="hero__divider-wrap">
        <span class="hero__divider-dot"></span>
        <span class="hero__divider-line"></span>
        <span class="hero__divider-dot"></span>
      </div>

      <h1 class="hero__headline" ref="headline">
        <span class="hero__headline-line">Something</span>
        <span class="hero__headline-line hero__headline-line--accent">is arriving.</span>
      </h1>

      <p class="hero__subline">Premiering May 1, 2026 &middot; 8:00 PM Kuwait</p>

      <CountdownTimer class="hero__countdown" @complete="onCountdownComplete" />

      <div class="hero__actions">
        <MagneticButton class="hero__cta" @click="scrollToRSVP">
          Reserve Your Seat
        </MagneticButton>
        <a :href="BRAND.social.youtube" target="_blank" rel="noopener" class="hero__yt-link">
          <svg viewBox="0 0 24 24" fill="currentColor" class="hero__yt-icon">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z"/>
          </svg>
          Set Reminder on YouTube
        </a>
      </div>
    </div>

    <!-- ── Phase: LIVE ── -->
    <div v-else-if="phase === 'live'" class="hero__live" ref="content">
      <div class="hero__live-badge">
        <span class="hero__live-dot"></span>
        LIVE NOW
      </div>
      <div class="hero__wordmark hero__wordmark--sm">
        <img :src="textLogoWhite" alt="AVATR" class="hero__logo-img hero__logo-img--sm" />
      </div>
      <h1 class="hero__live-title">The Moment Is Now.</h1>
      <VideoPlayer :video-id="EVENT.videoId" class="hero__player" />
    </div>

    <!-- ── Phase: POST-EVENT ── -->
    <div v-else class="hero__post" ref="content">
      <div class="hero__wordmark hero__wordmark--sm">
        <img :src="textLogoWhite" alt="AVATR" class="hero__logo-img hero__logo-img--sm" />
      </div>
      <h1 class="hero__post-title">The Future Has Arrived.</h1>
      <p class="hero__post-sub">Watch the full premiere below.</p>
      <VideoPlayer :video-id="EVENT.videoId" class="hero__player" />
      <MagneticButton class="hero__cta hero__cta--post" @click="scrollToRSVP">
        Book Your Test Drive
      </MagneticButton>
    </div>

    <!-- ── Scroll indicator ── -->
    <div v-if="phase === 'pre'" class="hero__scroll-hint">
      <svg class="hero__chevron" width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M2 2L10 10L18 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="hero__scroll-line"></div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { EVENT, BRAND, getEventPhase } from '../config.js'
import CountdownTimer from './CountdownTimer.vue'
import VideoPlayer from './VideoPlayer.vue'
import MagneticButton from './MagneticButton.vue'

import textLogoWhite from '../assets/avatr-text-logo-white.png'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'
import carImage from '../assets/avatr-011.png'

const phase = ref(getEventPhase())
const wordmark = ref(null)
const content = ref(null)
const headline = ref(null)
const carSilhouette = ref(null)
const emblemBg = ref(null)
const particles = ref(null)

let animFrame = null
let particleList = []

function onCountdownComplete() {
  phase.value = getEventPhase()
}

function scrollToRSVP() {
  const el = document.getElementById('signup')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  window.__avatrSound?.playClick()
}

// ── Constellation particle system ──
function initParticles() {
  const canvas = particles.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // Spawn sparse constellation dots
  const count = 60
  for (let i = 0; i < count; i++) {
    particleList.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.3,
      ox: Math.random() * window.innerWidth,
      oy: Math.random() * window.innerHeight,
      speed: Math.random() * 0.0004 + 0.0001,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.3 + 0.05,
    })
  }

  let t = 0
  const draw = () => {
    animFrame = requestAnimationFrame(draw)
    t += 0.5
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections between close particles
    for (let i = 0; i < particleList.length; i++) {
      const p = particleList[i]
      p.x = p.ox + Math.sin(t * p.speed * 100 + p.phase) * 80
      p.y = p.oy + Math.cos(t * p.speed * 80 + p.phase) * 50

      for (let j = i + 1; j < particleList.length; j++) {
        const q = particleList[j]
        const dx = p.x - q.x
        const dy = p.y - q.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.strokeStyle = `rgba(200,169,110,${0.04 * (1 - dist / 120)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Draw dot
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      const glow = Math.sin(t * p.speed * 200 + p.phase) * 0.5 + 0.5
      ctx.fillStyle = `rgba(200,169,110,${p.opacity * 0.5 + glow * p.opacity * 0.5})`
      ctx.fill()
    }
  }
  draw()
}

onMounted(() => {
  initParticles()

  // Entrance animation
  const tl = gsap.timeline({ delay: 0.6 })
  tl.from(emblemBg.value, { opacity: 0, scale: 1.1, duration: 2.5, ease: 'power2.out' })
  tl.from(carSilhouette.value, { opacity: 0, y: 30, duration: 1.5, ease: 'power3.out' }, '-=2')

  if (content.value) {
    tl.from(content.value.children, {
      opacity: 0,
      y: 28,
      filter: 'blur(8px)',
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
    }, '-=1.5')
  }
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
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

/* ── Glow layers ── */
.hero__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.hero__glow--center {
  top: 40%;
  left: 50%;
  width: 900px;
  height: 900px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(200,169,110,0.06) 0%, rgba(200,169,110,0.02) 40%, transparent 70%);
  animation: goldBreathe 8s ease-in-out infinite;
}
.hero__glow--edge {
  bottom: -20%;
  right: -15%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(180,210,255,0.025) 0%, transparent 70%);
}

/* ── Emblem background ── */
.hero__emblem-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(280px, 48vw, 560px);
  pointer-events: none;
  opacity: 0.04;
  animation: emblemFloat 24s ease-in-out infinite;
}
.hero__emblem-img {
  width: 100%;
  height: auto;
}
@keyframes emblemFloat {
  0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
  50% { transform: translate(-50%, -53%) scale(1.04) rotate(1deg); }
}

/* ── Particle canvas ── */
.hero__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

/* ── Car silhouette (barely visible teaser) ── */
.hero__car-silhouette {
  position: absolute;
  bottom: -8%;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(700px, 90vw, 1300px);
  pointer-events: none;
  opacity: 0.06;
  mask-image: linear-gradient(to top, transparent 0%, black 25%, black 55%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, transparent 0%, black 25%, black 55%, transparent 100%);
  z-index: 1;
}
.hero__car-img { width: 100%; height: auto; }

/* ── Main content ── */
.hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  padding: 2rem;
  max-width: 860px;
}

/* Eyebrow tagline */
.hero__eyebrow {
  font-family: var(--font-display);
  font-size: clamp(0.65rem, 1.5vw, 0.8rem);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-accent-dim);
  font-weight: 500;
}

/* Wordmark */
.hero__wordmark {
  display: flex;
  justify-content: center;
}
.hero__logo-img {
  height: clamp(38px, 7vw, 62px);
  width: auto;
}
.hero__logo-img--sm { height: clamp(22px, 4vw, 34px); }

/* Diamond divider */
.hero__divider-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hero__divider-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  opacity: 0.5;
}
.hero__divider-dot {
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  opacity: 0.7;
}

/* Headline */
.hero__headline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: -0.01em;
}
.hero__headline-line--accent {
  color: var(--color-accent);
  font-style: italic;
  font-weight: 400;
}

/* Subline */
.hero__subline {
  font-size: var(--text-caption);
  letter-spacing: 0.12em;
  color: var(--color-muted);
  text-transform: uppercase;
}

/* Countdown spacing */
.hero__countdown { margin-top: 8px; }

/* CTA row */
.hero__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

.hero__yt-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-caption);
  letter-spacing: 0.08em;
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.3s;
}
.hero__yt-link:hover { color: var(--color-accent); }
.hero__yt-icon { width: 16px; height: 16px; }

/* ── LIVE state ── */
.hero__live {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 960px;
}
.hero__live-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: #ff4444;
  font-weight: 600;
}
.hero__live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4444;
  box-shadow: 0 0 8px #ff444488;
  animation: livePulse 1.2s ease-in-out infinite;
}
@keyframes livePulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}
.hero__live-title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 300;
  letter-spacing: 0.04em;
}

/* ── POST state ── */
.hero__post {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 960px;
}
.hero__post-title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 300;
  letter-spacing: 0.04em;
}
.hero__post-sub {
  color: var(--color-muted);
  font-size: var(--text-body);
}
.hero__cta--post { margin-top: 16px; }

/* ── Shared video player ── */
.hero__player { width: 100%; }

/* ── Scroll hint ── */
.hero__scroll-hint {
  position: absolute;
  bottom: 28px;
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
  opacity: 0.4;
  animation: chevronBounce 2.2s ease-in-out infinite;
}
@keyframes chevronBounce {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(7px); opacity: 0.65; }
}
.hero__scroll-line {
  width: 1px;
  height: 36px;
  background: linear-gradient(to bottom, var(--color-accent), transparent);
  opacity: 0.35;
}
</style>
