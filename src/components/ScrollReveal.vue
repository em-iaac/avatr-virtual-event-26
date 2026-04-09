<template>
  <div ref="el" :class="['scroll-reveal', { 'scroll-reveal--visible': isVisible }]">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  delay: { type: Number, default: 0 },
  duration: { type: Number, default: 0.8 },
  y: { type: Number, default: 40 },
  stagger: { type: Number, default: 0 },
  once: { type: Boolean, default: true },
})

const el = ref(null)
const isVisible = ref(false)
let trigger = null

onMounted(() => {
  if (!el.value) return

  const targets = props.stagger
    ? el.value.children
    : el.value

  gsap.set(targets, { opacity: 0, y: props.y })

  trigger = ScrollTrigger.create({
    trigger: el.value,
    start: 'top 85%',
    once: props.once,
    onEnter: () => {
      isVisible.value = true
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: props.duration,
        delay: props.delay,
        stagger: props.stagger,
        ease: 'power3.out',
      })
    },
  })
})

onUnmounted(() => {
  trigger?.kill()
})
</script>
