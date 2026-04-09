<template>
  <div class="room-layout">
    <!-- Site loader (first visit only) -->
    <SiteLoader />

    <!-- Global overlays -->
    <FloatingDiamonds />
    <CursorGlow />
    <SoundManager />
    <VirtualHost />

    <!-- Back to lobby button (hidden on lobby itself) -->
    <Transition name="fade">
      <button
        v-if="$route.name !== 'lobby'"
        class="room-layout__back glass-panel glass-panel--deep"
        @click="goToLobby"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" class="room-layout__back-icon">
          <path d="M12 4L6 10L12 16" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Lobby</span>
      </button>
    </Transition>

    <!-- Room content with door transitions -->
    <main class="room-layout__main">
      <router-view v-slot="{ Component, route }">
        <RoomTransition>
          <component :is="Component" :key="route.path" />
        </RoomTransition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import SiteLoader from '../components/SiteLoader.vue'
import FloatingDiamonds from '../components/FloatingDiamonds.vue'
import CursorGlow from '../components/CursorGlow.vue'
import SoundManager from '../components/SoundManager.vue'
import VirtualHost from '../components/VirtualHost.vue'
import RoomTransition from '../components/RoomTransition.vue'

const router = useRouter()

function goToLobby() {
  window.__avatrSound?.playClick()
  router.push({ name: 'lobby' })
}
</script>

<style scoped>
.room-layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.room-layout__main {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.room-layout__back {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px 10px 12px;
  font-family: var(--font-display);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text);
  cursor: pointer;
}

.room-layout__back:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.room-layout__back-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Fade transition for the back button */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
