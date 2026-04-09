<template>
  <div v-if="isDesktop" class="floating-diamonds" aria-hidden="true">
    <span
      v-for="d in diamonds"
      :key="d.id"
      class="floating-diamonds__shape"
      :style="d.style"
    >
      <svg viewBox="0 0 24 40" fill="none">
        <path d="M12 0 L24 15 L12 40 L0 15 Z" stroke="currentColor" stroke-width="0.5" fill="none"/>
      </svg>
    </span>
  </div>
</template>

<script setup>
import { useMediaQuery } from '@vueuse/core'

const isDesktop = useMediaQuery('(hover: hover)')

const diamonds = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  style: {
    top: `${10 + Math.random() * 80}%`,
    left: `${Math.random() * 100}%`,
    width: `${12 + Math.random() * 16}px`,
    opacity: 0.03 + Math.random() * 0.04,
    animationDuration: `${25 + Math.random() * 20}s`,
    animationDelay: `${Math.random() * 10}s`,
  },
}))
</script>

<style scoped>
.floating-diamonds {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.floating-diamonds__shape {
  position: absolute;
  color: var(--color-accent);
  animation: diamondFloat linear infinite;
}

@keyframes diamondFloat {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-40px) rotate(3deg);
  }
  50% {
    transform: translateY(-10px) rotate(-2deg);
  }
  75% {
    transform: translateY(-50px) rotate(4deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}
</style>
