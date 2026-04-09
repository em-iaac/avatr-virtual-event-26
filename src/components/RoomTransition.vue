<template>
  <Transition
    :name="transitionName"
    mode="out-in"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <slot />
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'

const transitionName = ref('room-door')

function onBeforeEnter(el) {
  el.style.opacity = '0'
}

function onEnter(el, done) {
  // Door panels slide open, content fades in
  gsap.fromTo(el,
    { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', onComplete: done }
  )
  window.__avatrSound?.playWhoosh()
}

function onAfterEnter() {}

function onBeforeLeave(el) {
  el.style.position = 'absolute'
  el.style.width = '100%'
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0, scale: 1.02, filter: 'blur(6px)',
    duration: 0.4, ease: 'power2.in', onComplete: done,
  })
}

function onAfterLeave() {}
</script>

<style>
/* Door panels overlay for transition */
.room-door-enter-active,
.room-door-leave-active {
  transition: none; /* handled by GSAP */
}

/* Fallback CSS if GSAP doesn't fire */
.room-door-enter-from {
  opacity: 0;
  transform: scale(0.96);
  filter: blur(8px);
}

.room-door-leave-to {
  opacity: 0;
  transform: scale(1.02);
  filter: blur(6px);
}
</style>
