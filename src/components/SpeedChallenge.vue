<template>
  <section class="speed section" id="challenge">
    <div class="section__inner">
      <SectionHeading
        title="0–100 Challenge"
        subtitle="How fast can you launch the AVATR?"
      />

      <div class="speed__arena" :class="{ 'speed__arena--shake': shaking }">
        <!-- Edge glow that intensifies with speed -->
        <div class="speed__edge-glow" :style="{ opacity: currentSpeed / 150 }"></div>

        <!-- Carbon fiber texture bg -->
        <div class="speed__carbon-bg"></div>

        <!-- IDLE state -->
        <div v-if="state === 'idle'" class="speed__idle">
          <div class="speed__idle-visual">
            <!-- Car silhouette SVG -->
            <svg class="speed__car-icon" viewBox="0 0 200 60" fill="none">
              <path d="M30 45 L45 25 L70 18 L130 18 L155 25 L170 45" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M25 45 H175" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="55" cy="48" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="145" cy="48" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="55" cy="48" r="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
              <circle cx="145" cy="48" r="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
              <path d="M75 18 L80 30 H120 L125 18" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
            </svg>
          </div>
          <p class="speed__instructions">
            Tap as fast as you can to accelerate from 0 to 100 km/h.
            <br />Your time is your score. Top 3 this week win a mystery gift.
          </p>
          <MagneticButton class="speed__start-btn" @click="startGame">
            Start Challenge
          </MagneticButton>
        </div>

        <!-- PLAYING state -->
        <div v-if="state === 'playing'" class="speed__playing">
          <div class="speed__dashboard">
            <!-- Main speedometer -->
            <div class="speed__speedo">
              <svg class="speed__speedo-svg" viewBox="0 0 260 160">
                <!-- Outer decorative ring -->
                <path d="M 30 140 A 100 100 0 0 1 230 140" stroke="rgba(200,169,110,0.06)" stroke-width="1" fill="none"/>

                <!-- Tick marks and numbers -->
                <g v-for="t in 11" :key="t">
                  <line
                    :x1="130 + 95 * Math.cos(((t - 1) * 18 - 180) * Math.PI / 180)"
                    :y1="140 + 95 * Math.sin(((t - 1) * 18 - 180) * Math.PI / 180)"
                    :x2="130 + (t % 2 === 1 ? 88 : 90) * Math.cos(((t - 1) * 18 - 180) * Math.PI / 180)"
                    :y2="140 + (t % 2 === 1 ? 88 : 90) * Math.sin(((t - 1) * 18 - 180) * Math.PI / 180)"
                    stroke="var(--color-accent)"
                    :stroke-width="t % 2 === 1 ? 1.5 : 0.8"
                    :opacity="t % 2 === 1 ? 0.5 : 0.25"
                  />
                  <text
                    v-if="t % 2 === 1"
                    :x="130 + 78 * Math.cos(((t - 1) * 18 - 180) * Math.PI / 180)"
                    :y="140 + 78 * Math.sin(((t - 1) * 18 - 180) * Math.PI / 180)"
                    text-anchor="middle"
                    dominant-baseline="central"
                    fill="var(--color-muted)"
                    font-size="9"
                    font-family="var(--font-display)"
                  >{{ (t - 1) * 10 }}</text>
                </g>

                <!-- Track arc -->
                <path
                  d="M 40 140 A 90 90 0 0 1 220 140"
                  stroke="rgba(200,169,110,0.1)"
                  stroke-width="5"
                  stroke-linecap="round"
                  fill="none"
                />
                <!-- Progress arc -->
                <path
                  d="M 40 140 A 90 90 0 0 1 220 140"
                  stroke="var(--color-accent)"
                  stroke-width="5"
                  stroke-linecap="round"
                  fill="none"
                  :stroke-dasharray="arcLength"
                  :stroke-dashoffset="arcLength - (arcLength * currentSpeed) / 100"
                  class="speed__arc-progress"
                />

                <!-- Needle -->
                <g :style="{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '130px 140px' }" class="speed__needle-group">
                  <line x1="130" y1="140" x2="130" y2="55" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="130" cy="140" r="6" fill="var(--color-surface)" stroke="var(--color-accent)" stroke-width="1.5"/>
                  <circle cx="130" cy="140" r="2" fill="var(--color-accent)"/>
                </g>
              </svg>
              <div class="speed__speed-display">
                <span class="speed__speed-num">{{ Math.floor(currentSpeed) }}</span>
                <span class="speed__speed-unit">km/h</span>
              </div>
            </div>

            <!-- Timer display -->
            <div class="speed__timer">
              <span class="speed__timer-label">TIME</span>
              <span class="speed__timer-value">{{ displayTime }}</span>
            </div>
          </div>

          <!-- Speed lines -->
          <div class="speed__lines" :style="{ opacity: currentSpeed / 80 }">
            <span v-for="i in 8" :key="i" class="speed__line" :style="lineStyle(i)"></span>
          </div>

          <!-- Car silhouette accelerating -->
          <div class="speed__car-wrap" :style="{ transform: `translateX(${carOffset}px)` }">
            <svg class="speed__car-moving" viewBox="0 0 200 60" fill="none" :style="{ filter: `blur(${currentSpeed / 60}px)` }">
              <path d="M30 45 L45 25 L70 18 L130 18 L155 25 L170 45" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M25 45 H175" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="55" cy="48" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="145" cy="48" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>

          <!-- Tap zone -->
          <button
            class="speed__tap-zone"
            @mousedown="tap"
            @touchstart.prevent="tap"
            :class="{ 'speed__tap-zone--flash': tapFlash }"
          >
            <span class="speed__tap-ripple" v-for="r in ripples" :key="r.id" :style="{ left: r.x + 'px', top: r.y + 'px' }"></span>
            <span class="speed__tap-label">TAP!</span>
          </button>
        </div>

        <!-- RESULT state -->
        <div v-if="state === 'result'" class="speed__result">
          <div class="speed__result-celebration">
            <span v-for="i in 12" :key="i" class="speed__confetti" :style="confettiStyle(i)"></span>
          </div>

          <!-- Car celebration -->
          <div class="speed__result-car">
            <svg class="speed__car-celebrate" viewBox="0 0 200 60" fill="none">
              <path d="M30 45 L45 25 L70 18 L130 18 L155 25 L170 45" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M25 45 H175" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="55" cy="48" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="145" cy="48" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>

          <div class="speed__result-time">
            <span class="speed__result-num">{{ finalTime }}</span>
            <span class="speed__result-unit">seconds</span>
          </div>
          <p class="speed__result-msg">{{ resultMessage }}</p>

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
          </form>
          <p v-else class="speed__submitted-msg">Score saved! Check the leaderboard below.</p>

          <MagneticButton class="speed__retry-btn" @click="resetGame">
            Try Again
          </MagneticButton>
        </div>

        <!-- Leaderboard -->
        <div class="speed__leaderboard" v-if="state !== 'playing'">
          <h3 class="speed__lb-title">This Week's Fastest</h3>
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
                <!-- Trophy SVGs for top 3 -->
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
              <span class="speed__lb-score">{{ entry.score }}s</span>
            </div>
            <p v-if="leaderboard.length === 0" class="speed__lb-empty">
              No scores yet — be the first!
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
const currentSpeed = ref(0)
const startTime = ref(0)
const elapsed = ref(0)
const finalTime = ref('0.00')
const tapFlash = ref(false)
const shaking = ref(false)
const playerName = ref('')
const playerEmail = ref('')
const scoreSubmitted = ref(false)
const leaderboard = ref([])
const ripples = ref([])
let rippleId = 0

let gameTimer = null

const arcLength = 283 // approximate arc path length

const needleAngle = computed(() => {
  // -90 at 0, +90 at 100
  return -90 + (currentSpeed.value / 100) * 180
})

const carOffset = computed(() => {
  return (currentSpeed.value / 100) * 60
})

const displayTime = computed(() => {
  return (elapsed.value / 1000).toFixed(2) + 's'
})

const resultMessage = computed(() => {
  const t = parseFloat(finalTime.value)
  if (t < 4) return 'Unbelievable! You have lightning reflexes!'
  if (t < 6) return 'Impressive speed! A true racer.'
  if (t < 8) return 'Solid performance. Try again to beat it!'
  return 'Keep tapping — you can do better!'
})

function lineStyle(i) {
  return {
    top: `${10 + (i * 10)}%`,
    animationDelay: `${i * 0.05}s`,
    width: `${20 + Math.random() * 40}px`,
  }
}

function startGame() {
  state.value = 'playing'
  currentSpeed.value = 0
  elapsed.value = 0
  startTime.value = Date.now()
  scoreSubmitted.value = false
  ripples.value = []

  gameTimer = setInterval(() => {
    elapsed.value = Date.now() - startTime.value
  }, 16)
}

function tap(e) {
  if (state.value !== 'playing') return

  const increment = 2 + Math.random()
  currentSpeed.value = Math.min(100, currentSpeed.value + increment)

  // Visual flash
  tapFlash.value = true
  setTimeout(() => { tapFlash.value = false }, 80)

  // Screen shake
  shaking.value = true
  setTimeout(() => { shaking.value = false }, 100)

  // Ripple effect
  const btn = e.currentTarget
  if (btn) {
    const rect = btn.getBoundingClientRect()
    const x = (e.clientX || e.touches?.[0]?.clientX || rect.width / 2) - rect.left
    const y = (e.clientY || e.touches?.[0]?.clientY || rect.height / 2) - rect.top
    const id = ++rippleId
    ripples.value.push({ id, x, y })
    setTimeout(() => {
      ripples.value = ripples.value.filter(r => r.id !== id)
    }, 600)
  }

  if (currentSpeed.value >= 100) {
    finishGame()
  }
}

function finishGame() {
  clearInterval(gameTimer)
  elapsed.value = Date.now() - startTime.value
  finalTime.value = (elapsed.value / 1000).toFixed(2)
  state.value = 'result'
}

function resetGame() {
  state.value = 'idle'
  currentSpeed.value = 0
  elapsed.value = 0
  playerName.value = ''
  playerEmail.value = ''
  scoreSubmitted.value = false
  ripples.value = []
}

async function submitScore() {
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
          score: finalTime.value,
          timestamp: new Date().toISOString(),
        }),
      })
    }
    scoreSubmitted.value = true
    leaderboard.value.push({ name: playerName.value, score: finalTime.value })
    leaderboard.value.sort((a, b) => parseFloat(a.score) - parseFloat(b.score))
    leaderboard.value = leaderboard.value.slice(0, 10)
  } catch {
    scoreSubmitted.value = true
  }
}

async function fetchLeaderboard() {
  if (!API.sheetsEndpoint) {
    leaderboard.value = [
      { name: 'Ahmad K.', score: '3.82' },
      { name: 'Sara M.', score: '4.15' },
      { name: 'Khaled R.', score: '4.67' },
      { name: 'Fatima A.', score: '5.01' },
      { name: 'Omar T.', score: '5.34' },
    ]
    return
  }
  try {
    const res = await fetch(`${API.sheetsEndpoint}?type=leaderboard`)
    const data = await res.json()
    if (Array.isArray(data)) {
      leaderboard.value = data.slice(0, 10)
    }
  } catch { /* empty */ }
}

function confettiStyle(i) {
  return {
    left: `${5 + Math.random() * 90}%`,
    animationDelay: `${i * 0.1}s`,
    background: i % 3 === 0 ? 'var(--color-accent)' : i % 3 === 1 ? 'var(--color-accent-hover)' : 'var(--color-text)',
    width: `${4 + Math.random() * 4}px`,
    height: `${4 + Math.random() * 4}px`,
    borderRadius: i % 2 === 0 ? '50%' : '1px',
  }
}

onMounted(() => {
  fetchLeaderboard()
})

onUnmounted(() => {
  clearInterval(gameTimer)
})
</script>

<style scoped>
.speed {
  background-color: var(--color-bg);
}

.speed__arena {
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-lg);
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  padding: 40px 24px;
  background: var(--color-surface);
  border: 1px solid rgba(200, 169, 110, 0.08);
}

.speed__arena--shake {
  animation: dashShake 0.1s ease;
}

@keyframes dashShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) translateY(1px); }
  75% { transform: translateX(2px) translateY(-1px); }
}

/* Edge glow */
.speed__edge-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  box-shadow: inset 0 0 80px rgba(200, 169, 110, 0.15);
  border-radius: 12px;
  transition: opacity 0.2s ease;
}

/* Carbon fiber texture */
.speed__carbon-bg {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  pointer-events: none;
  background-image:
    linear-gradient(45deg, #222 25%, transparent 25%),
    linear-gradient(-45deg, #222 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #222 75%),
    linear-gradient(-45deg, transparent 75%, #222 75%);
  background-size: 4px 4px;
  background-position: 0 0, 0 2px, 2px -2px, -2px 0;
}

/* ── Idle ── */
.speed__idle {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.speed__idle-visual {
  width: 200px;
  margin-bottom: 8px;
}

.speed__car-icon {
  width: 100%;
  color: var(--color-accent);
  opacity: 0.3;
}

.speed__instructions {
  font-size: var(--text-body);
  color: var(--color-muted);
  line-height: 1.8;
  max-width: 440px;
}

/* ── Playing ── */
.speed__playing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.speed__dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.speed__speedo {
  position: relative;
  width: clamp(240px, 50vw, 300px);
}

.speed__speedo-svg {
  width: 100%;
}

.speed__arc-progress {
  transition: stroke-dashoffset 0.15s ease;
  filter: drop-shadow(0 0 6px rgba(200, 169, 110, 0.4));
}

.speed__needle-group {
  transition: transform 0.15s ease-out;
  filter: drop-shadow(0 0 4px rgba(200, 169, 110, 0.3));
}

.speed__speed-display {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.speed__speed-num {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.speed__speed-unit {
  display: block;
  font-size: var(--text-small);
  letter-spacing: 0.1em;
  color: var(--color-muted);
  text-transform: uppercase;
}

.speed__timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.speed__timer-label {
  font-size: var(--text-small);
  letter-spacing: 0.2em;
  color: var(--color-muted);
  text-transform: uppercase;
}

.speed__timer-value {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-accent);
}

/* Speed lines */
.speed__lines {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 60px;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.speed__line {
  position: absolute;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
  opacity: 0.4;
  animation: lineSlide 0.3s linear infinite;
}

@keyframes lineSlide {
  0% { transform: translateX(0); opacity: 0.4; }
  100% { transform: translateX(-30px); opacity: 0; }
}

/* Car silhouette */
.speed__car-wrap {
  width: 160px;
  transition: transform 0.2s ease;
  margin-top: -8px;
}

.speed__car-moving {
  width: 100%;
  color: var(--color-accent);
  opacity: 0.25;
}

/* Tap zone */
.speed__tap-zone {
  width: 100%;
  max-width: 400px;
  padding: 50px 40px;
  background: rgba(200, 169, 110, 0.04);
  border: 2px solid rgba(200, 169, 110, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: background var(--duration-fast) ease, border-color var(--duration-fast) ease;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;
}

.speed__tap-zone:active,
.speed__tap-zone--flash {
  background: rgba(200, 169, 110, 0.1);
  border-color: var(--color-accent);
}

.speed__tap-label {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  pointer-events: none;
  position: relative;
  z-index: 1;
}

/* Tap ripple */
.speed__tap-ripple {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(200, 169, 110, 0.15);
  transform: translate(-50%, -50%) scale(0);
  animation: tapRipple 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes tapRipple {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
}

/* ── Result ── */
.speed__result {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.speed__result-celebration {
  position: absolute;
  inset: -60px;
  pointer-events: none;
  overflow: hidden;
}

.speed__confetti {
  position: absolute;
  top: 0;
  animation: confettiFall 2.5s ease-out forwards;
}

@keyframes confettiFall {
  0% { transform: translateY(-30px) rotate(0deg) scale(0); opacity: 1; }
  20% { transform: translateY(20px) rotate(90deg) scale(1); opacity: 1; }
  100% { transform: translateY(250px) rotate(360deg) scale(0.5); opacity: 0; }
}

.speed__result-car {
  width: 180px;
  color: var(--color-accent);
  opacity: 0.2;
  animation: carBounce 1s ease-out;
}

@keyframes carBounce {
  0% { transform: translateX(-50px); opacity: 0; }
  60% { transform: translateX(10px); opacity: 0.3; }
  100% { transform: translateX(0); opacity: 0.2; }
}

.speed__car-celebrate {
  width: 100%;
}

.speed__result-time {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.speed__result-num {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}

.speed__result-unit {
  font-size: var(--text-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-top: 4px;
}

.speed__result-msg {
  font-size: var(--text-body);
  color: var(--color-muted);
  max-width: 350px;
}

/* Submit form */
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
  background: var(--color-bg);
  border: 1px solid rgba(200, 169, 110, 0.12);
  border-radius: 4px;
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

/* ── Leaderboard ── */
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
  background: var(--color-bg);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  transition: border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
}

.speed__lb-entry:hover {
  border-color: rgba(200, 169, 110, 0.12);
}

.speed__lb-entry--gold {
  border-color: rgba(255, 215, 0, 0.15);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.05);
}
.speed__lb-entry--silver {
  border-color: rgba(192, 192, 192, 0.1);
}
.speed__lb-entry--bronze {
  border-color: rgba(205, 127, 50, 0.1);
}

.speed__lb-entry--gold .speed__trophy { color: #ffd700; }
.speed__lb-entry--silver .speed__trophy { color: #c0c0c0; }
.speed__lb-entry--bronze .speed__trophy { color: #cd7f32; }

.speed__lb-rank {
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.speed__trophy {
  width: 18px;
  height: 18px;
}

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
