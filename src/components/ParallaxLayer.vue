<template>
  <div ref="el" class="parallax-layer">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMediaQuery } from '@vueuse/core'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  speed: { type: Number, default: 0.2 },
  direction: { type: String, default: 'vertical' },
})

const el = ref(null)
const isDesktop = useMediaQuery('(hover: hover)')
let tween = null

onMounted(() => {
  if (!el.value || !isDesktop.value) return

  const distance = props.speed * 100
  const axis = props.direction === 'horizontal' ? 'x' : 'y'

  tween = gsap.fromTo(
    el.value,
    { [axis]: -distance },
    {
      [axis]: distance,
      ease: 'none',
      scrollTrigger: {
        trigger: el.value.parentElement || el.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  )
})

onUnmounted(() => {
  tween?.scrollTrigger?.kill()
  tween?.kill()
})
</script>

<style scoped>
.parallax-layer {
  will-change: transform;
}
</style>
