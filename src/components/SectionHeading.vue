<template>
  <div class="section-heading">
    <TextReveal
      v-if="title"
      :text="title"
      tag="h2"
      class="section-heading__title"
    />
    <div class="section-heading__divider"></div>
    <TextReveal
      v-if="subtitle"
      :text="subtitle"
      tag="p"
      class="section-heading__subtitle"
      :delay="0.3"
    />
  </div>
</template>

<script setup>
import TextReveal from './TextReveal.vue'

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

<style scoped>
.section-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  margin-bottom: var(--gap-lg);
}

.section-heading__title {
  font-size: var(--text-h2);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text);
  justify-content: center;
}

.section-heading__divider {
  width: 60px;
  height: 1px;
  background-color: var(--color-accent);
  opacity: 0.7;
}

.section-heading__subtitle {
  font-size: var(--text-body);
  font-weight: 300;
  color: var(--color-muted);
  letter-spacing: 0.05em;
  max-width: 500px;
  justify-content: center;
}
</style>
