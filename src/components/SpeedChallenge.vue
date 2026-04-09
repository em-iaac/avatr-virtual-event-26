<template>
  <section class="speed section" id="challenge">
    <div class="section__inner">
      <SectionHeading
        title="0–100 Challenge"
        subtitle="How fast can you launch the AVATR?"
      />

      <div class="speed__arena">
        <!-- IDLE state -->
        <div v-if="state === 'idle'" class="speed__idle">
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
          <!-- Speedometer -->
          <div class="speed__meter">
            <svg class="speed__meter-svg" viewBox="0 0 200 120" fill="none">
              <!-- Track arc -->
              <path
                d="M 20 110 A 80 80 0 0 1 180 110"
                stroke="rgba(200,169,110,0.12)"
                stroke-width="6"
                stroke-linecap="round"
                fill="none"
              />
              <!-- Progress arc -->
              <path
                ref="arcRef"
                d="M 20 110 A 80 80 0 0 1 180 110"
                stroke="var(--color-accent)"
                stroke-width="6"
                stroke-linecap="round"
                fill="none"
                :stroke-dasharray="arcLength"
                :stroke-dashoffset="arcLength - (arcLength * currentSpeed) / 100"
              />
            </svg>
            <div class="speed__speed-display">
              <span class="speed__speed-num">{{ Math.floor(currentSpeed) }}</span>
              <span class="speed__speed-unit">km/h</span>
            </div>
          </div>

          <!-- Timer -->
          <div class="speed__timer">{{ displayTime }}</div>

          <!-- Tap zone -->
          <button
            class="speed__tap-zone"
            @mousedown="tap"
            @touchstart.prevent="tap"
            :class="{ 'speed__tap-zone--flash': tapFlash }"
          >
            <span class="speed__tap-label">TAP!</span>
          </button>

          <!-- Motion lines -->
          <div class="speed__motion" :style="{ opacity: currentSpeed / 100 }">
            <span v-for="i in 5" :key="i" class="speed__motion-line"></span>
          </div>
        </div>

        <!-- RESULT state -->
        <div v-if="state === 'result'" class="speed__result">
          <div class="speed__result-celebration">
            <span v-for="i in 8" :key="i" class="speed__confetti" :style="confettiStyle(i)"></span>
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
              :class="{ 'speed__lb-entry--gold': i === 0, 'speed__lb-entry--silver': i === 1, 'speed__lb-entry--bronze': i === 2 }"
            >
              <span class="speed__lb-rank">{{ i + 1 }}</span>
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

const state = ref('idle') // idle | playing | result
const currentSpeed = ref(0)
const startTime = ref(0)
const elapsed = ref(0)
const finalTime = ref('0.00')
const tapFlash = ref(false)
const playerName = ref('')
const playerEmail = ref('')
const scoreSubmitted = ref(false)
const leaderboard = ref([])

let gameTimer = null

// Arc length for the SVG speedometer
const arcLength = 251 // approximate length of the semicircle path

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

function startGame() {
  state.value = 'playing'
  currentSpeed.value = 0
  elapsed.value = 0
  startTime.value = Date.now()
  scoreSubmitted.value = false

  gameTimer = setInterval(() => {
    elapsed.value = Date.now() - startTime.value
  }, 16)
}

function tap() {
  if (state.value !== 'playing') return

  // Each tap adds 2-3 speed
  const increment = 2 + Math.random()
  currentSpeed.value = Math.min(100, currentSpeed.value + increment)

  // Visual flash
  tapFlash.value = true
  setTimeout(() => { tapFlash.value = false }, 80)

  // Check if reached 100
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
    // Add to local leaderboard
    leaderboard.value.push({ name: playerName.value, score: finalTime.value })
    leaderboard.value.sort((a, b) => parseFloat(a.score) - parseFloat(b.score))
    leaderboard.value = leaderboard.value.slice(0, 10)
  } catch {
    scoreSubmitted.value = true
  }
}

async function fetchLeaderboard() {
  if (!API.sheetsEndpoint) {
    // Demo data when no backend configured
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
  } catch {
    // Use empty if fetch fails
  }
}

function confettiStyle(i) {
  return {
    left: `${10 + Math.random() * 80}%`,
    animationDelay: `${i * 0.15}s`,
    background: i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-accent-hover)',
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
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-lg);
}

/* ── Idle ── */
.speed__idle {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
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
  gap: 24px;
  width: 100%;
  position: relative;
}

.speed__meter {
  position: relative;
  width: 240px;
}

.speed__meter-svg {
  width: 100%;
}

.speed__speed-display {
  position: absolute;
  bottom: 10px;
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
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--color-accent);
}

.speed__tap-zone {
  width: 100%;
  max-width: 400px;
  padding: 60px 40px;
  background: var(--color-surface);
  border: 2px solid rgba(200, 169, 110, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: background var(--duration-fast) ease, border-color var(--duration-fast) ease;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.speed__tap-zone:active,
.speed__tap-zone--flash {
  background: rgba(200, 169, 110, 0.08);
  border-color: var(--color-accent);
}

.speed__tap-label {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  pointer-events: none;
}

/* Motion lines */
.speed__motion {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.speed__motion-line {
  width: 30px;
  height: 2px;
  background: var(--color-accent);
  opacity: 0.3;
  animation: motionSlide 0.4s linear infinite;
}

.speed__motion-line:nth-child(2) { animation-delay: 0.08s; width: 20px; }
.speed__motion-line:nth-child(3) { animation-delay: 0.16s; width: 35px; }
.speed__motion-line:nth-child(4) { animation-delay: 0.24s; width: 15px; }
.speed__motion-line:nth-child(5) { animation-delay: 0.32s; width: 25px; }

@keyframes motionSlide {
  0% { transform: translateX(0); opacity: 0.3; }
  100% { transform: translateX(-20px); opacity: 0; }
}

/* ── Result ── */
.speed__result {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
}

.speed__result-celebration {
  position: absolute;
  inset: -40px;
  pointer-events: none;
  overflow: hidden;
}

.speed__confetti {
  position: absolute;
  top: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: confettiFall 2s ease-out forwards;
}

@keyframes confettiFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
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
  background: var(--color-surface);
  border: 1px solid rgba(200, 169, 110, 0.12);
  border-radius: 4px;
  outline: none;
  transition: border-color var(--duration-fast) ease;
}

.speed__submit-input::placeholder {
  color: rgba(240, 240, 240, 0.2);
}

.speed__submit-input:focus {
  border-color: var(--color-accent);
}

.speed__submit-btn {
  width: 100%;
}

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
  background: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  transition: border-color var(--duration-fast) ease;
}

.speed__lb-entry:hover {
  border-color: rgba(200, 169, 110, 0.12);
}

.speed__lb-entry--gold .speed__lb-rank { color: #ffd700; }
.speed__lb-entry--silver .speed__lb-rank { color: #c0c0c0; }
.speed__lb-entry--bronze .speed__lb-rank { color: #cd7f32; }

.speed__lb-rank {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-muted);
  min-width: 24px;
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
