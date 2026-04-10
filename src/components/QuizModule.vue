<template>
  <section class="quiz section" id="quiz">
    <div class="section__inner">
      <SectionHeading
        title="AVATR Knowledge Challenge"
        subtitle="Test what you've learned — unlock the Invitation Room"
      />

      <div class="quiz__container">
        <!-- Flash overlay -->
        <div
          class="quiz__flash"
          :class="{
            'quiz__flash--correct': answerState === 'correct',
            'quiz__flash--wrong': answerState === 'wrong'
          }"
          :key="flashKey"
        ></div>

        <!-- Progress bar -->
        <div class="quiz__progress">
          <div class="quiz__progress-fill" :style="{ width: progressPercent + '%' }"></div>
          <span class="quiz__progress-label">{{ currentQ + 1 }} / {{ questions.length }}</span>
        </div>

        <!-- Score indicator -->
        <div class="quiz__score-bar">
          <span class="quiz__score-correct">{{ correctCount }} correct</span>
          <span class="quiz__score-needed">{{ passingScore }} needed to unlock</span>
        </div>

        <!-- Question state -->
        <div v-if="!showResult" class="quiz__question-wrap" :key="currentQ">
          <!-- Visual hint -->
          <div v-if="questions[currentQ].hint" class="quiz__hint">
            <img
              v-if="currentHintImage"
              :src="currentHintImage"
              :alt="questions[currentQ].hint.image"
              class="quiz__hint-image"
            />
            <div v-else-if="questions[currentQ].hint.type === 'stat'" class="quiz__hint-stat">
              <span class="quiz__hint-value">{{ questions[currentQ].hint.value }}</span>
              <span class="quiz__hint-unit">{{ questions[currentQ].hint.unit }}</span>
              <span class="quiz__hint-label">{{ questions[currentQ].hint.label }}</span>
            </div>
            <p v-else class="quiz__hint-text">{{ questions[currentQ].hint.content }}</p>
          </div>

          <h3 class="quiz__question">{{ questions[currentQ].question }}</h3>

          <div class="quiz__options">
            <button
              v-for="(opt, i) in questions[currentQ].options"
              :key="i"
              class="quiz__option"
              :class="{
                'quiz__option--selected': selectedOption === i && answerState === null,
                'quiz__option--correct': answerState !== null && i === questions[currentQ].correctIndex,
                'quiz__option--wrong': answerState === 'wrong' && selectedOption === i
              }"
              :disabled="answerState !== null"
              @click="selectOption(i)"
            >
              <span class="quiz__option-indicator">
                <svg v-if="answerState !== null && i === questions[currentQ].correctIndex" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  <path d="M6 10 L9 13 L14 7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="answerState === 'wrong' && selectedOption === i" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  <path d="M7 7 L13 13 M13 7 L7 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <svg v-else viewBox="0 0 20 20" fill="none">
                  <path d="M10 2 L18 8 L15 18 H5 L2 8 Z" stroke="currentColor" stroke-width="1.2" fill="none"/>
                </svg>
              </span>
              <span class="quiz__option-text">{{ opt.text }}</span>
            </button>
          </div>

          <!-- Explanation after answering -->
          <Transition name="quiz-fade">
            <p v-if="answerState" class="quiz__explanation">
              {{ questions[currentQ].explanation }}
            </p>
          </Transition>
        </div>

        <!-- Result state -->
        <div v-else class="quiz__result">
          <div class="quiz__result-score">
            <span class="quiz__result-score-num">{{ correctCount }}</span>
            <span class="quiz__result-score-sep">/</span>
            <span class="quiz__result-score-total">{{ questions.length }}</span>
          </div>
          <div class="quiz__result-content">
            <h3 class="quiz__result-name">{{ passed ? 'Congratulations!' : 'Not Quite...' }}</h3>
            <p class="quiz__result-desc">
              {{ passed
                ? 'You\'ve proven your AVATR knowledge. The Invitation Room is now unlocked.'
                : `You need at least ${passingScore} correct answers to unlock the Invitation Room. Explore the other tabs to learn more, then try again!`
              }}
            </p>
            <div class="quiz__result-actions">
              <MagneticButton @click="resetQuiz">
                {{ passed ? 'Retake Quiz' : 'Try Again' }}
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import SectionHeading from './SectionHeading.vue'
import MagneticButton from './MagneticButton.vue'
import quizData from '../data/quiz.json'

const questions = quizData.questions
const passingScore = quizData.passingScore

const emit = defineEmits(['quiz-complete'])

const currentQ = ref(0)
const selectedOption = ref(null)
const answerState = ref(null) // null | 'correct' | 'wrong'
const correctCount = ref(0)
const showResult = ref(false)
const flashKey = ref(0)

const imageModules = import.meta.glob('../assets/avatr-*.png', { eager: true })

const progressPercent = computed(() => {
  if (showResult.value) return 100
  return (currentQ.value / questions.length) * 100
})

const passed = computed(() => correctCount.value >= passingScore)

const currentHintImage = computed(() => {
  const hint = questions[currentQ.value]?.hint
  if (hint?.type === 'vehicle' && hint.image) {
    const key = Object.keys(imageModules).find(k => k.includes(hint.image))
    return key ? imageModules[key].default : null
  }
  return null
})

function selectOption(i) {
  if (answerState.value !== null) return
  selectedOption.value = i

  const isCorrect = i === questions[currentQ.value].correctIndex
  answerState.value = isCorrect ? 'correct' : 'wrong'
  flashKey.value++

  if (isCorrect) {
    correctCount.value++
    window.__avatrSound?.playCorrect()
  } else {
    window.__avatrSound?.playWrong()
  }

  setTimeout(() => {
    if (currentQ.value < questions.length - 1) {
      currentQ.value++
      selectedOption.value = null
      answerState.value = null
    } else {
      showResult.value = true
      if (passed.value) {
        emit('quiz-complete')
      }
    }
  }, 1400)
}

function resetQuiz() {
  currentQ.value = 0
  selectedOption.value = null
  answerState.value = null
  correctCount.value = 0
  showResult.value = false
  flashKey.value = 0
}
</script>

<style scoped>
.quiz {
  background-color: var(--color-surface);
}

.quiz__container {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

/* Flash overlay */
.quiz__flash {
  position: absolute;
  inset: -20px;
  pointer-events: none;
  border-radius: 16px;
  opacity: 0;
  z-index: 10;
}

.quiz__flash--correct {
  background: radial-gradient(circle at center, rgba(80, 200, 120, 0.15), transparent 70%);
  animation: flashFade 0.8s ease-out forwards;
}

.quiz__flash--wrong {
  background: radial-gradient(circle at center, rgba(220, 80, 80, 0.12), transparent 70%);
  animation: flashFade 0.6s ease-out forwards;
}

@keyframes flashFade {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Progress bar */
.quiz__progress {
  position: relative;
  width: 100%;
  height: 3px;
  background: rgba(200, 169, 110, 0.1);
  border-radius: 2px;
  margin-bottom: 12px;
  overflow: hidden;
}

.quiz__progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.quiz__progress-label {
  position: absolute;
  right: 0;
  top: 10px;
  font-size: var(--text-small);
  letter-spacing: 0.1em;
  color: var(--color-muted);
}

/* Score bar */
.quiz__score-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-top: 16px;
}

.quiz__score-correct {
  font-family: var(--font-display);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  font-weight: 500;
}

.quiz__score-needed {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  text-transform: uppercase;
}

/* Hint area */
.quiz__hint {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.quiz__hint-image {
  width: 100%;
  max-width: 280px;
  border-radius: 8px;
  opacity: 0.8;
  filter: drop-shadow(0 4px 20px rgba(200, 169, 110, 0.15));
}

.quiz__hint-stat {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  padding: 16px 24px;
  background: rgba(200, 169, 110, 0.06);
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: 12px;
}

.quiz__hint-value {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.quiz__hint-unit {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-accent);
  opacity: 0.7;
}

.quiz__hint-label {
  font-size: 0.72rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-left: 12px;
}

.quiz__hint-text {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.88rem;
  font-style: italic;
  padding: 12px 20px;
  background: rgba(200, 169, 110, 0.04);
  border-left: 2px solid rgba(200, 169, 110, 0.3);
  border-radius: 0 8px 8px 0;
}

/* Question */
.quiz__question-wrap {
  animation: quizSlideIn 0.4s ease-out;
}

@keyframes quizSlideIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

.quiz__question {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 500;
  color: var(--color-text);
  letter-spacing: 0.03em;
  margin-bottom: 28px;
  text-align: center;
}

.quiz__options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quiz__option {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: var(--glass-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  box-shadow: var(--glass-shadow);
  position: relative;
  overflow: hidden;
}

.quiz__option::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--glass-shine);
  pointer-events: none;
  border-radius: inherit;
}

.quiz__option:hover:not(:disabled) {
  border-color: var(--glass-border-hover);
  background: var(--glass-bg-hover);
  box-shadow: var(--glass-shadow-hover);
}

.quiz__option:disabled {
  cursor: default;
}

.quiz__option--selected {
  border-color: rgba(200, 169, 110, 0.5);
  background: rgba(200, 169, 110, 0.1);
  box-shadow: 0 0 30px rgba(200, 169, 110, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.quiz__option--correct {
  border-color: rgba(80, 200, 120, 0.6) !important;
  background: rgba(80, 200, 120, 0.1) !important;
  box-shadow: 0 0 24px rgba(80, 200, 120, 0.15), inset 0 1px 0 rgba(80, 200, 120, 0.1);
}

.quiz__option--wrong {
  border-color: rgba(220, 80, 80, 0.6) !important;
  background: rgba(220, 80, 80, 0.08) !important;
  box-shadow: 0 0 24px rgba(220, 80, 80, 0.12);
  animation: shakeWrong 0.4s ease;
}

@keyframes shakeWrong {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.quiz__option-indicator {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--color-accent);
  opacity: 0.3;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.quiz__option:hover:not(:disabled) .quiz__option-indicator {
  opacity: 0.6;
  transform: scale(1.1);
}

.quiz__option--selected .quiz__option-indicator {
  opacity: 1;
  transform: scale(1.15);
}

.quiz__option--correct .quiz__option-indicator {
  color: rgb(80, 200, 120);
  opacity: 1;
}

.quiz__option--wrong .quiz__option-indicator {
  color: rgb(220, 80, 80);
  opacity: 1;
}

.quiz__option-indicator svg {
  width: 100%;
  height: 100%;
}

.quiz__option-text {
  font-size: var(--text-body);
  color: var(--color-text);
  letter-spacing: 0.02em;
}

/* Explanation */
.quiz__explanation {
  text-align: center;
  color: var(--color-accent);
  font-size: 0.88rem;
  margin-top: 20px;
  line-height: 1.6;
  padding: 12px 16px;
  background: rgba(200, 169, 110, 0.06);
  border-radius: 8px;
}

.quiz-fade-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.quiz-fade-leave-active {
  transition: opacity 0.2s ease;
}
.quiz-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.quiz-fade-leave-to {
  opacity: 0;
}

/* Result */
.quiz__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  animation: quizFadeIn 0.6s ease-out;
}

@keyframes quizFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.quiz__result-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.quiz__result-score-num {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.02em;
}

.quiz__result-score-sep {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-muted);
  margin: 0 4px;
}

.quiz__result-score-total {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 300;
  color: var(--color-muted);
}

.quiz__result-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.quiz__result-name {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text);
}

.quiz__result-desc {
  font-size: var(--text-body);
  color: var(--color-muted);
  line-height: 1.7;
  max-width: 450px;
  margin-top: 8px;
}

.quiz__result-actions {
  margin-top: 16px;
  display: flex;
  gap: 16px;
}
</style>
