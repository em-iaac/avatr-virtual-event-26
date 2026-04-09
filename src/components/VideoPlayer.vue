<template>
  <div class="video-player" :class="{ 'video-player--playing': isPlaying }">
    <div v-if="!isPlaying" class="video-player__poster" @click="play">
      <div class="video-player__play-btn">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="31" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
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
  border-radius: 4px;
  overflow: hidden;
  background: var(--color-surface);
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
  background: linear-gradient(180deg, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 0.8) 100%);
  transition: background var(--duration-fast) ease;
}

.video-player__poster:hover {
  background: linear-gradient(180deg, rgba(10, 10, 10, 0.1) 0%, rgba(10, 10, 10, 0.6) 100%);
}

.video-player__play-btn {
  color: var(--color-accent);
  transition: transform var(--duration-fast) ease, color var(--duration-fast) ease;
}

.video-player__poster:hover .video-player__play-btn {
  transform: scale(1.1);
  color: var(--color-accent-hover);
}

.video-player__cta {
  font-family: var(--font-display);
  font-size: var(--text-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted);
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
