<template>
  <!-- Site loader (emblem draw animation) -->
  <SiteLoader />

  <!-- Global visual layers -->
  <FloatingDiamonds />
  <NavDots />
  <CursorGlow />

  <div id="smooth-wrapper">
    <HeroSection />
    <SectionDivider variant="diamond" />
    <BrandStory />
    <SectionDivider variant="dots" />
    <CarReveal />
    <SectionDivider variant="line" />
    <VehicleLineup />
    <SectionDivider variant="diamond" />
    <PerformanceStats />
    <SectionDivider variant="dots" />
    <SpeedChallenge />
    <SectionDivider variant="line" />
    <QuizModule />
    <SectionDivider variant="diamond" />
    <SignupSection />
    <FooterSection />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import SiteLoader from './components/SiteLoader.vue'
import FloatingDiamonds from './components/FloatingDiamonds.vue'
import NavDots from './components/NavDots.vue'
import CursorGlow from './components/CursorGlow.vue'
import HeroSection from './components/HeroSection.vue'
import BrandStory from './components/BrandStory.vue'
import CarReveal from './components/CarReveal.vue'
import VehicleLineup from './components/VehicleLineup.vue'
import PerformanceStats from './components/PerformanceStats.vue'
import SpeedChallenge from './components/SpeedChallenge.vue'
import QuizModule from './components/QuizModule.vue'
import SignupSection from './components/SignupSection.vue'
import FooterSection from './components/FooterSection.vue'
import SectionDivider from './components/SectionDivider.vue'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

onMounted(() => {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
})

onUnmounted(() => {
  lenis?.destroy()
})
</script>

<style>
@import './styles/main.css';

#smooth-wrapper {
  position: relative;
}
</style>
