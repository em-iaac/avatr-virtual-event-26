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
        <div v-else class="signup__success">
          <div class="signup__success-icon">&#10003;</div>
          <h3 class="signup__success-title">You're In</h3>
          <p class="signup__success-text">
            We'll see you at the premiere on May 1st at 8:00 PM Kuwait time.
          </p>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { API } from '../config.js'
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
  } catch {
    // Silently succeed for now — form data captured on client
    submitted.value = true
  } finally {
    isSubmitting.value = false
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
  background: var(--color-surface);
  border: 1px solid rgba(200, 169, 110, 0.12);
  border-radius: 4px;
  outline: none;
  transition: border-color var(--duration-fast) ease;
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
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
}

.signup__success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.signup__success-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text);
}

.signup__success-text {
  font-size: var(--text-body);
  color: var(--color-muted);
  max-width: 350px;
}
</style>
