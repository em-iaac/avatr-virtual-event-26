<template>
  <section class="vehicle-lineup section" id="vehicles">
    <div class="section__inner">
      <SectionHeading
        title="The Lineup"
        subtitle="Three visions of intelligent mobility"
      />
      <ScrollReveal :stagger="0.15" class="vehicle-lineup__grid">
        <VehicleCard
          v-for="vehicle in vehicles"
          :key="vehicle.id"
          :vehicle="vehicle"
        />
      </ScrollReveal>
    </div>
  </section>
</template>

<script setup>
import vehiclesData from '../data/vehicles.json'
import SectionHeading from './SectionHeading.vue'
import ScrollReveal from './ScrollReveal.vue'
import VehicleCard from './VehicleCard.vue'

const vehicles = vehiclesData
</script>

<style scoped>
.vehicle-lineup {
  background-color: var(--color-bg);
}

.vehicle-lineup__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
}

@media (max-width: 1024px) {
  .vehicle-lineup__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .vehicle-lineup__grid {
    grid-template-columns: 1fr;
    gap: var(--gap-md);
  }
}
</style>
