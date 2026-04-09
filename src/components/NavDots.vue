<template>
  <nav v-if="isDesktop" class="nav-dots" aria-label="Section navigation">
    <button
      v-for="sec in sections"
      :key="sec.id"
      class="nav-dots__dot"
      :class="{ 'nav-dots__dot--active': activeSection === sec.id }"
      :aria-label="sec.label"
      :title="sec.label"
      @click="scrollTo(sec.id)"
    >
      <span class="nav-dots__pip"></span>
    </button>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const isDesktop = useMediaQuery('(min-width: 1024px)')
const activeSection = ref('')

const sections = [
  { id: 'hero', label: 'Lobby' },
  { id: 'experience', label: 'Rooms' },
  { id: 'story', label: 'Brand Story' },
  { id: 'reveal', label: 'Reveal Chamber' },
  { id: 'mystery', label: 'Mystery Room' },
  { id: 'challenge', label: 'Speed Room' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'signup', label: 'Sign Up' },
]

let observers = []

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  sections.forEach(sec => {
    const el = document.getElementById(sec.id)
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activeSection.value = sec.id
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    observers.push(observer)
  })
})

onUnmounted(() => {
  observers.forEach(o => o.disconnect())
})
</script>

<style scoped>
.nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 30px;
  padding: 12px 8px;
  box-shadow: var(--glass-shadow);
}

.nav-dots__dot {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.nav-dots__pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-muted);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.nav-dots__dot:hover .nav-dots__pip {
  opacity: 0.6;
  transform: scale(1.3);
}

.nav-dots__dot--active .nav-dots__pip {
  background: var(--color-accent);
  opacity: 1;
  transform: scale(1.4);
  box-shadow: 0 0 8px rgba(200, 169, 110, 0.4);
}
</style>
