<template>
  <component :is="tag" ref="el" class="text-reveal">
    <span
      v-for="(word, i) in words"
      :key="i"
      class="text-reveal__word-wrap"
    >
      <span class="text-reveal__word">{{ word }}</span>
      <span v-if="i < words.length - 1">&nbsp;</span>
    </span>
  </component>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  text: { type: String, required: true },
  tag: { type: String, default: 'div' },
  delay: { type: Number, default: 0 },
  stagger: { type: Number, default: 0.05 },
  duration: { type: Number, default: 0.5 },
})

const el = ref(null)
const words = computed(() => props.text.split(' '))
let trigger = null

onMounted(() => {
  if (!el.value) return

  const wordEls = el.value.querySelectorAll('.text-reveal__word')
  gsap.set(wordEls, { yPercent: 110, opacity: 0 })

  trigger = ScrollTrigger.create({
    trigger: el.value,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(wordEls, {
        yPercent: 0,
        opacity: 1,
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

<style scoped>
.text-reveal {
  display: flex;
  flex-wrap: wrap;
}

.text-reveal__word-wrap {
  overflow: hidden;
  display: inline-flex;
}

.text-reveal__word {
  display: inline-block;
  will-change: transform;
}
</style>
