<template>
  <div class="section-divider" :class="`section-divider--${variant}`">
    <!-- Diamond line variant -->
    <template v-if="variant === 'diamond'">
      <span class="section-divider__line"></span>
      <svg class="section-divider__diamond-icon" viewBox="0 0 24 40" fill="none">
        <path d="M12 0 L24 15 L12 40 L0 15 Z" stroke="currentColor" stroke-width="1" fill="none"/>
      </svg>
      <span class="section-divider__line"></span>
    </template>

    <!-- Gold gradient line with dots -->
    <template v-if="variant === 'dots'">
      <span class="section-divider__dot"></span>
      <span class="section-divider__dot"></span>
      <span class="section-divider__dot"></span>
    </template>

    <!-- Simple gold line -->
    <template v-if="variant === 'line'">
      <span class="section-divider__gold-line"></span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'diamond' }, // 'diamond' | 'dots' | 'line'
})
</script>

<style scoped>
.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px 0;
}

/* Diamond variant */
.section-divider--diamond .section-divider__line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 169, 110, 0.2));
}

.section-divider--diamond .section-divider__line:last-child {
  background: linear-gradient(90deg, rgba(200, 169, 110, 0.2), transparent);
}

.section-divider__diamond-icon {
  width: 12px;
  height: 20px;
  color: var(--color-accent);
  opacity: 0.25;
}

/* Dots variant */
.section-divider--dots .section-divider__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-accent);
  opacity: 0.2;
}

.section-divider--dots .section-divider__dot:nth-child(2) {
  opacity: 0.35;
  width: 4px;
  height: 4px;
}

/* Line variant */
.section-divider__gold-line {
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 169, 110, 0.2), transparent);
}
</style>
