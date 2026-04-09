<template>
  <section class="lobby">
    <!-- Ambient glow layers -->
    <div class="lobby__glow lobby__glow--center"></div>
    <div class="lobby__glow lobby__glow--edge"></div>

    <!-- Particle constellation -->
    <canvas ref="particles" class="lobby__particles"></canvas>

    <!-- Header -->
    <div class="lobby__header">
      <div class="lobby__eyebrow">{{ EVENT.tagline }}</div>
      <img :src="textLogoWhite" alt="AVATR" class="lobby__logo" />
      <p class="lobby__subtitle">{{ EVENT.subtag }}</p>
      <CountdownTimer v-if="phase === 'pre'" class="lobby__countdown" />
      <div v-else-if="phase === 'live'" class="lobby__live-badge">
        <span class="lobby__live-dot"></span>
        LIVE NOW
      </div>
    </div>

    <!-- Emblem Floorplan -->
    <div class="lobby__floorplan">
      <svg
        class="lobby__emblem-svg"
        viewBox="0 0 400 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Outer rectangle (structural frame) -->
        <rect
          x="60" y="40" width="280" height="480" rx="4"
          stroke="rgba(200,169,110,0.15)" stroke-width="1" fill="none"
        />

        <!-- Top triangle segment → Reveal Room -->
        <g
          class="lobby__segment"
          :class="{ 'lobby__segment--active': hoveredRoom === 'reveal' }"
          @mouseenter="hoveredRoom = 'reveal'"
          @mouseleave="hoveredRoom = null"
          @click="enterRoom('reveal-room')"
        >
          <path
            d="M 60 40 L 200 240 L 340 40 Z"
            class="lobby__segment-fill"
          />
          <path
            d="M 60 40 L 200 240 L 340 40"
            stroke="var(--color-accent)" stroke-width="1.2" fill="none"
            class="lobby__segment-stroke"
          />
          <text x="200" y="120" text-anchor="middle" class="lobby__room-label">Reveal</text>
          <text x="200" y="140" text-anchor="middle" class="lobby__room-sublabel">3D Model Experience</text>
        </g>

        <!-- Left segment → Waiting Room -->
        <g
          class="lobby__segment"
          :class="{ 'lobby__segment--active': hoveredRoom === 'waiting' }"
          @mouseenter="hoveredRoom = 'waiting'"
          @mouseleave="hoveredRoom = null"
          @click="enterRoom('waiting-room')"
        >
          <path
            d="M 60 40 L 200 240 L 60 520 Z"
            class="lobby__segment-fill"
          />
          <path
            d="M 60 40 L 200 240 L 60 520"
            stroke="var(--color-accent)" stroke-width="1.2" fill="none"
            class="lobby__segment-stroke"
          />
          <text x="115" y="280" text-anchor="middle" class="lobby__room-label">Waiting</text>
          <text x="115" y="300" text-anchor="middle" class="lobby__room-sublabel">Games & History</text>
        </g>

        <!-- Right segment → Watching Room -->
        <g
          class="lobby__segment"
          :class="{ 'lobby__segment--active': hoveredRoom === 'watching' }"
          @mouseenter="hoveredRoom = 'watching'"
          @mouseleave="hoveredRoom = null"
          @click="enterRoom('watching-room')"
        >
          <path
            d="M 340 40 L 200 240 L 340 520 Z"
            class="lobby__segment-fill"
          />
          <path
            d="M 340 40 L 200 240 L 340 520"
            stroke="var(--color-accent)" stroke-width="1.2" fill="none"
            class="lobby__segment-stroke"
          />
          <text x="285" y="280" text-anchor="middle" class="lobby__room-label">Premiere</text>
          <text x="285" y="300" text-anchor="middle" class="lobby__room-sublabel">Watch the Show</text>
        </g>

        <!-- Bottom triangle / diamond → Invitation Room (locked) -->
        <g
          class="lobby__segment"
          :class="{
            'lobby__segment--active': hoveredRoom === 'invitation',
            'lobby__segment--locked': !invitationUnlocked
          }"
          @mouseenter="hoveredRoom = 'invitation'"
          @mouseleave="hoveredRoom = null"
          @click="enterInvitation"
        >
          <path
            d="M 60 520 L 200 320 L 340 520 Z"
            class="lobby__segment-fill"
          />
          <path
            d="M 60 520 L 200 320 L 340 520"
            stroke="var(--color-accent)" stroke-width="1.2" fill="none"
            class="lobby__segment-stroke"
          />

          <!-- Lock icon for locked state -->
          <g v-if="!invitationUnlocked" class="lobby__lock-icon">
            <rect x="190" y="395" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.2" fill="none" />
            <path d="M194 395 V389 A6 6 0 0 1 206 389 V395" stroke="currentColor" stroke-width="1.2" fill="none" />
          </g>

          <text x="200" y="430" text-anchor="middle" class="lobby__room-label">
            {{ invitationUnlocked ? 'Invitation' : 'Locked' }}
          </text>
          <text x="200" y="450" text-anchor="middle" class="lobby__room-sublabel">
            {{ invitationUnlocked ? 'RSVP & Exclusive' : 'Complete the Quiz' }}
          </text>
        </g>

        <!-- Center diamond intersection point -->
        <path
          d="M 200 220 L 220 240 L 200 260 L 180 240 Z"
          fill="var(--color-accent)" opacity="0.2"
          class="lobby__center-diamond"
        />

        <!-- Center connector line -->
        <line x1="200" y1="260" x2="200" y2="320" stroke="var(--color-accent)" stroke-width="1" opacity="0.3" />
      </svg>
    </div>

    <!-- Room labels row (mobile fallback) -->
    <div class="lobby__mobile-rooms">
      <button
        v-for="room in mobileRooms"
        :key="room.route"
        class="lobby__mobile-card glass-panel glass-panel--deep"
        @click="room.locked ? enterInvitation() : enterRoom(room.route)"
      >
        <span class="lobby__mobile-label">{{ room.label }}</span>
        <span class="lobby__mobile-sub">{{ room.sub }}</span>
        <span v-if="room.locked" class="lobby__mobile-lock">🔒</span>
      </button>
    </div>

    <!-- Footer tagline -->
    <div class="lobby__footer">
      <p class="lobby__footer-text">Premiering May 1, 2026 · 8:00 PM Kuwait</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { EVENT, getEventPhase } from '../config.js'
import CountdownTimer from '../components/CountdownTimer.vue'

import textLogoWhite from '../assets/avatr-text-logo-white.png'

const router = useRouter()
const phase = ref(getEventPhase())
const hoveredRoom = ref(null)
const particles = ref(null)
let animFrame = null
let particleList = []

const invitationUnlocked = computed(() => {
  return !!localStorage.getItem('avatr-quiz-completed')
})

const mobileRooms = computed(() => [
  { route: 'waiting-room', label: 'Waiting Room', sub: 'Games & History' },
  { route: 'reveal-room', label: 'Reveal Room', sub: '3D Car Model' },
  { route: 'watching-room', label: 'Premiere', sub: 'Watch the Show' },
  {
    route: 'invitation',
    label: invitationUnlocked.value ? 'Invitation' : 'Locked',
    sub: invitationUnlocked.value ? 'RSVP & Exclusive' : 'Complete the Quiz',
    locked: !invitationUnlocked.value,
  },
])

function enterRoom(routeName) {
  window.__avatrSound?.playWhoosh()
  router.push({ name: routeName })
}

function enterInvitation() {
  window.__avatrSound?.playClick()
  router.push({ name: 'invitation' })
}

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

  const count = 50
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
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.lobby {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-bg);
  padding: 40px 20px;
  gap: 32px;
}

/* Glow layers */
.lobby__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.lobby__glow--center {
  top: 40%;
  left: 50%;
  width: 900px;
  height: 900px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(200,169,110,0.06) 0%, rgba(200,169,110,0.02) 40%, transparent 70%);
  animation: goldBreathe 8s ease-in-out infinite;
}
.lobby__glow--edge {
  bottom: -20%;
  right: -15%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(180,210,255,0.025) 0%, transparent 70%);
}

.lobby__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

/* Header */
.lobby__header {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.lobby__eyebrow {
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.lobby__logo {
  height: clamp(28px, 5vw, 42px);
  width: auto;
}

.lobby__subtitle {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-weight: 300;
  letter-spacing: 0.06em;
  color: var(--color-text);
  opacity: 0.8;
}

.lobby__countdown {
  margin-top: 8px;
}

.lobby__live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(200, 40, 40, 0.15);
  border: 1px solid rgba(200, 40, 40, 0.4);
  border-radius: 999px;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ff6b6b;
  font-weight: 600;
}

.lobby__live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4444;
  animation: pulseGlow 1.5s ease-in-out infinite;
}

/* Emblem Floorplan */
.lobby__floorplan {
  position: relative;
  z-index: 2;
  width: clamp(260px, 40vw, 400px);
  flex-shrink: 0;
}

.lobby__emblem-svg {
  width: 100%;
  height: auto;
}

/* Segments */
.lobby__segment {
  cursor: pointer;
  transition: all 0.3s ease;
}

.lobby__segment-fill {
  fill: rgba(200, 169, 110, 0.02);
  transition: fill 0.4s ease;
}

.lobby__segment-stroke {
  opacity: 0.4;
  transition: opacity 0.3s ease, stroke-width 0.3s ease;
}

.lobby__segment--active .lobby__segment-fill {
  fill: rgba(200, 169, 110, 0.08);
}

.lobby__segment--active .lobby__segment-stroke {
  opacity: 1;
  stroke-width: 2;
}

.lobby__segment--locked {
  cursor: pointer;
}

.lobby__segment--locked .lobby__segment-fill {
  fill: rgba(100, 100, 120, 0.04);
}

.lobby__segment--locked .lobby__segment-stroke {
  stroke: var(--color-muted);
  opacity: 0.3;
  stroke-dasharray: 6 4;
}

.lobby__segment--locked.lobby__segment--active .lobby__segment-fill {
  fill: rgba(100, 100, 120, 0.08);
}

.lobby__room-label {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  fill: var(--color-text);
  letter-spacing: 0.06em;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.lobby__segment--active .lobby__room-label {
  opacity: 1;
  fill: var(--color-accent);
}

.lobby__room-sublabel {
  font-family: var(--font-body);
  font-size: 9px;
  fill: var(--color-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lobby__segment--active .lobby__room-sublabel {
  opacity: 1;
}

.lobby__lock-icon {
  color: var(--color-muted);
  opacity: 0.5;
}

.lobby__center-diamond {
  animation: diamondPulse 3s ease-in-out infinite;
  transform-origin: 200px 240px;
}

/* Mobile fallback cards */
.lobby__mobile-rooms {
  display: none;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
  flex-direction: column;
  gap: 12px;
}

.lobby__mobile-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px 20px;
  gap: 4px;
  position: relative;
  text-align: left;
}

.lobby__mobile-label {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--color-text);
}

.lobby__mobile-sub {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.lobby__mobile-lock {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

/* Footer */
.lobby__footer {
  position: relative;
  z-index: 2;
}

.lobby__footer-text {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
}

@media (max-width: 768px) {
  .lobby__floorplan {
    display: none;
  }

  .lobby__mobile-rooms {
    display: flex;
  }
}
</style>
