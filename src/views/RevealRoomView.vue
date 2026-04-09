<template>
  <section class="reveal-view">
    <CarReveal />
  </section>
</template>

<script setup>
import CarReveal from '../components/CarReveal.vue'
</script>

<style scoped>
.reveal-view {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-bg);
}
</style>
