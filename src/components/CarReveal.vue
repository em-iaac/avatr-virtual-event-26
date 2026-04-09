<template>
  <section ref="section" class="car-reveal" id="reveal">
    <div class="car-reveal__sticky">
      <!-- Three.js canvas fills the sticky frame -->
      <canvas ref="canvas" class="car-reveal__canvas"></canvas>

      <!-- Text overlay — appears mid-reveal -->
      <div class="car-reveal__text" ref="textBlock">
        <img :src="emblemWhite" alt="" class="car-reveal__emblem" />
        <h2 class="car-reveal__title">The Future Has a Face.</h2>
        <p class="car-reveal__subtitle">AVATR 011 &middot; Intelligent Luxury SUV</p>
      </div>

      <!-- Spec chips — appear after reveal -->
      <div class="car-reveal__specs" ref="specsEl">
        <div
          v-for="spec in specChips"
          :key="spec.label"
          class="car-reveal__spec glass-panel"
        >
          <span class="car-reveal__spec-value">{{ spec.value }}</span>
          <span class="car-reveal__spec-label">{{ spec.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

import emblemWhite from '../assets/avatr-logo-emblem-white.png'
import carImageUrl from '../assets/avatr-011.png'

gsap.registerPlugin(ScrollTrigger)

const section  = ref(null)
const canvas   = ref(null)
const textBlock = ref(null)
const specsEl  = ref(null)

const specChips = [
  { value: '578 HP', label: 'Peak Power' },
  { value: '3.9s',   label: '0–100 km/h' },
  { value: '700 km', label: 'CLTC Range' },
  { value: '800V',   label: 'Architecture' },
]

let renderer   = null
let animId     = null
let gsapCtx    = null
const prog     = { val: 0 }   // scroll progress 0→1, driven by GSAP scrub

// ─────────────────────────────────────────────
//  Build and start the Three.js scene
// ─────────────────────────────────────────────
function buildScene () {
  const el = canvas.value
  const W  = el.clientWidth  || window.innerWidth
  const H  = el.clientHeight || window.innerHeight

  // ── Renderer ──
  renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: false })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap
  renderer.toneMapping       = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.4

  // ── Scene ──
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x06060a)
  scene.fog = new THREE.FogExp2(0x06060a, 0.11)

  // ── Camera ──
  const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 80)
  camera.position.set(0, 2.0, 6.8)
  camera.lookAt(0, 0.4, 0)

  // ── Floor ──
  const floorGeo = new THREE.PlaneGeometry(30, 30)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x080810,
    metalness: 0.9,
    roughness: 0.3,
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.0
  floor.receiveShadow = true
  scene.add(floor)

  // ── Car plane with texture ──
  const loader = new THREE.TextureLoader()
  const carTex = loader.load(carImageUrl)
  carTex.colorSpace = THREE.SRGBColorSpace

  const carW   = 4.4
  const carH   = carW * (7 / 16)
  const carGeo = new THREE.PlaneGeometry(carW, carH)
  const carMat = new THREE.MeshStandardMaterial({
    map: carTex,
    transparent: true,
    alphaTest: 0.04,
    metalness: 0.3,
    roughness: 0.65,
    emissive: new THREE.Color(0xc8a96e),
    emissiveIntensity: 0.0,
  })
  const car = new THREE.Mesh(carGeo, carMat)
  car.position.set(0, 0.25, 0)
  car.castShadow = true
  scene.add(car)

  // ── Soft floor reflection (flipped, very subtle) ──
  const reflGeo = new THREE.PlaneGeometry(carW, carH)
  const reflMat = new THREE.MeshStandardMaterial({
    map: carTex,
    transparent: true,
    opacity: 0.10,
    alphaTest: 0.01,
  })
  const refl = new THREE.Mesh(reflGeo, reflMat)
  refl.position.set(0, -1.0, 0)
  refl.scale.y = -0.6
  refl.rotation.x = 0
  scene.add(refl)

  // ── Lighting ──
  // Ambient: barely anything so the spotlight drama stands out
  const ambient = new THREE.AmbientLight(0x1a1a2e, 0.5)
  scene.add(ambient)

  // Key sweep spotlight — sweeps from far left to front-center
  const spot = new THREE.SpotLight(0xfdf0d8, 5, 22, Math.PI / 5.5, 0.6, 1.8)
  spot.position.set(-9, 9, 5)
  spot.target.position.set(0, 0, 0)
  spot.castShadow = true
  spot.shadow.bias = -0.001
  scene.add(spot, spot.target)

  // Gold rim from behind
  const rim = new THREE.DirectionalLight(0xc8a96e, 1.8)
  rim.position.set(4, 5, -6)
  scene.add(rim)

  // Cold blue fill
  const fill = new THREE.DirectionalLight(0x9bb8ff, 0.5)
  fill.position.set(-5, 1, 5)
  scene.add(fill)

  // ── Floating gold dust ──
  const N = 220
  const pPos = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 14
    pPos[i * 3 + 1] = Math.random() * 5 - 1
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 9
  }
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  const pMat = new THREE.PointsMaterial({
    color: 0xc8a96e,
    size: 0.022,
    transparent: true,
    opacity: 0.0,
  })
  const dust = new THREE.Points(pGeo, pMat)
  scene.add(dust)

  // ── Resize handler ──
  const onResize = () => {
    if (!canvas.value) return
    const nw = canvas.value.clientWidth
    const nh = canvas.value.clientHeight
    camera.aspect = nw / nh
    camera.updateProjectionMatrix()
    renderer.setSize(nw, nh)
  }
  window.addEventListener('resize', onResize)

  // ── Render loop ──
  let tick = 0
  const loop = () => {
    animId = requestAnimationFrame(loop)
    tick += 0.012

    const p = prog.val   // 0 → 1

    // Spotlight sweeps from hard left to center-right
    const sweepA = -Math.PI * 0.65 + p * Math.PI * 0.6
    spot.position.x = Math.sin(sweepA) * 9
    spot.position.z = Math.cos(sweepA) * 4 + 4
    spot.intensity  = 4 + p * 18

    // Car subtle emissive pulse at full reveal
    carMat.emissiveIntensity = Math.max(0, p - 0.5) * 0.14

    // Dust materialises
    pMat.opacity = Math.min(p * 1.8, 0.5)

    // Gentle camera float
    camera.position.y = 2.0 + Math.sin(tick * 0.38) * 0.055
    camera.lookAt(0, 0.4, 0)

    // Subtle tilt on the car plane
    car.rotation.y = (p - 0.5) * 0.12 + Math.sin(tick * 0.25) * 0.018

    renderer.render(scene, camera)
  }
  loop()

  // ── GSAP ScrollTrigger ──
  gsapCtx = gsap.context(() => {
    gsap.to(prog, {
      val: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: '+=220%',
        scrub: 1.4,
        pin: true,
        onUpdate (self) {
          // Text + specs fade in after 55% progress
          if (self.progress > 0.55) {
            gsap.to(textBlock.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
            gsap.to(specsEl.value, { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power2.out', overwrite: 'auto' })
          } else {
            gsap.to(textBlock.value, { opacity: 0, y: 24, duration: 0.3, overwrite: 'auto' })
            gsap.to(specsEl.value, { opacity: 0, y: 16, duration: 0.3, overwrite: 'auto' })
          }
        }
      }
    })
  }, section.value)

  // Stash cleanup ref on renderer for onUnmounted
  renderer._avatrCleanup = () => {
    window.removeEventListener('resize', onResize)
    carGeo.dispose()
    carMat.dispose()
    floorGeo.dispose()
    floorMat.dispose()
    reflGeo.dispose()
    reflMat.dispose()
    pGeo.dispose()
    pMat.dispose()
    renderer.dispose()
  }
}

onMounted(() => {
  if (!canvas.value || !section.value) return
  buildScene()
  // Start hidden
  gsap.set(textBlock.value, { opacity: 0, y: 24 })
  gsap.set(specsEl.value,   { opacity: 0, y: 16 })
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  renderer?._avatrCleanup?.()
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
  background-color: #06060a;
}

/* Canvas fills sticky wrapper */
.car-reveal__canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* ── Text overlay ── */
.car-reveal__text {
  position: absolute;
  bottom: 14%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.car-reveal__emblem {
  width: 36px;
  height: auto;
  opacity: 0.7;
}

.car-reveal__title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4vw, 2.8rem);
  font-weight: 300;
  letter-spacing: 0.06em;
  color: var(--color-text);
}

.car-reveal__subtitle {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  letter-spacing: 0.2em;
  color: var(--color-accent);
  text-transform: uppercase;
}

/* ── Spec chips ── */
.car-reveal__specs {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
  flex-wrap: wrap;
  justify-content: center;
  pointer-events: none;
}

.car-reveal__spec {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 18px;
  min-width: 80px;
}

.car-reveal__spec-value {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-weight: 600;
  color: var(--color-accent);
  line-height: 1;
}

.car-reveal__spec-label {
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  color: var(--color-muted);
  text-transform: uppercase;
  margin-top: 4px;
}
</style>
