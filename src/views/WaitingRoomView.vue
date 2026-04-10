<template>
  <section class="waiting-room">
    <!-- Tab navigation -->
    <div class="waiting-room__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="waiting-room__tab"
        :class="{ 'waiting-room__tab--active': activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab content area -->
    <div class="waiting-room__content">
      <Transition name="tab-fade" mode="out-in">
        <div :key="activeTab" class="waiting-room__panel">
          <BrandStory v-if="activeTab === 'story'" />
          <VehicleLineup v-else-if="activeTab === 'vehicles'" />
          <PerformanceStats v-else-if="activeTab === 'stats'" />
          <SpeedChallenge v-else-if="activeTab === 'speed'" />
          <div v-else-if="activeTab === 'quiz'" class="waiting-room__quiz-wrap">
            <Transition name="tab-fade">
              <div v-if="showLockedMsg" class="waiting-room__locked-msg glass-panel">
                <span class="waiting-room__locked-msg-icon">&#x1f512;</span>
                Complete the knowledge quiz to unlock the Invitation Room
              </div>
            </Transition>
            <QuizModule @quiz-complete="onQuizComplete" />
            <!-- Invitation unlocked banner -->
            <Transition name="tab-fade">
              <div v-if="justUnlocked" class="waiting-room__unlocked glass-panel glass-panel--deep">
                <div class="waiting-room__unlocked-icon">✦</div>
                <div class="waiting-room__unlocked-text">
                  <h3>Invitation Unlocked!</h3>
                  <p>You've earned access to the exclusive Invitation Room.</p>
                </div>
                <button class="waiting-room__unlocked-btn" @click="goToInvitation">
                  Enter Invitation Room →
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandStory from '../components/BrandStory.vue'
import VehicleLineup from '../components/VehicleLineup.vue'
import PerformanceStats from '../components/PerformanceStats.vue'
import SpeedChallenge from '../components/SpeedChallenge.vue'
import QuizModule from '../components/QuizModule.vue'

const route = useRoute()
const router = useRouter()

const tabs = [
  { id: 'story', label: 'Brand Story' },
  { id: 'vehicles', label: 'Vehicles' },
  { id: 'stats', label: 'Performance' },
  { id: 'speed', label: 'Speed Challenge' },
  { id: 'quiz', label: 'Knowledge Quiz' },
]

const activeTab = ref('story')
const justUnlocked = ref(false)
const showLockedMsg = ref(false)

onMounted(() => {
  // Check query params for tab pre-selection
  if (route.query.tab) {
    const match = tabs.find(t => t.id === route.query.tab)
    if (match) activeTab.value = match.id
  }

  // Show locked message if redirected from invitation
  if (route.query.locked === '1') {
    activeTab.value = 'quiz'
    showLockedMsg.value = true
    setTimeout(() => { showLockedMsg.value = false }, 5000)
  }
})

function switchTab(tabId) {
  activeTab.value = tabId
  window.__avatrSound?.playClick()
}

function onQuizComplete() {
  localStorage.setItem('avatr-quiz-completed', '1')
  justUnlocked.value = true
  window.__avatrSound?.playWhoosh()
}

function goToInvitation() {
  window.__avatrSound?.playWhoosh()
  router.push({ name: 'invitation' })
}
</script>

<style scoped>
.waiting-room {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-bg);
  padding-top: 80px;
}

/* Tabs */
.waiting-room__tabs {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 0 20px;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(6, 6, 8, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.waiting-room__tab {
  padding: 10px 20px;
  font-family: var(--font-display);
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
  border: 1px solid transparent;
  border-radius: 999px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: none;
}

.waiting-room__tab:hover {
  color: var(--color-text);
  border-color: rgba(255, 255, 255, 0.08);
}

.waiting-room__tab--active {
  color: var(--color-accent);
  border-color: rgba(200, 169, 110, 0.3);
  background: rgba(200, 169, 110, 0.06);
}

/* Content */
.waiting-room__content {
  position: relative;
  width: 100%;
}

.waiting-room__panel {
  width: 100%;
}

.waiting-room__quiz-wrap {
  position: relative;
}

/* Unlocked banner */
.waiting-room__unlocked {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 28px;
  max-width: 560px;
  width: calc(100% - 40px);
}

.waiting-room__unlocked-icon {
  font-size: 1.8rem;
  color: var(--color-accent);
  flex-shrink: 0;
}

.waiting-room__unlocked-text h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text);
  margin-bottom: 4px;
}

.waiting-room__unlocked-text p {
  font-size: 0.82rem;
  color: var(--color-muted);
}

.waiting-room__unlocked-btn {
  padding: 10px 20px;
  font-family: var(--font-display);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-bg);
  background: var(--color-accent);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.3s ease;
}

.waiting-room__unlocked-btn:hover {
  background: var(--color-accent-hover);
}

/* Locked message */
.waiting-room__locked-msg {
  text-align: center;
  padding: 16px 24px;
  margin: 0 auto 24px;
  max-width: 500px;
  font-size: 0.88rem;
  color: var(--color-accent);
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.waiting-room__locked-msg-icon {
  font-size: 1.1rem;
}

/* Tab transition */
.tab-fade-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.tab-fade-leave-active {
  transition: opacity 0.2s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.tab-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .waiting-room__tabs {
    gap: 2px;
  }

  .waiting-room__tab {
    padding: 8px 14px;
    font-size: 0.66rem;
  }

  .waiting-room__unlocked {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>
