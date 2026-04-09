<template>
  <Transition name="loader-fade">
    <div v-if="visible" class="loader">
      <div class="loader__content">
        <!-- SVG emblem that draws itself -->
        <svg class="loader__emblem" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer rectangle -->
          <path
            class="loader__path loader__path--1"
            d="M 15 10 L 85 10 L 85 130 L 15 130 Z"
            stroke="var(--color-accent)"
            stroke-width="1.5"
          />
          <!-- Inner diamond / hourglass shape -->
          <path
            class="loader__path loader__path--2"
            d="M 15 10 L 50 60 L 85 10 M 15 130 L 50 80 L 85 130"
            stroke="var(--color-accent)"
            stroke-width="1.5"
          />
          <!-- Center connector -->
          <path
            class="loader__path loader__path--3"
            d="M 50 60 L 50 80"
            stroke="var(--color-accent)"
            stroke-width="1.5"
          />
        </svg>
        <span class="loader__text">AVATR</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)

onMounted(() => {
  // Check if already played this session
  if (sessionStorage.getItem('avatr-loaded')) {
    visible.value = false
    return
  }

  // Dismiss after animation completes
  setTimeout(() => {
    visible.value = false
    sessionStorage.setItem('avatr-loaded', '1')
  }, 2200)
})
</script>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader__emblem {
  width: 60px;
  height: auto;
}

.loader__path {
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  fill: none;
}

.loader__path--1 {
  animation: drawPath 1s ease-out 0.2s forwards;
}

.loader__path--2 {
  animation: drawPath 1s ease-out 0.6s forwards;
}

.loader__path--3 {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: drawPath 0.4s ease-out 1s forwards;
}

@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}

.loader__text {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.35em;
  color: var(--color-accent);
  opacity: 0;
  animation: loaderTextIn 0.6s ease-out 1.2s forwards;
}

@keyframes loaderTextIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 0.8; transform: translateY(0); }
}

/* Transition */
.loader-fade-leave-active {
  transition: opacity 0.6s ease;
}

.loader-fade-leave-to {
  opacity: 0;
}
</style>
