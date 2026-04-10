<template>
  <Transition name="loader-fade">
    <div v-if="visible" class="loader">
      <div class="loader__content">
        <img :src="emblemWhite" alt="" class="loader__emblem" draggable="false" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'

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
}

.loader__emblem {
  width: 60px;
  height: auto;
  opacity: 0;
  animation: emblemReveal 1.2s ease-out 0.2s forwards;
  filter: drop-shadow(0 0 0px rgba(200, 169, 110, 0));
}

@keyframes emblemReveal {
  0% {
    opacity: 0;
    transform: scale(0.85);
    filter: drop-shadow(0 0 0px rgba(200, 169, 110, 0));
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
    filter: drop-shadow(0 0 20px rgba(200, 169, 110, 0.3));
  }
  100% {
    opacity: 0.8;
    transform: scale(1);
    filter: drop-shadow(0 0 8px rgba(200, 169, 110, 0.15));
  }
}

/* Transition */
.loader-fade-leave-active {
  transition: opacity 0.6s ease;
}

.loader-fade-leave-to {
  opacity: 0;
}
</style>
