<template>
  <div class="video-player" :class="{ 'video-player--playing': isPlaying }">
    <div v-if="!isPlaying" class="video-player__poster" @click="play">
      <!-- Emblem watermark -->
      <div class="video-player__watermark">
        <img :src="emblemWhite" alt="" class="video-player__watermark-img" />
      </div>
      <!-- Pulsing play button -->
      <div class="video-player__play-btn">
        <span class="video-player__play-ring video-player__play-ring--1"></span>
        <span class="video-player__play-ring video-player__play-ring--2"></span>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="31" stroke="currentColor" stroke-width="1" opacity="0.6" />
          <polygon points="26,20 26,44 46,32" fill="currentColor" />
        </svg>
      </div>
      <p class="video-player__cta">Watch the Premiere</p>
    </div>
    <div v-else class="video-player__embed">
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`"
        frameborder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
        title="AVATR Virtual Event 2026"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'

const props = defineProps({
  videoId: { type: String, required: true },
})

const isPlaying = ref(false)

function play() {
  isPlaying.value = true
}
</script>

<style scoped>
.video-player {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid rgba(200, 169, 110, 0.15);
  box-shadow:
    0 4px 40px rgba(0, 0, 0, 0.5),
    0 0 80px rgba(200, 169, 110, 0.04);
}

.video-player__poster {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  cursor: pointer;
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.9) 0%,
    rgba(10, 10, 10, 0.95) 50%,
    rgba(20, 20, 20, 0.9) 100%
  );
  transition: background var(--duration-fast) ease;
}

.video-player__poster:hover .video-player__play-btn {
  transform: scale(1.1);
}

.video-player__watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  opacity: 0.04;
  pointer-events: none;
}

.video-player__watermark-img {
  width: 100%;
  filter: brightness(2);
}

.video-player__play-btn {
  position: relative;
  color: var(--color-accent);
  transition: transform var(--duration-fast) ease;
  z-index: 1;
}

/* Pulsing rings */
.video-player__play-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: playPulse 3s ease-out infinite;
}

.video-player__play-ring--2 {
  animation-delay: 1.5s;
}

@keyframes playPulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

.video-player__cta {
  font-family: var(--font-display);
  font-size: var(--text-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted);
  z-index: 1;
}

.video-player__embed {
  position: absolute;
  inset: 0;
}

.video-player__embed iframe {
  width: 100%;
  height: 100%;
}
</style>
