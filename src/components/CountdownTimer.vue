<template>
  <div class="countdown" :class="{ 'countdown--complete': isComplete }">
    <div v-if="!isComplete" class="countdown__units">
      <template v-for="(unit, ui) in units" :key="unit.label">
        <div class="countdown__unit">
          <div class="countdown__digits">
            <span
              v-for="(digit, i) in padDigits(unit.value)"
              :key="unit.label + i"
              class="countdown__digit"
            >
              <span class="countdown__digit-inner" :style="{ transform: `translateY(${-digit * 10}%)` }">
                <span v-for="n in 10" :key="n" class="countdown__digit-num">{{ n - 1 }}</span>
              </span>
            </span>
          </div>
          <span class="countdown__label">{{ unit.label }}</span>
        </div>
        <!-- Colon separator between units -->
        <span v-if="ui < units.length - 1" class="countdown__sep">:</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { EVENT } from '../config.js'

const emit = defineEmits(['complete'])

const now = ref(Date.now())
let timer = null

const diff = computed(() => Math.max(0, EVENT.date.getTime() - now.value))
const isComplete = computed(() => diff.value <= 0)

const units = computed(() => {
  const totalSec = Math.floor(diff.value / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Min', value: minutes },
    { label: 'Sec', value: seconds },
  ]
})

function padDigits(val) {
  return String(val).padStart(2, '0').split('').map(Number)
}

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
    if (isComplete.value) {
      clearInterval(timer)
      emit('complete')
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.countdown__units {
  display: flex;
  gap: clamp(8px, 2vw, 20px);
  justify-content: center;
  align-items: center;
}

.countdown__unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.countdown__digits {
  display: flex;
  gap: 4px;
}

.countdown__digit {
  width: clamp(32px, 5.5vw, 52px);
  height: clamp(48px, 8vw, 76px);
  background: var(--color-surface);
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.countdown__digit-inner {
  display: flex;
  flex-direction: column;
  /* Each digit-num is 10% of the total column height (10 items = 100%) */
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.countdown__digit-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: clamp(48px, 8vw, 76px);
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3.5vw, 2.2rem);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
}

.countdown__sep {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3.5vw, 2.2rem);
  font-weight: 300;
  color: var(--color-accent);
  opacity: 0.5;
  margin-bottom: 28px;
  animation: colonPulse 2s ease-in-out infinite;
}

@keyframes colonPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

.countdown__label {
  font-size: var(--text-small);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted);
}
</style>
