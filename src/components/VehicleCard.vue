<template>
  <TiltCard class="vehicle-card">
    <div class="vehicle-card__image-wrap">
      <div class="vehicle-card__image-placeholder">
        <span class="vehicle-card__image-label">{{ vehicle.name }}</span>
      </div>
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
import TiltCard from './TiltCard.vue'
import MagneticButton from './MagneticButton.vue'

defineProps({
  vehicle: { type: Object, required: true },
})

defineEmits(['explore'])
</script>

<style scoped>
.vehicle-card {
  background: var(--color-surface);
  border: 1px solid rgba(200, 169, 110, 0.08);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color var(--duration-fast) ease;
}

.vehicle-card:hover {
  border-color: rgba(200, 169, 110, 0.2);
}

.vehicle-card__image-wrap {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
}

.vehicle-card__image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(200, 169, 110, 0.03) 0%, transparent 60%);
}

.vehicle-card__image-label {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 300;
  letter-spacing: 0.2em;
  color: rgba(240, 240, 240, 0.1);
  text-transform: uppercase;
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
