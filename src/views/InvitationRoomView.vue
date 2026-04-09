<template>
  <section class="invitation-room">
    <div class="invitation-room__inner">
      <!-- Premium header -->
      <div class="invitation-room__header">
        <div class="invitation-room__glow"></div>
        <span class="invitation-room__badge">✦ Exclusive Access</span>
        <img :src="emblemWhite" alt="" class="invitation-room__emblem" />
        <h2 class="invitation-room__title">You're Invited</h2>
        <p class="invitation-room__subtitle">
          You've completed the journey. This room is your reward.
        </p>
      </div>

      <!-- Tabs: RSVP + Exclusive Content -->
      <div class="invitation-room__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="invitation-room__tab"
          :class="{ 'invitation-room__tab--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <Transition name="tab-fade" mode="out-in">
        <!-- RSVP Form -->
        <div v-if="activeTab === 'rsvp'" :key="'rsvp'" class="invitation-room__rsvp">
          <SignupSection />
        </div>

        <!-- Exclusive Content -->
        <div v-else :key="'exclusive'" class="invitation-room__exclusive">
          <div class="invitation-room__teaser-grid">
            <div class="invitation-room__teaser-card glass-panel glass-panel--deep">
              <span class="invitation-room__teaser-label">Behind the Design</span>
              <p class="invitation-room__teaser-text">
                The AVATR 011 was sculpted using emotional design language — every curve was crafted
                to evoke motion even when standing still. The signature diamond DRL and flowing
                roofline pay homage to the brand's emblem geometry.
              </p>
            </div>
            <div class="invitation-room__teaser-card glass-panel glass-panel--deep">
              <span class="invitation-room__teaser-label">Hidden Specs</span>
              <div class="invitation-room__specs">
                <div class="invitation-room__spec">
                  <span class="invitation-room__spec-value">2,880mm</span>
                  <span class="invitation-room__spec-label">Wheelbase</span>
                </div>
                <div class="invitation-room__spec">
                  <span class="invitation-room__spec-value">HarmonyOS 4</span>
                  <span class="invitation-room__spec-label">Cockpit System</span>
                </div>
                <div class="invitation-room__spec">
                  <span class="invitation-room__spec-value">34 Sensors</span>
                  <span class="invitation-room__spec-label">ADS 3.0 Suite</span>
                </div>
                <div class="invitation-room__spec">
                  <span class="invitation-room__spec-value">0.21 Cd</span>
                  <span class="invitation-room__spec-label">Drag Coefficient</span>
                </div>
              </div>
            </div>
            <div class="invitation-room__teaser-card glass-panel glass-panel--deep">
              <span class="invitation-room__teaser-label">Premiere Night Hint</span>
              <p class="invitation-room__teaser-text">
                The virtual event will reveal more than just the car. A second surprise is locked
                until premiere night — stay tuned for an experience that goes beyond the expected.
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import SignupSection from '../components/SignupSection.vue'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'

const tabs = [
  { id: 'rsvp', label: 'Reserve Your Seat' },
  { id: 'exclusive', label: 'Exclusive Content' },
]

const activeTab = ref('rsvp')
</script>

<style scoped>
.invitation-room {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 50% 20%, rgba(200,169,110,0.06), transparent 50%),
    var(--color-bg);
  overflow: hidden;
}

.invitation-room__inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 20px 60px;
}

/* Header */
.invitation-room__header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  margin-bottom: 40px;
}

.invitation-room__glow {
  position: absolute;
  top: -80px;
  left: 50%;
  width: 600px;
  height: 400px;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(200,169,110,0.1), transparent 60%);
  pointer-events: none;
  animation: goldBreathe 6s ease-in-out infinite;
}

.invitation-room__badge {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
  padding: 6px 18px;
  border: 1px solid rgba(200,169,110,0.3);
  border-radius: 999px;
  background: rgba(200,169,110,0.06);
}

.invitation-room__emblem {
  width: 36px;
  opacity: 0.7;
}

.invitation-room__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 300;
  letter-spacing: 0.05em;
  color: var(--color-text);
}

.invitation-room__subtitle {
  font-size: 0.82rem;
  color: var(--color-muted);
  max-width: 400px;
}

/* Tabs */
.invitation-room__tabs {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 32px;
}

.invitation-room__tab {
  padding: 10px 24px;
  font-family: var(--font-display);
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  background: none;
  transition: all 0.3s ease;
}

.invitation-room__tab:hover {
  color: var(--color-text);
}

.invitation-room__tab--active {
  color: var(--color-accent);
  border-color: rgba(200,169,110,0.3);
  background: rgba(200,169,110,0.06);
}

/* Exclusive content */
.invitation-room__teaser-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.invitation-room__teaser-card {
  padding: 28px 24px;
}

.invitation-room__teaser-label {
  display: block;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 12px;
}

.invitation-room__teaser-text {
  color: var(--color-text);
  line-height: 1.7;
  opacity: 0.85;
}

.invitation-room__specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.invitation-room__spec {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.invitation-room__spec-value {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
}

.invitation-room__spec-label {
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
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
  .invitation-room__specs {
    grid-template-columns: 1fr;
  }
}
</style>
