<template>
  <div class="countdown" :class="{ 'countdown--complete': isComplete }">
    <div v-if="!isComplete" class="countdown__units">
      <div v-for="unit in units" :key="unit.label" class="countdown__unit">
        <div class="countdown__digits">
          <span
            v-for="(digit, i) in padDigits(unit.value)"
            :key="unit.label + i"
            class="countdown__digit"
          >
            <span class="countdown__digit-inner" :style="{ transform: `translateY(${-digit * 100}%)` }">
              <span v-for="n in 10" :key="n" class="countdown__digit-num">{{ n - 1 }}</span>
            </span>
          </span>
        </div>
        <span class="countdown__label">{{ unit.label }}</span>
      </div>
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
  gap: clamp(16px, 4vw, 48px);
  justify-content: center;
}

.countdown__unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.countdown__digits {
  display: flex;
  gap: 4px;
}

.countdown__digit {
  width: clamp(28px, 5vw, 48px);
  height: clamp(40px, 7vw, 68px);
  background: var(--color-surface);
  border: 1px solid rgba(200, 169, 110, 0.12);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.countdown__digit-inner {
  display: flex;
  flex-direction: column;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.countdown__digit-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: clamp(40px, 7vw, 68px);
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
}

.countdown__label {
  font-size: var(--text-small);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted);
}
</style>
