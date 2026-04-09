<template>
  <section class="watching-room">
    <div class="watching-room__inner">
      <!-- Phase: PRE-EVENT -->
      <div v-if="phase === 'pre'" class="watching-room__pre">
        <div class="watching-room__ambience"></div>
        <img :src="emblemWhite" alt="" class="watching-room__emblem" />
        <h2 class="watching-room__title">The Premiere</h2>
        <p class="watching-room__subtitle">The curtains rise on May 1st.</p>
        <CountdownTimer class="watching-room__countdown" @complete="onPhaseChange" />
        <div class="watching-room__placeholder glass-panel glass-panel--deep">
          <div class="watching-room__screen">
            <svg viewBox="0 0 24 24" fill="currentColor" class="watching-room__play-icon">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <p class="watching-room__screen-text">Premiere starts soon</p>
          </div>
        </div>
      </div>

      <!-- Phase: LIVE -->
      <div v-else-if="phase === 'live'" class="watching-room__live">
        <div class="watching-room__live-badge">
          <span class="watching-room__live-dot"></span>
          LIVE NOW
        </div>
        <VideoPlayer :video-id="EVENT.videoId" class="watching-room__player" />
      </div>

      <!-- Phase: POST-EVENT -->
      <div v-else class="watching-room__post">
        <img :src="emblemWhite" alt="" class="watching-room__emblem" />
        <h2 class="watching-room__title">The Future Has Arrived.</h2>
        <p class="watching-room__subtitle">Watch the full premiere below.</p>
        <VideoPlayer :video-id="EVENT.videoId" class="watching-room__player" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { EVENT, getEventPhase } from '../config.js'
import CountdownTimer from '../components/CountdownTimer.vue'
import VideoPlayer from '../components/VideoPlayer.vue'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'

const phase = ref(getEventPhase())

function onPhaseChange() {
  phase.value = getEventPhase()
}
</script>

<style scoped>
.watching-room {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  overflow: hidden;
}

.watching-room__inner {
  width: 100%;
  max-width: 1000px;
  padding: 80px 20px 60px;
  margin: 0 auto;
}

/* Pre-event */
.watching-room__pre {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.watching-room__ambience {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(200,169,110,0.05) 0%, transparent 60%);
  pointer-events: none;
  animation: goldBreathe 8s ease-in-out infinite;
}

.watching-room__emblem {
  width: 40px;
  opacity: 0.6;
}

.watching-room__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  letter-spacing: 0.05em;
  color: var(--color-text);
}

.watching-room__subtitle {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.watching-room__countdown {
  margin: 16px 0;
}

.watching-room__placeholder {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  background:
    radial-gradient(circle at 50% 50%, rgba(200,169,110,0.04), transparent 50%),
    var(--glass-bg-deep);
}

.watching-room__screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--color-muted);
}

.watching-room__play-icon {
  width: 48px;
  height: 48px;
  opacity: 0.3;
}

.watching-room__screen-text {
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* Live */
.watching-room__live {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.watching-room__live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(200, 40, 40, 0.15);
  border: 1px solid rgba(200, 40, 40, 0.4);
  border-radius: 999px;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ff6b6b;
  font-weight: 600;
}

.watching-room__live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4444;
  animation: pulseGlow 1.5s ease-in-out infinite;
}

.watching-room__player {
  width: 100%;
}

/* Post */
.watching-room__post {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}
</style>
