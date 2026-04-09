<template>
  <section ref="section" class="car-reveal" id="reveal">
    <div class="car-reveal__sticky">
      <canvas
        ref="canvas"
        class="car-reveal__canvas"
        @pointermove="handlePointerMove"
        @pointerdown="handlePointerDown"
        @pointerup="handlePointerUp"
        @pointerleave="handlePointerLeave"
      ></canvas>

      <div
        class="car-reveal__reveal-mask"
        :style="{
          '--mx': `${pointer.x}px`,
          '--my': `${pointer.y}px`,
          '--radius': `${revealRadius}px`,
        }"
      ></div>

      <div v-if="loading" class="car-reveal__loading glass-panel glass-panel--deep">
        <span class="car-reveal__loading-label">Reveal Chamber</span>
        <p class="car-reveal__loading-text">Loading the actual AVATR model.</p>
      </div>

      <div class="car-reveal__hint glass-panel glass-panel--deep">
        <span>Drag to rotate</span>
        <span>Move to sweep light</span>
      </div>

      <div class="car-reveal__text" ref="textBlock">
        <img :src="emblemWhite" alt="" class="car-reveal__emblem" />
        <h2 class="car-reveal__title">Reveal Chamber</h2>
        <p class="car-reveal__subtitle">The real model. Only visible where the light passes.</p>
      </div>

      <div class="car-reveal__specs" ref="specsEl">
        <div v-for="spec in specChips" :key="spec.label" class="car-reveal__spec glass-panel glass-panel--deep">
          <span class="car-reveal__spec-value">{{ spec.value }}</span>
          <span class="car-reveal__spec-label">{{ spec.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'

import emblemWhite from '../assets/avatr-logo-emblem-white.png'
import modelUrl from '../assets/avatr-011-model.3dm?url'

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)
const canvas = ref(null)
const textBlock = ref(null)
const specsEl = ref(null)
const loading = ref(true)
const revealRadius = ref(150)
const pointer = reactive({ x: 240, y: 240 })

const specChips = [
  { value: 'Rotate', label: 'Interactive Model' },
  { value: 'Sweep', label: 'Cursor Light' },
  { value: 'Scroll', label: 'Unlock Specs' },
  { value: 'AVATR 011', label: 'Reveal Focus' },
]

let renderer = null
let scene = null
let camera = null
let modelRoot = null
let spotlight = null
let floor = null
let animId = null
let gsapCtx = null
const progress = { value: 0 }

const drag = reactive({ active: false, startX: 0, rotationY: 0 })

function handlePointerMove(event) {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  pointer.x = event.clientX - rect.left
  pointer.y = event.clientY - rect.top

  if (drag.active && modelRoot) {
    const deltaX = event.clientX - drag.startX
    modelRoot.rotation.y = drag.rotationY + deltaX * 0.01
  }
}

function handlePointerDown(event) {
  if (!modelRoot) return
  drag.active = true
  drag.startX = event.clientX
  drag.rotationY = modelRoot.rotation.y
  canvas.value?.setPointerCapture?.(event.pointerId)
}

function handlePointerUp(event) {
  drag.active = false
  canvas.value?.releasePointerCapture?.(event.pointerId)
}

function handlePointerLeave() {
  drag.active = false
}

function buildScene() {
  const width = canvas.value.clientWidth || window.innerWidth
  const height = canvas.value.clientHeight || window.innerHeight

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x050507)
  scene.fog = new THREE.FogExp2(0x050507, 0.12)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 2.3, 9)
  camera.lookAt(0, 1, 0)

  const ambient = new THREE.AmbientLight(0x1c1c28, 0.42)
  scene.add(ambient)

  const rimLight = new THREE.DirectionalLight(0xc8a96e, 1.7)
  rimLight.position.set(4, 6, -4)
  scene.add(rimLight)

  const fillLight = new THREE.DirectionalLight(0x95b7ff, 0.4)
  fillLight.position.set(-4, 2, 5)
  scene.add(fillLight)

  spotlight = new THREE.SpotLight(0xfff4e4, 6, 30, Math.PI / 4.5, 0.8, 1.4)
  spotlight.position.set(0, 8, 6)
  spotlight.castShadow = true
  spotlight.target.position.set(0, 0, 0)
  scene.add(spotlight)
  scene.add(spotlight.target)

  const floorGeo = new THREE.CircleGeometry(12, 80)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x090910,
    metalness: 0.7,
    roughness: 0.35,
  })
  floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.2
  floor.receiveShadow = true
  scene.add(floor)

  const loader = new Rhino3dmLoader()
  loader.setLibraryPath('/rhino3dm/')

  loader.load(
    modelUrl,
    (object) => {
      modelRoot = new THREE.Group()
      modelRoot.add(object)
      scene.add(modelRoot)

      const box = new THREE.Box3().setFromObject(modelRoot)
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)

      object.position.sub(center)
      const maxAxis = Math.max(size.x, size.y, size.z) || 1
      const targetSize = 5.8
      const scale = targetSize / maxAxis
      modelRoot.scale.setScalar(scale)
      modelRoot.position.y = -0.65
      modelRoot.rotation.y = -0.8

      modelRoot.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            const original = child.material
            child.material = new THREE.MeshPhysicalMaterial({
              color: original.color || new THREE.Color(0xb6b8be),
              metalness: 0.82,
              roughness: 0.28,
              clearcoat: 1,
              clearcoatRoughness: 0.08,
              envMapIntensity: 1.2,
            })
          }
        }
      })

      loading.value = false
    },
    undefined,
    () => {
      loading.value = false
    }
  )

  const onResize = () => {
    if (!canvas.value) return
    const nextWidth = canvas.value.clientWidth
    const nextHeight = canvas.value.clientHeight
    camera.aspect = nextWidth / nextHeight
    camera.updateProjectionMatrix()
    renderer.setSize(nextWidth, nextHeight)
  }
  window.addEventListener('resize', onResize)

  const render = () => {
    animId = requestAnimationFrame(render)

    const widthNow = canvas.value?.clientWidth || width
    const heightNow = canvas.value?.clientHeight || height
    const nx = (pointer.x / widthNow) * 2 - 1
    const ny = -(pointer.y / heightNow) * 2 + 1

    spotlight.position.x = nx * 5.2
    spotlight.position.z = 6 + ny * 1.4
    spotlight.target.position.x = nx * 2.4
    spotlight.target.position.y = 0.8 + ny * 1.4

    revealRadius.value = 120 + progress.value * 190

    if (modelRoot && !drag.active) {
      modelRoot.rotation.y += 0.0025
    }

    camera.position.z = 9 - progress.value * 1.8
    spotlight.intensity = 5 + progress.value * 8

    renderer.render(scene, camera)
  }
  render()

  gsapCtx = gsap.context(() => {
    gsap.set(textBlock.value, { opacity: 0, y: 24 })
    gsap.set(specsEl.value, { opacity: 0, y: 18 })

    gsap.to(progress, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: '+=190%',
        scrub: 1.2,
        pin: true,
        onUpdate(self) {
          if (self.progress > 0.28) {
            gsap.to(textBlock.value, { opacity: 1, y: 0, duration: 0.45, overwrite: 'auto' })
          } else {
            gsap.to(textBlock.value, { opacity: 0, y: 24, duration: 0.25, overwrite: 'auto' })
          }

          if (self.progress > 0.62) {
            gsap.to(specsEl.value, { opacity: 1, y: 0, duration: 0.45, overwrite: 'auto' })
          } else {
            gsap.to(specsEl.value, { opacity: 0, y: 18, duration: 0.25, overwrite: 'auto' })
          }
        },
      },
    })
  }, section.value)

  renderer._disposeReveal = () => {
    window.removeEventListener('resize', onResize)
    floorGeo.dispose()
    floorMat.dispose()
    renderer.dispose()
  }
}

onMounted(() => {
  if (!canvas.value || !section.value) return
  const rect = canvas.value.getBoundingClientRect()
  pointer.x = rect.width * 0.55
  pointer.y = rect.height * 0.42
  buildScene()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  renderer?._disposeReveal?.()
  gsapCtx?.revert()
})
</script>

<style scoped>
.car-reveal {
  position: relative;
  width: 100%;
}

.car-reveal__sticky {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 35%, rgba(200,169,110,0.08), transparent 35%),
    #050507;
}

.car-reveal__canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.car-reveal__reveal-mask {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at var(--mx) var(--my), transparent 0, transparent calc(var(--radius) * 0.34), rgba(5,5,7,0.14) calc(var(--radius) * 0.55), rgba(5,5,7,0.94) var(--radius)),
    linear-gradient(180deg, rgba(5,5,7,0.26), rgba(5,5,7,0.55));
  z-index: 2;
}

.car-reveal__loading {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 5;
  padding: 14px 16px;
  max-width: 240px;
}

.car-reveal__loading-label,
.car-reveal__hint span,
.car-reveal__subtitle,
.car-reveal__spec-label {
  text-transform: uppercase;
}

.car-reveal__loading-label {
  display: block;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  color: var(--color-accent);
  margin-bottom: 6px;
}

.car-reveal__loading-text {
  color: var(--color-text);
  font-size: 0.86rem;
}

.car-reveal__hint {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
}

.car-reveal__hint span {
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  color: var(--color-muted);
}

.car-reveal__text {
  position: absolute;
  left: 50%;
  bottom: 15%;
  transform: translateX(-50%);
  z-index: 5;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 720px;
  padding: 0 20px;
}

.car-reveal__emblem {
  width: 34px;
  opacity: 0.78;
}

.car-reveal__title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 300;
  letter-spacing: 0.05em;
}

.car-reveal__subtitle {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  color: var(--color-accent);
}

.car-reveal__specs {
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 20px;
}

.car-reveal__spec {
  min-width: 110px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.car-reveal__spec-value {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-text);
}

.car-reveal__spec-label {
  margin-top: 4px;
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  color: var(--color-muted);
}

@media (max-width: 900px) {
  .car-reveal__hint {
    display: none;
  }

  .car-reveal__loading {
    left: 12px;
    top: 12px;
  }
}
</style>
