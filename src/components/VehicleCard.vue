<template>
  <TiltCard class="vehicle-card">
    <div class="vehicle-card__image-wrap">
      <img
        :src="imageSrc"
        :alt="vehicle.name"
        class="vehicle-card__image"
        loading="lazy"
      />
      <div class="vehicle-card__image-overlay"></div>
    </div>
    <div class="vehicle-card__body">
      <span class="vehicle-card__type">{{ vehicle.type }}</span>
      <h3 class="vehicle-card__name">{{ vehicle.name }}</h3>
      <p class="vehicle-card__tagline">{{ vehicle.tagline }}</p>
      <div class="vehicle-card__specs">
        <div
          v-for="(spec, key) in vehicle.specs"
          :key="key"
          class="vehicle-card__spec"
        >
          <span class="vehicle-card__spec-value">
            {{ spec.value }}<small>{{ spec.unit }}</small>
          </span>
          <span class="vehicle-card__spec-label">{{ spec.label }}</span>
        </div>
      </div>
      <MagneticButton class="vehicle-card__cta" @click="$emit('explore', vehicle.id)">
        Explore
      </MagneticButton>
    </div>
  </TiltCard>
</template>

<script setup>
import { computed } from 'vue'
import TiltCard from './TiltCard.vue'
import MagneticButton from './MagneticButton.vue'

const props = defineProps({
  vehicle: { type: Object, required: true },
})

defineEmits(['explore'])

// Dynamic import for Vite asset handling
const imageModules = import.meta.glob('../assets/avatr-*.png', { eager: true })

const imageSrc = computed(() => {
  const key = Object.keys(imageModules).find(k => k.includes(props.vehicle.image))
  return key ? imageModules[key].default : ''
})
</script>

<style scoped>
.vehicle-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--glass-radius);
  overflow: hidden;
  box-shadow: var(--glass-shadow);
  transition: all var(--duration-fast) ease;
  position: relative;
}

.vehicle-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--glass-shine);
  pointer-events: none;
  border-radius: inherit;
  z-index: 1;
}

.vehicle-card:hover {
  border-color: var(--glass-border-hover);
  box-shadow: var(--glass-shadow-hover);
  background: var(--glass-bg-hover);
  transform: translateY(-4px);
}

.vehicle-card__image-wrap {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #0a0a0a 0%, #111 100%);
}

.vehicle-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.vehicle-card:hover .vehicle-card__image {
  transform: scale(1.06);
}

.vehicle-card__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(20, 20, 20, 0.8) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.vehicle-card:hover .vehicle-card__image-overlay {
  opacity: 1;
}

.vehicle-card__body {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vehicle-card__type {
  font-size: var(--text-small);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.vehicle-card__name {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text);
}

.vehicle-card__tagline {
  font-size: var(--text-body);
  font-weight: 300;
  color: var(--color-muted);
  letter-spacing: 0.02em;
}

.vehicle-card__specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.vehicle-card__spec {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vehicle-card__spec-value {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-text);
}

.vehicle-card__spec-value small {
  font-size: 0.7em;
  font-weight: 400;
  color: var(--color-muted);
  margin-left: 2px;
}

.vehicle-card__spec-label {
  font-size: var(--text-small);
  color: var(--color-muted);
  letter-spacing: 0.05em;
}

.vehicle-card__cta {
  margin-top: 8px;
  align-self: flex-start;
  padding: 12px 32px;
  font-size: var(--text-small);
}
</style>
