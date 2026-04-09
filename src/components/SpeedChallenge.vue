<template>
  <section class="speed section" id="challenge">
    <div class="section__inner">
      <SectionHeading
        title="Reaction Challenge"
        subtitle="Test your reflexes â€” how fast can you launch?"
      />

      <!-- Prize Banner -->
      <div class="speed__prize-banner">
        <div class="speed__prize-inner">
          <svg class="speed__prize-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L15 8.5L22 9.5L17 14.5L18 21.5L12 18L6 21.5L7 14.5L2 9.5L9 8.5Z"/>
          </svg>
          <div class="speed__prize-text">
            <span class="speed__prize-label">Win a Mystery Box</span>
            <span class="speed__prize-sub">Top 3 fastest reactions this week win!</span>
          </div>
          <svg class="speed__prize-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L15 8.5L22 9.5L17 14.5L18 21.5L12 18L6 21.5L7 14.5L2 9.5L9 8.5Z"/>
          </svg>
        </div>
      </div>

      <div class="speed__arena">
        <!-- Glass shine -->
        <div class="speed__arena-shine"></div>

        <!-- IDLE state -->
        <div v-if="state === 'idle'" class="speed__idle">
          <div class="speed__idle-visual">
            <div class="speed__lights-preview">
              <span v-for="i in 5" :key="i" class="speed__light-preview"></span>
            </div>
          </div>
          <h3 class="speed__idle-title">F1-Style Start</h3>
          <p class="speed__instructions">
            Watch the lights. When they all go out â€” tap as fast as you can!<br/>
            Your reaction time is measured in milliseconds.
          </p>
          <MagneticButton class="speed__start-btn" @click="startGame">
            Ready Up
          </MagneticButton>
        </div>

        <!-- COUNTDOWN state (F1 lights) -->
        <div v-if="state === 'countdown'" class="speed__countdown">
          <div class="speed__f1-lights">
            <div v-for="i in 5" :key="i" class="speed__f1-column">
              <span
                class="speed__f1-light"
                :class="{
                  'speed__f1-light--red': litCount >= i,
                  'speed__f1-light--out': lightsOut
                }"
              ></span>
              <span
                class="speed__f1-light"
                :class="{
                  'speed__f1-light--red': litCount >= i,
                  'speed__f1-light--out': lightsOut
                }"
              ></span>
            </div>
          </div>
          <p class="speed__countdown-text">{{ countdownMessage }}</p>

          <!-- False start overlay -->
          <button
            v-if="!lightsOut"
            class="speed__tap-zone speed__tap-zone--waiting"
            @mousedown="falseStart"
            @touchstart.prevent="falseStart"
          >
            <span class="speed__tap-label">WAIT...</span>
          </button>

          <!-- GO! tap zone -->
          <button
            v-if="lightsOut"
            class="speed__tap-zone speed__tap-zone--go"
            :class="{ 'speed__tap-zone--flash': tapFlash }"
            @mousedown="react"
            @touchstart.prevent="react"
          >
            <span class="speed__tap-label speed__tap-label--go">GO!</span>
          </button>
        </div>

        <!-- RESULT state -->
        <div v-if="state === 'result'" class="speed__result">
          <!-- Particle celebration -->
          <div class="speed__particles" ref="particlesEl">
            <span v-for="i in 20" :key="i" class="speed__particle" :style="particleStyle(i)"></span>
          </div>

          <!-- Car launch animation -->
          <div class="speed__launch-scene">
            <div class="speed__track-lines">
              <span v-for="i in 6" :key="i" class="speed__track-line" :style="{ animationDelay: `${i * 0.08}s` }"></span>
            </div>
            <svg class="speed__car-launch" viewBox="0 0 200 60" fill="none" :class="{ 'speed__car-launch--go': carLaunched }">
              <path d="M30 45 L45 25 L70 18 L130 18 L155 25 L170 45" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M25 45 H175" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="55" cy="48" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="145" cy="48" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="55" cy="48" r="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
              <circle cx="145" cy="48" r="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
            </svg>
          </div>

          <div class="speed__result-time">
            <span class="speed__result-num" :class="resultTier">{{ reactionTime }}</span>
            <span class="speed__result-unit">ms</span>
          </div>
          <div class="speed__result-badge" :class="resultTier">{{ resultLabel }}</div>
          <p class="speed__result-msg">{{ resultMessage }}</p>

          <!-- Mystery Box Teaser -->
          <div class="speed__mystery-box" v-if="isTopScore">
            <div class="speed__box-icon">
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2">
                <rect x="4" y="16" width="32" height="20" rx="2"/>
                <path d="M4 16 L20 4 L36 16"/>
                <path d="M20 4 V36"/>
                <circle cx="14" cy="26" r="3" opacity="0.5"/>
                <circle cx="26" cy="26" r="3" opacity="0.5"/>
              </svg>
            </div>
            <span class="speed__box-text">You could win the Mystery Box!</span>
          </div>

          <!-- Score submission form -->
          <form v-if="!scoreSubmitted" class="speed__submit-form" @submit.prevent="submitScore">
            <input
              v-model="playerName"
              type="text"
              class="speed__submit-input"
              placeholder="Your name"
              required
            />
            <input
              v-model="playerEmail"
              type="email"
              class="speed__submit-input"
              placeholder="Email (for prizes)"
              required
            />
            <MagneticButton type="submit" class="speed__submit-btn">
              Save Score
            </MagneticButton>
            <p v-if="submitError" class="speed__submit-error">{{ submitError }}</p>
          </form>
          <div v-else class="speed__submitted-wrap">
            <p class="speed__submitted-msg">Score saved! Check the leaderboard below.</p>
            <p v-if="playerRank" class="speed__submitted-rank">You are currently #{{ playerRank }} this week.</p>
            <MagneticButton class="speed__share-btn" @click="shareScore">
              {{ copiedShare ? 'Copied!' : 'Share My Time' }}
            </MagneticButton>
          </div>

          <MagneticButton class="speed__retry-btn" @click="resetGame">
            Try Again
          </MagneticButton>
        </div>

        <!-- FALSE START state -->
        <div v-if="state === 'false-start'" class="speed__false-start">
          <div class="speed__false-icon">&#10005;</div>
          <h3 class="speed__false-title">False Start!</h3>
          <p class="speed__false-text">You tapped before the lights went out. Stay patient!</p>
          <MagneticButton class="speed__retry-btn" @click="resetGame">
            Try Again
          </MagneticButton>
        </div>

        <!-- Leaderboard -->
        <div class="speed__leaderboard" v-if="state === 'idle' || state === 'result' || state === 'false-start'">
          <h3 class="speed__lb-title">
            <svg class="speed__lb-trophy-icon" viewBox="0 0 20 20" fill="none">
              <path d="M6 3H14V8C14 11 12 13 10 13C8 13 6 11 6 8V3Z" stroke="currentColor" stroke-width="1.2"/>
              <path d="M6 5H3C3 8 5 9 6 9" stroke="currentColor" stroke-width="1"/>
              <path d="M14 5H17C17 8 15 9 14 9" stroke="currentColor" stroke-width="1"/>
              <path d="M8 13V15H12V13" stroke="currentColor" stroke-width="1"/>
              <path d="M7 15H13" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            This Week's Fastest
          </h3>
          <p class="speed__lb-week">{{ leaderboardLabel }}</p>
          <div class="speed__lb-list">
            <div
              v-for="(entry, i) in leaderboard"
              :key="i"
              class="speed__lb-entry"
              :class="{
                'speed__lb-entry--gold': i === 0,
                'speed__lb-entry--silver': i === 1,
                'speed__lb-entry--bronze': i === 2
              }"
            >
              <span class="speed__lb-rank">
                <svg v-if="i < 3" class="speed__trophy" viewBox="0 0 20 20" fill="none">
                  <path d="M6 3H14V8C14 11 12 13 10 13C8 13 6 11 6 8V3Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M6 5H3C3 8 5 9 6 9" stroke="currentColor" stroke-width="1"/>
                  <path d="M14 5H17C17 8 15 9 14 9" stroke="currentColor" stroke-width="1"/>
                  <path d="M8 13V15H12V13" stroke="currentColor" stroke-width="1"/>
                  <path d="M7 15H13" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                <span v-else>{{ i + 1 }}</span>
              </span>
              <span class="speed__lb-name">{{ entry.name }}</span>
              <span class="speed__lb-score">{{ entry.score }}ms</span>
            </div>
            <p v-if="leaderboard.length === 0" class="speed__lb-empty">
              No scores yet - be the first!
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { API } from '../config.js'
import SectionHeading from './SectionHeading.vue'
import MagneticButton from './MagneticButton.vue'

const state = ref('idle')
const litCount = ref(0)
const lightsOut = ref(false)
const lightsOutTime = ref(0)
const reactionTime = ref(0)
const tapFlash = ref(false)
const carLaunched = ref(false)
const playerName = ref('')
const playerEmail = ref('')
const scoreSubmitted = ref(false)
const leaderboard = ref([])
const particlesEl = ref(null)
const copiedShare = ref(false)
const submitError = ref('')

const WEEKLY_BOARD_KEY = 'avatr-weekly-leaderboard'

let lightTimers = []
let goTimeout = null

const countdownMessage = computed(() => {
  if (lightsOut.value) return ''
  if (litCount.value === 0) return 'Get ready...'
  return ''
})

const resultLabel = computed(() => {
  const ms = reactionTime.value
  if (ms < 200) return 'Superhuman'
  if (ms < 250) return 'Lightning'
  if (ms < 300) return 'Excellent'
  if (ms < 400) return 'Good'
  return 'Keep Practicing'
})

const resultMessage = computed(() => {
  const ms = reactionTime.value
  if (ms < 200) return 'Incredible! F1 driver-level reflexes!'
  if (ms < 250) return 'Blazing fast - you are a natural!'
  if (ms < 300) return 'Excellent reaction. Try again to break 250ms!'
  if (ms < 400) return 'Solid start! Most people are in this range.'
  return 'Do not worry - reaction time improves with practice!'
})

const leaderboardLabel = computed(() => `Week of ${getWeekLabel()}`)

const resultTier = computed(() => {
  const ms = reactionTime.value
  if (ms < 200) return 'tier-legendary'
  if (ms < 250) return 'tier-gold'
  if (ms < 300) return 'tier-silver'
  if (ms < 400) return 'tier-bronze'
  return 'tier-normal'
})

const isTopScore = computed(() => {
  if (leaderboard.value.length < 3) return true
  return reactionTime.value < parseFloat(leaderboard.value[2]?.score || 999)
})

const playerRank = computed(() => {
  if (!scoreSubmitted.value || !playerName.value) return null
  const idx = leaderboard.value.findIndex((entry) => entry.name === playerName.value && String(entry.score) === String(reactionTime.value))
  return idx === -1 ? null : idx + 1
})

function startGame() {
  state.value = 'countdown'
  litCount.value = 0
  lightsOut.value = false
  carLaunched.value = false
  scoreSubmitted.value = false

  for (let i = 1; i <= 5; i++) {
    const t = setTimeout(() => {
      litCount.value = i
    }, i * 1000)
    lightTimers.push(t)
  }

  const randomDelay = 6000 + Math.random() * 2000
  goTimeout = setTimeout(() => {
    lightsOut.value = true
    lightsOutTime.value = performance.now()
  }, randomDelay)
}

function react() {
  if (!lightsOut.value || state.value !== 'countdown') return

  const ms = Math.round(performance.now() - lightsOutTime.value)
  reactionTime.value = ms
  tapFlash.value = true
  setTimeout(() => { tapFlash.value = false }, 150)

  setTimeout(() => {
    carLaunched.value = true
  }, 100)

  state.value = 'result'
}

function falseStart() {
  clearAllTimers()
  state.value = 'false-start'
}

function resetGame() {
  clearAllTimers()
  state.value = 'idle'
  litCount.value = 0
  lightsOut.value = false
  reactionTime.value = 0
  playerName.value = ''
  playerEmail.value = ''
  scoreSubmitted.value = false
  carLaunched.value = false
  copiedShare.value = false
  submitError.value = ''
}

function getWeekKey() {
  const now = new Date()
  const day = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - day)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().slice(0, 10)
}

function getWeekLabel() {
  const monday = new Date(getWeekKey())
  return monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function readLocalBoard() {
  try {
    const raw = localStorage.getItem(`${WEEKLY_BOARD_KEY}:${getWeekKey()}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocalBoard(entries) {
  try {
    localStorage.setItem(`${WEEKLY_BOARD_KEY}:${getWeekKey()}`, JSON.stringify(entries))
  } catch {
    // ignore localStorage failures
  }
}

function clearAllTimers() {
  lightTimers.forEach(t => clearTimeout(t))
  lightTimers = []
  if (goTimeout) clearTimeout(goTimeout)
  goTimeout = null
}

function particleStyle(i) {
  const angle = (i / 20) * 360
  const distance = 60 + Math.random() * 100
  const px = Math.cos(angle * Math.PI / 180) * distance
  const py = Math.sin(angle * Math.PI / 180) * distance
  return {
    '--px': px + 'px',
    '--py': py + 'px',
    animationDelay: (i * 0.05) + 's',
    background: i % 3 === 0 ? 'var(--color-accent)' : i % 3 === 1 ? 'var(--color-accent-hover)' : 'var(--color-text)',
    width: `${3 + Math.random() * 4}px`,
    height: `${3 + Math.random() * 4}px`,
    borderRadius: i % 2 === 0 ? '50%' : '1px',
  }
}

async function submitScore() {
  submitError.value = ''

  if (reactionTime.value < 90) {
    submitError.value = 'That score is too fast to validate. Try again.'
    return
  }

  try {
    if (API.sheetsEndpoint) {
      await fetch(API.sheetsEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'score',
          name: playerName.value,
          email: playerEmail.value,
          score: reactionTime.value,
          timestamp: new Date().toISOString(),
        }),
      })
    }
    scoreSubmitted.value = true
    leaderboard.value.push({ name: playerName.value, score: String(reactionTime.value) })
    leaderboard.value.sort((a, b) => parseFloat(a.score) - parseFloat(b.score))
    leaderboard.value = leaderboard.value.slice(0, 10)
    writeLocalBoard(leaderboard.value)
    window.__avatrSound?.playWhoosh()
  } catch {
    scoreSubmitted.value = true
    leaderboard.value.push({ name: playerName.value, score: String(reactionTime.value) })
    leaderboard.value.sort((a, b) => parseFloat(a.score) - parseFloat(b.score))
    leaderboard.value = leaderboard.value.slice(0, 10)
    writeLocalBoard(leaderboard.value)
  }
}

async function shareScore() {
  const rankText = playerRank.value ? `Rank #${playerRank.value}` : 'Leaderboard contender'
  const text = `I just clocked ${reactionTime.value}ms in the AVATR Reaction Challenge (${rankText}). Can you beat me?`
  const url = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'AVATR Reaction Challenge',
        text,
        url,
      })
      copiedShare.value = true
    } catch {
      // ignore canceled share dialog
    }
  } else {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      copiedShare.value = true
    } catch {
      // ignore clipboard failure
    }
  }

  if (copiedShare.value) {
    window.__avatrSound?.playClick()
    setTimeout(() => { copiedShare.value = false }, 1800)
  }
}

async function fetchLeaderboard() {
  if (!API.sheetsEndpoint) {
    const localBoard = readLocalBoard()
    leaderboard.value = localBoard.length ? localBoard : [
      { name: 'Ahmad K.', score: '187' },
      { name: 'Sara M.', score: '215' },
      { name: 'Khaled R.', score: '238' },
      { name: 'Fatima A.', score: '267' },
      { name: 'Omar T.', score: '312' },
    ]
    return
  }
  try {
    const res = await fetch(`${API.sheetsEndpoint}?type=leaderboard`)
    const data = await res.json()
    if (Array.isArray(data)) {
      leaderboard.value = data.slice(0, 10)
      writeLocalBoard(leaderboard.value)
    }
  } catch {
    leaderboard.value = readLocalBoard()
  }
}

onMounted(() => {
  fetchLeaderboard()
})

onUnmounted(() => {
  clearAllTimers()
})
</script>

<style scoped>
.speed {
  background-color: var(--color-bg);
}

.speed__submitted-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.speed__submitted-rank {
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.speed__share-btn {
  min-width: 180px;
}

.speed__submit-error {
  font-size: 0.74rem;
  color: #ff8e8e;
  letter-spacing: 0.04em;
}

.speed__lb-week {
  margin-top: -8px;
  margin-bottom: 14px;
  text-align: center;
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-muted);
}

/* â”€â”€ Prize Banner â”€â”€ */
.speed__prize-banner {
  max-width: 650px;
  margin: 0 auto var(--gap-md);
}

.speed__prize-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 28px;
  background: rgba(200, 169, 110, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(200, 169, 110, 0.2);
  border-radius: var(--glass-radius);
  box-shadow: 0 0 30px rgba(200, 169, 110, 0.08);
  animation: pulseGlow 3s ease-in-out infinite;
}

.speed__prize-icon {
  width: 20px;
  height: 20px;
  color: var(--color-accent);
  flex-shrink: 0;
}

.speed__prize-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.speed__prize-label {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  text-transform: uppercase;
}

.speed__prize-sub {
  font-size: var(--text-small);
  color: var(--color-muted);
  letter-spacing: 0.05em;
}

/* â”€â”€ Arena â”€â”€ */
.speed__arena {
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-lg);
  position: relative;
  border-radius: var(--glass-radius);
  overflow: hidden;
  padding: 40px 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.speed__arena-shine {
  position: absolute;
  inset: 0;
  background: var(--glass-shine);
  pointer-events: none;
  z-index: 0;
}

/* â”€â”€ Idle â”€â”€ */
.speed__idle {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.speed__idle-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text);
}

.speed__lights-preview {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.speed__light-preview {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.speed__instructions {
  font-size: var(--text-body);
  color: var(--color-muted);
  line-height: 1.8;
  max-width: 440px;
}

/* â”€â”€ F1 Lights â”€â”€ */
.speed__countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  position: relative;
  z-index: 1;
  min-height: 300px;
}

.speed__f1-lights {
  display: flex;
  gap: clamp(12px, 3vw, 24px);
  padding: 24px 32px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.speed__f1-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.speed__f1-light {
  width: clamp(28px, 6vw, 44px);
  height: clamp(28px, 6vw, 44px);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
}

.speed__f1-light--red {
  background: #e63946;
  border-color: #ff1a2d;
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(230, 57, 70, 0.6),
    0 0 40px rgba(230, 57, 70, 0.3);
}

.speed__f1-light--out {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: all 0.05s ease;
}

.speed__countdown-text {
  font-family: var(--font-display);
  font-size: var(--text-body);
  letter-spacing: 0.15em;
  color: var(--color-muted);
  text-transform: uppercase;
  min-height: 24px;
}

/* â”€â”€ Tap Zone â”€â”€ */
.speed__tap-zone {
  width: 100%;
  max-width: 400px;
  padding: 60px 40px;
  border-radius: var(--glass-radius);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
}

.speed__tap-zone--waiting {
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.08);
}

.speed__tap-zone--go {
  background: rgba(200, 169, 110, 0.08);
  border: 2px solid rgba(200, 169, 110, 0.4);
  animation: goPulse 0.5s ease-in-out infinite;
  box-shadow: 0 0 40px rgba(200, 169, 110, 0.2);
}

.speed__tap-zone--flash {
  background: rgba(200, 169, 110, 0.2);
}

@keyframes goPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(200, 169, 110, 0.15); }
  50% { box-shadow: 0 0 50px rgba(200, 169, 110, 0.35); }
}

.speed__tap-label {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--color-muted);
  pointer-events: none;
}

.speed__tap-label--go {
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-accent);
  text-shadow: 0 0 20px rgba(200, 169, 110, 0.5);
}

/* â”€â”€ Result â”€â”€ */
.speed__result {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

/* Particles */
.speed__particles {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
}

.speed__particle {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  animation: particleBurst 1.2s ease-out forwards;
}

/* Car launch */
.speed__launch-scene {
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 80px;
  overflow: hidden;
  margin-bottom: 8px;
}

.speed__track-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.speed__track-line {
  position: absolute;
  right: 0;
  height: 1px;
  width: 40px;
  background: linear-gradient(90deg, transparent, var(--color-accent));
  opacity: 0;
  animation: trackLineSlide 0.8s ease-out forwards;
}

.speed__track-line:nth-child(1) { top: 15%; }
.speed__track-line:nth-child(2) { top: 30%; }
.speed__track-line:nth-child(3) { top: 45%; }
.speed__track-line:nth-child(4) { top: 60%; }
.speed__track-line:nth-child(5) { top: 75%; }
.speed__track-line:nth-child(6) { top: 90%; }

@keyframes trackLineSlide {
  0% { opacity: 0; width: 0; }
  30% { opacity: 0.5; width: 60px; }
  100% { opacity: 0; width: 120px; transform: translateX(-80px); }
}

.speed__car-launch {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  width: 120px;
  color: var(--color-accent);
  opacity: 0.4;
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.speed__car-launch--go {
  left: 80%;
  opacity: 0;
  filter: blur(3px);
}

.speed__result-time {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.speed__result-num {
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 700;
  line-height: 1;
}

.speed__result-num.tier-legendary { color: #ff6b6b; text-shadow: 0 0 30px rgba(255, 107, 107, 0.5); }
.speed__result-num.tier-gold { color: var(--color-accent); text-shadow: 0 0 20px rgba(200, 169, 110, 0.4); }
.speed__result-num.tier-silver { color: #c0c0c0; }
.speed__result-num.tier-bronze { color: #cd7f32; }
.speed__result-num.tier-normal { color: var(--color-text); }

.speed__result-unit {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 400;
  color: var(--color-muted);
}

.speed__result-badge {
  display: inline-flex;
  padding: 6px 20px;
  border-radius: 30px;
  font-family: var(--font-display);
  font-size: var(--text-caption);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.speed__result-badge.tier-legendary {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}
.speed__result-badge.tier-gold {
  background: rgba(200, 169, 110, 0.1);
  border: 1px solid rgba(200, 169, 110, 0.3);
  color: var(--color-accent);
}
.speed__result-badge.tier-silver {
  background: rgba(192, 192, 192, 0.08);
  border: 1px solid rgba(192, 192, 192, 0.2);
  color: #c0c0c0;
}
.speed__result-badge.tier-bronze {
  background: rgba(205, 127, 50, 0.08);
  border: 1px solid rgba(205, 127, 50, 0.2);
  color: #cd7f32;
}
.speed__result-badge.tier-normal {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-muted);
}

.speed__result-msg {
  font-size: var(--text-body);
  color: var(--color-muted);
  max-width: 350px;
}

/* Mystery Box */
.speed__mystery-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(200, 169, 110, 0.06);
  border: 1px solid rgba(200, 169, 110, 0.2);
  border-radius: var(--glass-radius);
  animation: pulseGlow 2s ease-in-out infinite;
}

.speed__box-icon {
  width: 32px;
  height: 32px;
  color: var(--color-accent);
}

.speed__box-icon svg {
  width: 100%;
  height: 100%;
}

.speed__box-text {
  font-family: var(--font-display);
  font-size: var(--text-body);
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

/* False Start */
.speed__false-start {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
  padding: 40px;
}

.speed__false-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(230, 57, 70, 0.15);
  border: 1px solid rgba(230, 57, 70, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #e63946;
}

.speed__false-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #e63946;
}

.speed__false-text {
  font-size: var(--text-body);
  color: var(--color-muted);
  max-width: 350px;
}

/* â”€â”€ Submit Form â”€â”€ */
.speed__submit-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 320px;
}

.speed__submit-input {
  width: 100%;
  padding: 12px 16px;
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-text);
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  outline: none;
  transition: border-color var(--duration-fast) ease;
}

.speed__submit-input::placeholder { color: rgba(240, 240, 240, 0.2); }
.speed__submit-input:focus { border-color: var(--color-accent); }
.speed__submit-btn { width: 100%; }

.speed__submitted-msg {
  font-size: var(--text-caption);
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.speed__retry-btn {
  background: transparent;
  color: var(--color-text);
  border: 1px solid rgba(200, 169, 110, 0.2);
}

.speed__retry-btn:hover {
  background: rgba(200, 169, 110, 0.05);
  color: var(--color-text);
}

/* â”€â”€ Leaderboard â”€â”€ */
.speed__leaderboard {
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.speed__lb-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: 16px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.speed__lb-trophy-icon {
  width: 20px;
  height: 20px;
  color: var(--color-accent);
}

.speed__lb-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.speed__lb-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  transition: all var(--duration-fast) ease;
}

.speed__lb-entry:hover {
  border-color: rgba(200, 169, 110, 0.12);
  background: var(--glass-bg-hover);
}

.speed__lb-entry--gold {
  border-color: rgba(255, 215, 0, 0.15);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.05);
}
.speed__lb-entry--silver { border-color: rgba(192, 192, 192, 0.1); }
.speed__lb-entry--bronze { border-color: rgba(205, 127, 50, 0.1); }
.speed__lb-entry--gold .speed__trophy { color: #ffd700; }
.speed__lb-entry--silver .speed__trophy { color: #c0c0c0; }
.speed__lb-entry--bronze .speed__trophy { color: #cd7f32; }

.speed__lb-rank {
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.speed__trophy { width: 18px; height: 18px; }

.speed__lb-rank span {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-muted);
}

.speed__lb-name {
  flex: 1;
  font-size: var(--text-body);
  color: var(--color-text);
}

.speed__lb-score {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.02em;
}

.speed__lb-empty {
  text-align: center;
  font-size: var(--text-caption);
  color: var(--color-muted);
  padding: 24px;
}
</style>
