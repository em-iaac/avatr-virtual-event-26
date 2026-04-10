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

      <!-- Left-side unified control panel -->
      <div class="car-reveal__controls">
        <div class="car-reveal__controls-label">Controls</div>

        <!-- Hints -->
        <div class="car-reveal__hint-row">
          <svg class="car-reveal__ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 12h8M12 8v8" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
          <span>Drag to rotate</span>
        </div>
        <div class="car-reveal__hint-row">
          <svg class="car-reveal__ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke-linecap="round"/>
          </svg>
          <span>Move to sweep light</span>
        </div>

        <div class="car-reveal__controls-divider"></div>

        <!-- Lights toggle -->
        <button
          class="car-reveal__ctrl-btn glass-panel glass-panel--deep"
          :class="{ 'car-reveal__ctrl-btn--active': lightsOn }"
          @click="toggleLights"
        >
          <svg class="car-reveal__ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path v-if="!lightsOn" d="M12 3v1M18.36 5.64l-.71.71M21 12h-1M18.36 18.36l-.71-.71M12 20v1M5.64 18.36l.71-.71M3 12h1M5.64 5.64l.71.71" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="5"/>
          </svg>
          <span>{{ lightsOn ? 'Dim Lights' : 'Lights On' }}</span>
        </button>

        <!-- Specs toggle -->
        <button
          class="car-reveal__ctrl-btn glass-panel glass-panel--deep"
          :class="{ 'car-reveal__ctrl-btn--active': showSpecs }"
          @click="showSpecs = !showSpecs"
        >
          <svg class="car-reveal__ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span>{{ showSpecs ? 'Hide Specs' : 'Show Specs' }}</span>
        </button>

        <!-- Sound toggle -->
        <button
          class="car-reveal__ctrl-btn glass-panel glass-panel--deep"
          :class="{ 'car-reveal__ctrl-btn--active': soundOn }"
          @click="toggleSound"
        >
          <svg v-if="soundOn" class="car-reveal__ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M11 5 L6 9 H2 V15 H6 L11 19 V5Z"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
          <svg v-else class="car-reveal__ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M11 5 L6 9 H2 V15 H6 L11 19 V5Z"/>
            <line x1="22" y1="9" x2="16" y2="15"/>
            <line x1="16" y1="9" x2="22" y2="15"/>
          </svg>
          <span>{{ soundOn ? 'Sound On' : 'Sound Off' }}</span>
        </button>
      </div>

      <div class="car-reveal__text" ref="textBlock">
        <h2 class="car-reveal__title">Reveal Chamber</h2>
        <p class="car-reveal__subtitle">The real model. Only visible where the light passes.</p>
      </div>

      <!-- Specs grid (bottom center) -->
      <div class="car-reveal__specs" ref="specsEl">
        <Transition name="specs-fade">
          <div v-if="showSpecs" class="car-reveal__specs-grid">
            <div v-for="spec in specChips" :key="spec.label" class="car-reveal__spec glass-panel glass-panel--deep">
              <span class="car-reveal__spec-value">{{ spec.value }}</span>
              <span class="car-reveal__spec-label">{{ spec.label }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import modelUrl from '../assets/avatr-011-model.glb?url'

const section = ref(null)
const canvas = ref(null)
const textBlock = ref(null)
const specsEl = ref(null)
const loading = ref(true)
const lightsOn = ref(false)
const showSpecs = ref(false)
const soundOn = ref(true)
const revealRadius = ref(280)
const pointer = reactive({ x: 240, y: 240 })

const specChips = [
  { value: '3.9s', label: '0-100 km/h' },
  { value: '578 HP', label: 'Dual Motor AWD' },
  { value: '700 km', label: 'CLTC Range' },
  { value: '730 Nm', label: 'Peak Torque' },
]

let renderer = null
let scene = null
let camera = null
let modelRoot = null
let spotlight = null
let ambientLight = null
let rimLight = null
let fillLight = null
let floor = null
let animId = null

const sceneState = { fogDensity: 0.18, ambientIntensity: 0.1, rimIntensity: 0.3, fillIntensity: 0.1 }

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

function toggleLights() {
  lightsOn.value = !lightsOn.value

  if (lightsOn.value) {
    // Lights ON: reduce fog, increase ambient/rim/fill
    gsap.to(sceneState, {
      fogDensity: 0.04,
      ambientIntensity: 0.6,
      rimIntensity: 2.2,
      fillIntensity: 0.6,
      duration: 2,
      ease: 'power2.out',
    })
  } else {
    // Lights OFF: dense fog, dim everything
    gsap.to(sceneState, {
      fogDensity: 0.18,
      ambientIntensity: 0.1,
      rimIntensity: 0.3,
      fillIntensity: 0.1,
      duration: 1.5,
      ease: 'power2.inOut',
    })
  }

  window.__avatrSound?.playClick()
}

function toggleSound() {
  window.__avatrSound?.toggle()
  soundOn.value = window.__avatrSound?.enabled?.value ?? !soundOn.value
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
  scene.fog = new THREE.FogExp2(0x050507, sceneState.fogDensity)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 2.3, 7.5)
  camera.lookAt(0, 1, 0)

  // Dim ambient — car barely visible in fog
  ambientLight = new THREE.AmbientLight(0x1c1c28, sceneState.ambientIntensity)
  scene.add(ambientLight)

  // Dim rim light
  rimLight = new THREE.DirectionalLight(0xc8a96e, sceneState.rimIntensity)
  rimLight.position.set(4, 6, -4)
  scene.add(rimLight)

  // Dim fill light
  fillLight = new THREE.DirectionalLight(0x95b7ff, sceneState.fillIntensity)
  fillLight.position.set(-4, 2, 5)
  scene.add(fillLight)

  // Cursor-tracking spotlight — the main reveal tool
  spotlight = new THREE.SpotLight(0xfff4e4, 8, 30, Math.PI / 4.5, 0.8, 1.4)
  spotlight.position.set(0, 8, 6)
  spotlight.castShadow = true
  spotlight.target.position.set(0, 0, 0)
  scene.add(spotlight)
  scene.add(spotlight.target)

  // Metallic floor
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

  // Load GLB model
  const loader = new GLTFLoader()

  loader.load(
    modelUrl,
    (gltf) => {
      modelRoot = new THREE.Group()
      modelRoot.add(gltf.scene)
      scene.add(modelRoot)

      const box = new THREE.Box3().setFromObject(modelRoot)
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)

      gltf.scene.position.sub(center)
      const maxAxis = Math.max(size.x, size.y, size.z) || 1
      const targetSize = 8.5
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

    // Spotlight follows cursor
    spotlight.position.x = nx * 5.2
    spotlight.position.z = 6 + ny * 1.4
    spotlight.target.position.x = nx * 2.4
    spotlight.target.position.y = 0.8 + ny * 1.4

    revealRadius.value = lightsOn.value ? 600 : 280

    // Apply animated scene state
    scene.fog.density = sceneState.fogDensity
    ambientLight.intensity = sceneState.ambientIntensity
    rimLight.intensity = sceneState.rimIntensity
    fillLight.intensity = sceneState.fillIntensity

    // Auto-rotate when not dragging
    if (modelRoot && !drag.active) {
      modelRoot.rotation.y += 0.0025
    }

    renderer.render(scene, camera)
  }
  render()

  // Fade in text block on mount
  gsap.fromTo(textBlock.value,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
  )

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
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  padding: 14px 16px;
  max-width: 240px;
}

.car-reveal__loading-label,
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

/* ── Left-side unified control panel ── */
.car-reveal__controls {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 14px;
  background: rgba(10, 10, 14, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(200, 169, 110, 0.12);
  border-radius: 16px;
  width: 180px;
}

.car-reveal__controls-label {
  font-family: var(--font-display);
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 4px;
  padding-left: 2px;
}

.car-reveal__controls-divider {
  width: 100%;
  height: 1px;
  background: rgba(200, 169, 110, 0.12);
  margin: 6px 0;
}

.car-reveal__hint-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 2px;
}

.car-reveal__hint-row span {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.car-reveal__ctrl-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.car-reveal__ctrl-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  font-family: var(--font-display);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text);
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.car-reveal__ctrl-btn:hover {
  border-color: rgba(200, 169, 110, 0.4);
  color: var(--color-accent);
}

.car-reveal__ctrl-btn--active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  box-shadow: 0 0 14px rgba(200,169,110,0.12);
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
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
}

.car-reveal__specs-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
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
  text-transform: uppercase;
}

/* Specs fade transition */
.specs-fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.specs-fade-leave-active {
  transition: opacity 0.2s ease;
}
.specs-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.specs-fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .car-reveal__controls {
    top: auto;
    bottom: 80px;
    left: 12px;
    transform: none;
    width: 160px;
  }

  .car-reveal__loading {
    left: 50%;
    top: 12px;
  }
}
</style>
