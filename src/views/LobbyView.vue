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
      <!-- Base emblem PNG -->
      <img :src="emblemWhite" alt="" class="lobby__emblem-img" draggable="false" />

      <!-- Interactive overlay SVG (transparent fills only, PNG provides visuals) -->
      <svg
        class="lobby__emblem-svg"
        viewBox="0 0 668 675"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="frostedLock" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        <!-- Top triangle segment → Reveal Room -->
        <g
          class="lobby__segment"
          :class="{ 'lobby__segment--active': hoveredRoom === 'reveal' }"
          @mouseenter="hoveredRoom = 'reveal'"
          @mouseleave="hoveredRoom = null"
          @click="enterRoom('reveal-room')"
        >
          <path
            d="M 186 48 L 334 320 L 482 48 Z"
            class="lobby__segment-fill"
          />
          <text x="334" y="155" text-anchor="middle" class="lobby__room-label">Reveal</text>
          <text x="334" y="178" text-anchor="middle" class="lobby__room-sublabel">3D Model Experience</text>
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
            d="M 186 48 L 334 320 L 186 492 Z"
            class="lobby__segment-fill"
          />
          <text x="232" y="290" text-anchor="middle" class="lobby__room-label">Waiting</text>
          <text x="232" y="313" text-anchor="middle" class="lobby__room-sublabel">Games & History</text>
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
            d="M 482 48 L 334 320 L 482 492 Z"
            class="lobby__segment-fill"
          />
          <text x="436" y="290" text-anchor="middle" class="lobby__room-label">Premiere</text>
          <text x="436" y="313" text-anchor="middle" class="lobby__room-sublabel">Watch the Show</text>
        </g>

        <!-- Bottom triangle → Invitation Room (locked) -->
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
          <!-- Invisible hit area -->
          <path
            d="M 186 492 L 334 320 L 482 492 Z"
            fill="transparent"
            pointer-events="all"
            style="cursor: inherit"
          />
          <!-- Frosted fill (blurred when locked) -->
          <path
            v-if="!invitationUnlocked"
            d="M 186 492 L 334 320 L 482 492 Z"
            class="lobby__segment-fill"
            filter="url(#frostedLock)"
            pointer-events="none"
          />
          <!-- Normal fill (when unlocked) -->
          <path
            v-else
            d="M 186 492 L 334 320 L 482 492 Z"
            class="lobby__segment-fill"
          />
          <!-- Semi-transparent frost overlay -->
          <path
            v-if="!invitationUnlocked"
            d="M 186 492 L 334 320 L 482 492 Z"
            fill="rgba(6,6,8,0.65)"
            pointer-events="none"
          />

          <!-- Labels -->
          <text x="334" y="430" text-anchor="middle" class="lobby__room-label" pointer-events="none">
            {{ invitationUnlocked ? 'Invitation' : 'Locked' }}
          </text>
          <text x="334" y="453" text-anchor="middle" class="lobby__room-sublabel" pointer-events="none">
            {{ invitationUnlocked ? 'RSVP & Exclusive' : 'Complete the Quiz' }}
          </text>
        </g>

        <!-- Lock icon -->
        <g v-if="!invitationUnlocked" class="lobby__lock-icon" @click="enterInvitation">
          <rect x="318" y="378" width="32" height="26" rx="3" stroke="currentColor" stroke-width="1.5" fill="none" />
          <path d="M324 378 V370 A10 10 0 0 1 344 370 V378" stroke="currentColor" stroke-width="1.5" fill="none" />
          <circle cx="334" cy="391" r="2.5" fill="currentColor" />
        </g>
      </svg>
    </div>

    <!-- Room labels row (mobile fallback) -->
    <div class="lobby__mobile-rooms">
      <button
        v-for="room in mobileRooms"
        :key="room.route"
        class="lobby__mobile-card glass-panel glass-panel--deep"
        :class="{ 'lobby__mobile-card--locked': room.locked }"
        @click="room.locked ? enterInvitation() : enterRoom(room.route)"
      >
        <span class="lobby__mobile-label">{{ room.label }}</span>
        <span class="lobby__mobile-sub">{{ room.sub }}</span>
        <span v-if="room.locked" class="lobby__mobile-lock">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Footer tagline -->
    <div class="lobby__footer">
      <p class="lobby__footer-text">Premiering May 1, 2026 · 8:00 PM Kuwait</p>
    </div>

    <!-- Lock Modal -->
    <Transition name="modal-fade">
      <div v-if="showLockModal" class="lobby__lock-overlay" @click.self="showLockModal = false">
        <div class="lobby__lock-modal glass-panel glass-panel--deep">
          <svg class="lobby__lock-modal-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <h3 class="lobby__lock-modal-title">This Room Is Locked</h3>
          <p class="lobby__lock-modal-text">
            Complete the Knowledge Quiz in the Waiting Room to unlock your exclusive invitation.
          </p>
          <MagneticButton class="lobby__lock-modal-btn" @click="goToQuiz">
            Go to Quiz
          </MagneticButton>
          <button class="lobby__lock-modal-dismiss" @click="showLockModal = false">Back</button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { EVENT, getEventPhase } from '../config.js'
import CountdownTimer from '../components/CountdownTimer.vue'
import MagneticButton from '../components/MagneticButton.vue'

import textLogoWhite from '../assets/avatr-text-logo-white.png'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'

const router = useRouter()
const phase = ref(getEventPhase())
const hoveredRoom = ref(null)
const particles = ref(null)
const showLockModal = ref(false)
let animFrame = null
let particleList = []

const invitationUnlocked = ref(!!localStorage.getItem('avatr-quiz-completed'))

function refreshLockState() {
  invitationUnlocked.value = !!localStorage.getItem('avatr-quiz-completed')
}

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
  // Re-check localStorage at click time to ensure fresh state
  refreshLockState()
  if (!invitationUnlocked.value) {
    window.__avatrSound?.playClick()
    showLockModal.value = true
    return
  }
  window.__avatrSound?.playClick()
  router.push({ name: 'invitation' })
}

function goToQuiz() {
  showLockModal.value = false
  window.__avatrSound?.playWhoosh()
  router.push({ name: 'waiting-room', query: { tab: 'quiz' } })
}

function onEscKey(e) {
  if (e.key === 'Escape') showLockModal.value = false
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
  refreshLockState()
  document.addEventListener('visibilitychange', refreshLockState)
  document.addEventListener('keydown', onEscKey)
  initParticles()
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', refreshLockState)
  document.removeEventListener('keydown', onEscKey)
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

.lobby__emblem-img {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
  opacity: 0.55;
  transition: opacity 0.4s ease;
}

.lobby__floorplan:hover .lobby__emblem-img {
  opacity: 0.75;
}

.lobby__emblem-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Segments */
.lobby__segment {
  cursor: pointer;
  transition: all 0.3s ease;
}

.lobby__segment-fill {
  fill: rgba(200, 169, 110, 0.0);
  transition: fill 0.4s ease;
}

.lobby__segment--active .lobby__segment-fill {
  fill: rgba(200, 169, 110, 0.1);
}

.lobby__segment--locked {
  cursor: not-allowed;
}

.lobby__segment--locked .lobby__segment-fill {
  fill: rgba(200, 169, 110, 0.03);
}

.lobby__segment--locked .lobby__room-label {
  opacity: 0.5;
}

.lobby__segment--locked.lobby__segment--active .lobby__segment-fill {
  fill: rgba(200, 169, 110, 0.06);
}

.lobby__segment--locked .lobby__room-sublabel {
  opacity: 0.9;
  fill: var(--color-accent);
  font-size: 11px;
}

.lobby__room-label {
  font-family: var(--font-display);
  font-size: 18px;
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
  font-size: 11px;
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
  color: var(--color-accent);
  opacity: 1;
  cursor: not-allowed;
  filter: drop-shadow(0 0 10px rgba(200, 169, 110, 0.5));
  animation: lockBounce 2s ease-in-out infinite;
}

@keyframes lockBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
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
  color: var(--color-accent);
  opacity: 0.7;
}

/* Mobile locked card frost */
.lobby__mobile-card--locked {
  opacity: 0.5;
  cursor: not-allowed;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.lobby__mobile-card--locked .lobby__mobile-label {
  color: var(--color-muted);
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

/* Lock Modal */
.lobby__lock-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 6, 8, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 20px;
}

.lobby__lock-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 40px 36px;
  text-align: center;
  max-width: 380px;
  width: 100%;
}

.lobby__lock-modal-icon {
  opacity: 0.8;
  filter: drop-shadow(0 0 12px rgba(200, 169, 110, 0.3));
}

.lobby__lock-modal-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--color-text);
}

.lobby__lock-modal-text {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--color-muted);
  max-width: 300px;
}

.lobby__lock-modal-btn {
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
  transition: background 0.3s ease;
}

.lobby__lock-modal-btn:hover {
  background: var(--color-accent-hover);
}

.lobby__lock-modal-dismiss {
  font-size: 0.74rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  transition: color 0.3s ease;
}

.lobby__lock-modal-dismiss:hover {
  color: var(--color-text);
}

/* Modal transition */
.modal-fade-enter-active {
  transition: opacity 0.3s ease;
}
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .lobby__lock-modal {
  animation: modalSlideUp 0.3s ease forwards;
}
@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 768px) {
  .lobby__floorplan {
    width: clamp(200px, 60vw, 280px);
  }

  .lobby__room-label {
    font-size: 16px;
  }

  .lobby__room-sublabel {
    font-size: 10px;
  }

  .lobby__mobile-rooms {
    display: flex;
  }
}
</style>
