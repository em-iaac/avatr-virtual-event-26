<template>
  <section class="invite">
    <!-- Background glow -->
    <div class="invite__glow"></div>

    <!-- Shareable Card -->
    <div ref="invitationCard" class="invite__card">
      <!-- Shimmer sweep -->
      <div class="invite__shimmer"></div>

      <!-- Decorative corner diamonds -->
      <svg class="invite__corner invite__corner--tl" viewBox="0 0 32 32" fill="none">
        <path d="M16 2 L30 16 L16 30 L2 16 Z" stroke="rgba(200,169,110,0.4)" stroke-width="0.8"/>
        <path d="M16 6 L26 16 L16 26 L6 16 Z" stroke="rgba(200,169,110,0.2)" stroke-width="0.5"/>
      </svg>
      <svg class="invite__corner invite__corner--tr" viewBox="0 0 32 32" fill="none">
        <path d="M16 2 L30 16 L16 30 L2 16 Z" stroke="rgba(200,169,110,0.4)" stroke-width="0.8"/>
        <path d="M16 6 L26 16 L16 26 L6 16 Z" stroke="rgba(200,169,110,0.2)" stroke-width="0.5"/>
      </svg>
      <svg class="invite__corner invite__corner--bl" viewBox="0 0 32 32" fill="none">
        <path d="M16 2 L30 16 L16 30 L2 16 Z" stroke="rgba(200,169,110,0.4)" stroke-width="0.8"/>
        <path d="M16 6 L26 16 L16 26 L6 16 Z" stroke="rgba(200,169,110,0.2)" stroke-width="0.5"/>
      </svg>
      <svg class="invite__corner invite__corner--br" viewBox="0 0 32 32" fill="none">
        <path d="M16 2 L30 16 L16 30 L2 16 Z" stroke="rgba(200,169,110,0.4)" stroke-width="0.8"/>
        <path d="M16 6 L26 16 L16 26 L6 16 Z" stroke="rgba(200,169,110,0.2)" stroke-width="0.5"/>
      </svg>

      <!-- Card content -->
      <div class="invite__content">
        <!-- Badge -->
        <span class="invite__badge">✦ Exclusive Access</span>

        <!-- Emblem -->
        <img :src="emblemWhite" alt="AVATR" class="invite__emblem" />

        <!-- Title -->
        <h1 class="invite__title">You're Invited</h1>

        <!-- Gold divider -->
        <div class="invite__divider"></div>

        <!-- Event details row -->
        <div class="invite__details">
          <div class="invite__detail">
            <span class="invite__detail-label">Date</span>
            <span class="invite__detail-value">August 1, 2026</span>
          </div>
          <div class="invite__detail-sep"></div>
          <div class="invite__detail">
            <span class="invite__detail-label">Time</span>
            <span class="invite__detail-value">6:00 PM KWT</span>
          </div>
        </div>

        <!-- Platforms -->
        <div class="invite__platforms">
          <div class="invite__platform">
            <svg class="invite__platform-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <div class="invite__platform-info">
              <span class="invite__platform-label">YouTube Live</span>
              <span class="invite__platform-sub">Stream</span>
            </div>
          </div>
          <div class="invite__platform">
            <svg class="invite__platform-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <div class="invite__platform-info">
              <span class="invite__platform-label">avatr.com</span>
              <span class="invite__platform-sub">Interactive</span>
            </div>
          </div>
        </div>

        <!-- Personalized name -->
        <div v-if="rsvpName" class="invite__personal">
          <span class="invite__personal-prefix">This seat belongs to</span>
          <span class="invite__personal-name">{{ rsvpName }}</span>
        </div>

        <!-- Tagline -->
        <p class="invite__tagline">{{ EVENT.tagline }}</p>

        <!-- Bottom text logo -->
        <img :src="textLogoWhite" alt="AVATR" class="invite__text-logo" />
      </div>
    </div>

    <!-- Action buttons (outside card — not captured in export) -->
    <div class="invite__actions">
      <MagneticButton class="invite__action-btn invite__action-btn--primary" @click="handleShare">
        {{ shareLabel }}
      </MagneticButton>
      <button
        class="invite__rsvp-toggle"
        @click="showRsvp = !showRsvp"
      >
        {{ showRsvp ? 'Close' : 'Reserve Your Seat' }}
      </button>
    </div>

    <!-- Compact RSVP form -->
    <Transition name="rsvp-slide">
      <div v-if="showRsvp" class="invite__rsvp glass-panel glass-panel--deep">
        <form v-if="!rsvpDone" class="invite__rsvp-form" @submit.prevent="handleRsvp">
          <div class="invite__rsvp-field">
            <input
              v-model="rsvpForm.name"
              type="text"
              class="invite__rsvp-input"
              placeholder="Your name"
              required
            />
          </div>
          <div class="invite__rsvp-field">
            <input
              v-model="rsvpForm.email"
              type="email"
              class="invite__rsvp-input"
              placeholder="you@example.com"
              required
            />
          </div>
          <MagneticButton type="submit" class="invite__rsvp-submit" :disabled="rsvpSubmitting">
            {{ rsvpSubmitting ? 'Submitting...' : 'Confirm' }}
          </MagneticButton>
        </form>
        <div v-else class="invite__rsvp-success">
          <span class="invite__rsvp-check">✓</span>
          <span>Seat reserved for {{ rsvpName }}</span>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { EVENT, API } from '../config.js'
import MagneticButton from '../components/MagneticButton.vue'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'
import textLogoWhite from '../assets/avatr-text-logo-white.png'

const router = useRouter()

// Safety check: redirect if quiz not completed (belt-and-suspenders with router guard)
if (!localStorage.getItem('avatr-quiz-completed')) {
  router.replace({ name: 'waiting-room', query: { tab: 'quiz', locked: '1' } })
}

const invitationCard = ref(null)
const showRsvp = ref(false)
const rsvpDone = ref(false)
const rsvpSubmitting = ref(false)
const shareLabel = ref('Share Invitation')

const rsvpForm = ref({ name: '', email: '' })

const storedName = localStorage.getItem('avatr-rsvp-name')
const rsvpName = ref(storedName || '')

if (storedName) rsvpDone.value = true

async function handleRsvp() {
  rsvpSubmitting.value = true
  try {
    if (API.sheetsEndpoint) {
      await fetch(API.sheetsEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rsvp',
          name: rsvpForm.value.name,
          email: rsvpForm.value.email,
          timestamp: new Date().toISOString(),
        }),
      })
    }
    const firstName = rsvpForm.value.name.trim().split(' ')[0] || 'Guest'
    localStorage.setItem('avatr-rsvp-name', firstName)
    rsvpName.value = firstName
    rsvpDone.value = true
    window.__avatrSound?.playWhoosh()
  } catch {
    const firstName = rsvpForm.value.name.trim().split(' ')[0] || 'Guest'
    localStorage.setItem('avatr-rsvp-name', firstName)
    rsvpName.value = firstName
    rsvpDone.value = true
  } finally {
    rsvpSubmitting.value = false
  }
}

async function handleShare() {
  shareLabel.value = 'Preparing...'
  try {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(invitationCard.value, {
      scale: 3,
      backgroundColor: '#060608',
      useCORS: true,
      onclone: (doc) => {
        const card = doc.querySelector('.invite__card')
        if (card) card.style.borderRadius = '0'
      },
    })
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    const file = new File([blob], 'avatr-invitation.png', { type: 'image/png' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'AVATR Virtual Event 2026',
        text: 'You\'re invited to the AVATR Virtual Event — August 1, 2026',
      })
      shareLabel.value = 'Shared! ✓'
    } else {
      // Fallback: download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'avatr-invitation.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      shareLabel.value = 'Downloaded! ✓'
    }
    window.__avatrSound?.playClick()
  } catch {
    shareLabel.value = 'Share Invitation'
  }
  setTimeout(() => { shareLabel.value = 'Share Invitation' }, 2500)
}

onMounted(async () => {
  await nextTick()
  const card = invitationCard.value
  if (!card) return

  // Card entrance
  gsap.from(card, {
    opacity: 0,
    scale: 0.95,
    y: 30,
    duration: 1,
    ease: 'power3.out',
  })

  // Emblem
  gsap.from('.invite__emblem', {
    scale: 0.5,
    opacity: 0,
    duration: 0.8,
    delay: 0.3,
    ease: 'back.out(1.7)',
  })

  // Staggered content reveals
  gsap.from('.invite__badge, .invite__title, .invite__divider, .invite__details, .invite__platforms, .invite__personal, .invite__tagline, .invite__text-logo', {
    opacity: 0,
    y: 16,
    stagger: 0.1,
    duration: 0.6,
    delay: 0.5,
    ease: 'power2.out',
  })

  // Action buttons
  gsap.from('.invite__actions', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 1.2,
    ease: 'power2.out',
  })
})
</script>

<style scoped>
.invite {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 28px;
  background-color: var(--color-bg);
  overflow: hidden;
}

.invite__glow {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 700px;
  height: 700px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(200,169,110,0.08) 0%, transparent 60%);
  pointer-events: none;
  animation: goldBreathe 6s ease-in-out infinite;
}

/* ── Card ── */
.invite__card {
  position: relative;
  width: min(360px, 85vw);
  aspect-ratio: 9 / 16;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;

  /* Opaque gradient for html2canvas fidelity */
  background:
    linear-gradient(170deg,
      #0c0c10 0%,
      #0a0a0e 25%,
      #08080c 50%,
      #0a0a0e 75%,
      #0c0c10 100%
    );

  /* Gold accent border with animated gradient */
  border: 1px solid transparent;
  background-clip: padding-box;
  box-shadow:
    0 0 0 1px rgba(200, 169, 110, 0.25),
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(200, 169, 110, 0.06);
}

/* Shimmer sweep */
.invite__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(200, 169, 110, 0.04) 45%,
    rgba(200, 169, 110, 0.08) 50%,
    rgba(200, 169, 110, 0.04) 55%,
    transparent 60%
  );
  background-size: 300% 100%;
  animation: inviteShimmer 6s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

/* Corner diamonds */
.invite__corner {
  position: absolute;
  width: 28px;
  height: 28px;
  z-index: 2;
  opacity: 0.6;
}
.invite__corner--tl { top: 12px; left: 12px; }
.invite__corner--tr { top: 12px; right: 12px; }
.invite__corner--bl { bottom: 12px; left: 12px; }
.invite__corner--br { bottom: 12px; right: 12px; }

/* Card content */
.invite__content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 36px 24px;
  gap: 16px;
  text-align: center;
}

.invite__badge {
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
  padding: 5px 14px;
  border: 1px solid rgba(200,169,110,0.3);
  border-radius: 999px;
  background: rgba(200,169,110,0.08);
}

.invite__emblem {
  width: 90px;
  opacity: 0.9;
  filter: drop-shadow(0 0 20px rgba(200, 169, 110, 0.3));
  animation: emblemBreathe 4s ease-in-out infinite;
}

@keyframes emblemBreathe {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(200, 169, 110, 0.3)); }
  50% { filter: drop-shadow(0 0 35px rgba(200, 169, 110, 0.5)); }
}

.invite__title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 6vw, 2.4rem);
  font-weight: 300;
  letter-spacing: 0.08em;
  color: var(--color-text);
  line-height: 1.1;
}

.invite__divider {
  width: 48px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
}

/* Event details */
.invite__details {
  display: flex;
  align-items: center;
  gap: 16px;
}

.invite__detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.invite__detail-label {
  font-size: 0.55rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.invite__detail-value {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  letter-spacing: 0.04em;
}

.invite__detail-sep {
  width: 1px;
  height: 28px;
  background: rgba(200, 169, 110, 0.2);
}

/* Platforms */
.invite__platforms {
  display: flex;
  gap: 20px;
  margin-top: 4px;
}

.invite__platform {
  display: flex;
  align-items: center;
  gap: 8px;
}

.invite__platform-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.invite__platform-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.invite__platform-label {
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-text);
  letter-spacing: 0.03em;
}

.invite__platform-sub {
  font-size: 0.52rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
}

/* Personalized name */
.invite__personal {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.invite__personal-prefix {
  font-size: 0.55rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.invite__personal-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--color-accent);
  letter-spacing: 0.06em;
}

/* Tagline */
.invite__tagline {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-top: auto;
  padding-top: 8px;
}

.invite__text-logo {
  height: 18px;
  width: auto;
  opacity: 0.5;
}

/* ── Actions (outside card) ── */
.invite__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 2;
}

.invite__action-btn--primary {
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

.invite__action-btn--primary:hover {
  background: var(--color-accent-hover);
}

.invite__rsvp-toggle {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  background: none;
  border: 1px solid rgba(200,169,110,0.25);
  border-radius: 999px;
  padding: 10px 28px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.invite__rsvp-toggle:hover {
  border-color: rgba(200,169,110,0.5);
  background: rgba(200,169,110,0.06);
}

/* ── RSVP form ── */
.invite__rsvp {
  width: min(360px, 85vw);
  padding: 24px;
  z-index: 2;
}

.invite__rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.invite__rsvp-field {
  width: 100%;
}

.invite__rsvp-input {
  width: 100%;
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-text);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s ease;
}

.invite__rsvp-input::placeholder {
  color: rgba(240, 240, 240, 0.2);
}

.invite__rsvp-input:focus {
  border-color: var(--color-accent);
}

.invite__rsvp-submit {
  padding: 12px 28px;
  font-family: var(--font-display);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-bg);
  background: var(--color-accent);
  border-radius: 999px;
  border: none;
  cursor: pointer;
  align-self: center;
  transition: background 0.3s ease;
}

.invite__rsvp-submit:hover {
  background: var(--color-accent-hover);
}

.invite__rsvp-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.invite__rsvp-success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--color-text);
}

.invite__rsvp-check {
  color: var(--color-accent);
  font-size: 1.2rem;
}

/* RSVP slide transition */
.rsvp-slide-enter-active {
  transition: all 0.3s ease;
}
.rsvp-slide-leave-active {
  transition: all 0.2s ease;
}
.rsvp-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.rsvp-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .invite {
    padding: 24px 12px;
    gap: 20px;
  }

  .invite__content {
    padding: 28px 18px;
    gap: 12px;
  }

  .invite__emblem {
    width: 70px;
  }

  .invite__platforms {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
}
</style>
