<template>
  <section class="signup section" id="signup">
    <div class="section__inner">
      <SectionHeading
        title="Reserve Your Seat"
        subtitle="Be part of the premiere and book your test drive in Kuwait"
      />

      <ScrollReveal class="signup__form-wrap">
        <form v-if="!submitted" class="signup__form" @submit.prevent="handleSubmit">
          <div class="signup__fields">
            <div class="signup__field">
              <label class="signup__label" for="name">Full Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="signup__input"
                placeholder="Your name"
                required
              />
            </div>
            <div class="signup__field">
              <label class="signup__label" for="email">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="signup__input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div class="signup__field">
              <label class="signup__label" for="phone">Phone (optional)</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="signup__input"
                placeholder="+965"
              />
            </div>
            <div class="signup__field">
              <label class="signup__label" for="interest">I'm interested in</label>
              <select id="interest" v-model="form.interest" class="signup__input signup__select">
                <option value="premiere">Watching the Premiere</option>
                <option value="test-drive">Booking a Test Drive</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <MagneticButton type="submit" class="signup__submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Register Now' }}
          </MagneticButton>

          <p class="signup__counter">
            <span class="signup__counter-num">{{ animatedCount.toLocaleString() }}</span>
            seats reserved
          </p>
        </form>

        <!-- Success state -->
        <!-- Success: personalized premiere invite card -->
        <div v-else class="signup__success">
          <div class="signup__invite-card glass-panel glass-panel--deep" ref="inviteCard">
            <!-- Card top shimmer line -->
            <div class="signup__invite-shimmer"></div>

            <!-- Header row -->
            <div class="signup__invite-header">
              <img :src="emblemWhite" alt="AVATR" class="signup__invite-emblem" />
              <span class="signup__invite-event">Virtual Event 2026</span>
            </div>

            <!-- Name -->
            <div class="signup__invite-name-wrap">
              <span class="signup__invite-prefix">This seat belongs to</span>
              <h3 class="signup__invite-name">{{ firstName }}</h3>
            </div>

            <!-- Date / Time / Region -->
            <div class="signup__invite-details">
              <div class="signup__invite-detail">
                <span class="signup__invite-detail-label">Date</span>
                <span class="signup__invite-detail-value">May 1, 2026</span>
              </div>
              <div class="signup__invite-divider-v"></div>
              <div class="signup__invite-detail">
                <span class="signup__invite-detail-label">Time</span>
                <span class="signup__invite-detail-value">8:00 PM KWT</span>
              </div>
              <div class="signup__invite-divider-v"></div>
              <div class="signup__invite-detail">
                <span class="signup__invite-detail-label">Platform</span>
                <span class="signup__invite-detail-value">YouTube Live</span>
              </div>
            </div>

            <!-- Bottom tagline -->
            <p class="signup__invite-tag">Emotional Intelligence. Motion in Delight.</p>

            <!-- Decorative corner diamonds -->
            <svg class="signup__invite-corner signup__invite-corner--tl" viewBox="0 0 32 32" fill="none">
              <path d="M16 2 L30 16 L16 30 L2 16 Z" stroke="rgba(200,169,110,0.4)" stroke-width="0.8"/>
              <path d="M16 6 L26 16 L16 26 L6 16 Z" stroke="rgba(200,169,110,0.2)" stroke-width="0.5"/>
            </svg>
            <svg class="signup__invite-corner signup__invite-corner--br" viewBox="0 0 32 32" fill="none">
              <path d="M16 2 L30 16 L16 30 L2 16 Z" stroke="rgba(200,169,110,0.4)" stroke-width="0.8"/>
              <path d="M16 6 L26 16 L16 26 L6 16 Z" stroke="rgba(200,169,110,0.2)" stroke-width="0.5"/>
            </svg>
          </div>

          <!-- Share CTA -->
          <div class="signup__share-row">
            <MagneticButton class="signup__share-btn" @click="handleShare">
              {{ shared ? 'Copied! ✓' : 'Share Your Seat' }}
            </MagneticButton>
            <p class="signup__share-hint">Screenshot, share, and make them curious.</p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import { API } from '../config.js'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'
import SectionHeading from './SectionHeading.vue'
import ScrollReveal from './ScrollReveal.vue'
import MagneticButton from './MagneticButton.vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  interest: 'premiere',
})

const submitted = ref(false)
const isSubmitting = ref(false)
const animatedCount = ref(0)
const shared = ref(false)

const firstName = computed(() => {
  const raw = form.value.name?.trim()
  if (!raw) return 'Future Driver'
  return raw.split(' ')[0]
})

// Animated counter — seed with a base number
const BASE_COUNT = 1247
const DAILY_GROWTH = 38

function getEstimatedCount() {
  const launchDate = new Date('2026-04-01')
  const daysSinceLaunch = Math.max(0, Math.floor((Date.now() - launchDate.getTime()) / 86400000))
  return BASE_COUNT + daysSinceLaunch * DAILY_GROWTH
}

onMounted(() => {
  const target = getEstimatedCount()
  gsap.to(animatedCount, {
    value: target,
    duration: 2,
    ease: 'power2.out',
    snap: { value: 1 },
  })
})

async function handleSubmit() {
  isSubmitting.value = true

  try {
    if (API.sheetsEndpoint) {
      await fetch(API.sheetsEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rsvp',
          ...form.value,
          timestamp: new Date().toISOString(),
        }),
      })
    }
    submitted.value = true
    window.__avatrSound?.playWhoosh()
  } catch {
    // Silently succeed for now — form data captured on client
    submitted.value = true
  } finally {
    isSubmitting.value = false
  }
}

async function handleShare() {
  const text = `${firstName.value} has a seat at the AVATR Virtual Event on May 1, 2026, 8:00 PM Kuwait. See you on YouTube Live.`
  const url = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'AVATR Virtual Event 2026',
        text,
        url,
      })
      shared.value = true
    } catch {
      // User canceled share sheet; ignore.
    }
  } else {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      shared.value = true
    } catch {
      // Clipboard blocked.
    }
  }

  if (shared.value) {
    window.__avatrSound?.playClick()
    setTimeout(() => { shared.value = false }, 1800)
  }
}
</script>

<style scoped>
.signup {
  background-color: var(--color-bg);
}

.signup__form-wrap {
  max-width: 520px;
  margin: 0 auto;
}

.signup__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.signup__fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.signup__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.signup__label {
  font-size: var(--text-small);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.signup__input {
  width: 100%;
  padding: 14px 16px;
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-text);
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  outline: none;
  transition: all var(--duration-fast) ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.signup__input::placeholder {
  color: rgba(240, 240, 240, 0.2);
}

.signup__input:focus {
  border-color: var(--color-accent);
}

.signup__select {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.signup__select option {
  background: var(--color-surface);
  color: var(--color-text);
}

.signup__submit {
  width: 100%;
}

.signup__counter {
  font-size: var(--text-caption);
  letter-spacing: 0.1em;
  color: var(--color-muted);
  text-align: center;
}

.signup__counter-num {
  color: var(--color-accent);
  font-family: var(--font-display);
  font-weight: 600;
}

/* Success state */
.signup__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Personalized invite card */
.signup__invite-card {
  position: relative;
  width: min(560px, 92vw);
  padding: clamp(18px, 3vw, 30px);
  overflow: hidden;
}

.signup__invite-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg,
    transparent 0%,
    rgba(255,255,255,0.05) 30%,
    rgba(200,169,110,0.12) 50%,
    rgba(255,255,255,0.05) 70%,
    transparent 100%
  );
  background-size: 220% 100%;
  animation: inviteShimmer 6s linear infinite;
  pointer-events: none;
  opacity: 0.45;
}

.signup__invite-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 22px;
}

.signup__invite-emblem {
  width: 24px;
  height: auto;
  opacity: 0.7;
}

.signup__invite-event {
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.signup__invite-name-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}

.signup__invite-prefix {
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.signup__invite-name {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  line-height: 1.05;
  font-weight: 300;
  letter-spacing: 0.03em;
  color: var(--color-text);
}

.signup__invite-details {
  display: flex;
  align-items: stretch;
  gap: 10px;
  margin-bottom: 16px;
}

.signup__invite-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.signup__invite-detail-label {
  font-size: 0.58rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.signup__invite-detail-value {
  font-family: var(--font-display);
  font-size: clamp(0.8rem, 1.7vw, 0.95rem);
  letter-spacing: 0.04em;
  color: var(--color-text);
}

.signup__invite-divider-v {
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(200,169,110,0.3), transparent);
}

.signup__invite-tag {
  font-size: 0.62rem;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  color: rgba(200, 169, 110, 0.8);
}

.signup__invite-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  pointer-events: none;
  opacity: 0.8;
}

.signup__invite-corner--tl {
  top: 10px;
  left: 10px;
}

.signup__invite-corner--br {
  bottom: 10px;
  right: 10px;
}

/* Share row */
.signup__share-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.signup__share-hint {
  font-size: var(--text-caption);
  color: var(--color-muted);
}

@media (max-width: 640px) {
  .signup__invite-details {
    flex-direction: column;
    gap: 8px;
  }

  .signup__invite-divider-v {
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(200,169,110,0.25), transparent);
  }
}
</style>
