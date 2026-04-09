<template>
  <section class="quiz section" id="quiz">
    <div class="section__inner">
      <SectionHeading
        title="Which AVATR Suits Your Drive?"
        subtitle="Five questions to find your perfect match"
      />

      <div class="quiz__container">
        <!-- Progress bar -->
        <div class="quiz__progress">
          <div class="quiz__progress-fill" :style="{ width: progressPercent + '%' }"></div>
          <span class="quiz__progress-label">{{ currentQ + 1 }} / {{ questions.length }}</span>
        </div>

        <!-- Question state -->
        <div v-if="!showResult" class="quiz__question-wrap" :key="currentQ">
          <h3 class="quiz__question">{{ questions[currentQ].question }}</h3>
          <div class="quiz__options">
            <button
              v-for="(opt, i) in questions[currentQ].options"
              :key="i"
              class="quiz__option"
              :class="{ 'quiz__option--selected': selectedOption === i }"
              @click="selectOption(i)"
            >
              <span class="quiz__option-indicator">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M10 2 L18 8 L15 18 H5 L2 8 Z" stroke="currentColor" stroke-width="1.2" fill="none"/>
                </svg>
              </span>
              <span class="quiz__option-text">{{ opt.text }}</span>
            </button>
          </div>
        </div>

        <!-- Result state -->
        <div v-else class="quiz__result">
          <div class="quiz__result-image-wrap">
            <img :src="resultImage" :alt="resultData.name" class="quiz__result-image" />
            <div class="quiz__result-image-glow"></div>
          </div>
          <div class="quiz__result-content">
            <span class="quiz__result-match">Your Match</span>
            <h3 class="quiz__result-name">{{ resultData.name }}</h3>
            <span class="quiz__result-type">{{ resultData.type }}</span>
            <p class="quiz__result-desc">{{ resultData.description }}</p>
            <div class="quiz__result-actions">
              <MagneticButton @click="resetQuiz">
                Retake Quiz
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
const results = quizData.results

const emit = defineEmits(['quiz-complete'])

const currentQ = ref(0)
const selectedOption = ref(null)
const showResult = ref(false)
const scores = ref({ 'avatr-11': 0, 'avatr-12': 0, 'avatr-06': 0 })

const imageModules = import.meta.glob('../assets/avatr-*.png', { eager: true })

const progressPercent = computed(() => {
  if (showResult.value) return 100
  return (currentQ.value / questions.length) * 100
})

const resultVehicle = computed(() => {
  const s = scores.value
  return Object.entries(s).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
})

const resultData = computed(() => results[resultVehicle.value])

const resultImage = computed(() => {
  const img = resultData.value.image
  const key = Object.keys(imageModules).find(k => k.includes(img))
  return key ? imageModules[key].default : ''
})

function selectOption(i) {
  selectedOption.value = i

  // Tally scores
  const optScores = questions[currentQ.value].options[i].scores
  for (const [vehicle, score] of Object.entries(optScores)) {
    scores.value[vehicle] += score
  }

  // Advance after brief delay for visual feedback
  setTimeout(() => {
    if (currentQ.value < questions.length - 1) {
      currentQ.value++
      selectedOption.value = null
    } else {
      showResult.value = true
      emit('quiz-complete')
    }
  }, 400)
}

function resetQuiz() {
  currentQ.value = 0
  selectedOption.value = null
  showResult.value = false
  scores.value = { 'avatr-11': 0, 'avatr-12': 0, 'avatr-06': 0 }
}
</script>

<style scoped>
.quiz {
  background-color: var(--color-surface);
}

.quiz__container {
  max-width: 600px;
  margin: 0 auto;
}

/* Progress bar */
.quiz__progress {
  position: relative;
  width: 100%;
  height: 3px;
  background: rgba(200, 169, 110, 0.1);
  border-radius: 2px;
  margin-bottom: 40px;
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

.quiz__option:hover {
  border-color: var(--glass-border-hover);
  background: var(--glass-bg-hover);
  box-shadow: var(--glass-shadow-hover);
}

.quiz__option--selected {
  border-color: rgba(200, 169, 110, 0.5);
  background: rgba(200, 169, 110, 0.1);
  box-shadow: 0 0 30px rgba(200, 169, 110, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.quiz__option-indicator {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--color-accent);
  opacity: 0.3;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.quiz__option:hover .quiz__option-indicator {
  opacity: 0.6;
  transform: scale(1.1);
}

.quiz__option--selected .quiz__option-indicator {
  opacity: 1;
  transform: scale(1.15);
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

.quiz__result-image-wrap {
  position: relative;
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
}

.quiz__result-image {
  width: 100%;
  height: auto;
  display: block;
}

.quiz__result-image-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center bottom, rgba(200, 169, 110, 0.1), transparent 70%);
  pointer-events: none;
}

.quiz__result-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.quiz__result-match {
  font-size: var(--text-small);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
  font-weight: 500;
}

.quiz__result-name {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text);
}

.quiz__result-type {
  font-size: var(--text-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted);
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
