<template>
  <div v-if="isDesktop" class="floating-diamonds" aria-hidden="true">
    <!-- Diamond shapes -->
    <span
      v-for="d in diamonds"
      :key="'d-' + d.id"
      class="floating-diamonds__shape"
      :style="d.style"
    >
      <svg viewBox="0 0 24 40" fill="none">
        <path d="M12 0 L24 15 L12 40 L0 15 Z" stroke="currentColor" stroke-width="0.5" fill="none"/>
      </svg>
    </span>
    <!-- Gold dust particles -->
    <span
      v-for="p in particles"
      :key="'p-' + p.id"
      class="floating-diamonds__particle"
      :style="p.style"
    ></span>
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

const particles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  style: {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${2 + Math.random() * 3}px`,
    height: `${2 + Math.random() * 3}px`,
    opacity: 0.04 + Math.random() * 0.06,
    animationDuration: `${15 + Math.random() * 25}s`,
    animationDelay: `${Math.random() * 15}s`,
    borderRadius: Math.random() > 0.5 ? '50%' : '1px',
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

.floating-diamonds__particle {
  position: absolute;
  background: var(--color-accent);
  animation: particleDrift linear infinite;
  box-shadow: 0 0 4px rgba(200, 169, 110, 0.3);
}

@keyframes diamondFloat {
  0% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-40px) rotate(3deg); }
  50% { transform: translateY(-10px) rotate(-2deg); }
  75% { transform: translateY(-50px) rotate(4deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

@keyframes particleDrift {
  0% { transform: translate(0, 0) scale(1); opacity: 0; }
  10% { opacity: 0.06; }
  50% { transform: translate(-20px, -60px) scale(0.8); opacity: 0.08; }
  90% { opacity: 0.04; }
  100% { transform: translate(10px, -120px) scale(0.5); opacity: 0; }
}
</style>
