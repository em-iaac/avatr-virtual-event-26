<template>
  <!-- Sound toggle button (bottom-right) -->
  <div class="sound-toggle" :class="{ 'sound-toggle--muted': !enabled }" @click="toggle" title="Toggle ambient sound">
    <svg v-if="enabled" class="sound-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M11 5 L6 9 H2 V15 H6 L11 19 V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
    <svg v-else class="sound-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M11 5 L6 9 H2 V15 H6 L11 19 V5Z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
    <span class="sound-toggle__label">{{ enabled ? 'SOUND ON' : 'SOUND OFF' }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const enabled = ref(false)
let ctx = null
let masterGain = null
let ambientNodes = []
let isInitialized = false

// Build the ambient sound engine with Web Audio API
function initAudio() {
  if (isInitialized) return
  isInitialized = true

  ctx = new (window.AudioContext || window.webkitAudioContext)()
  masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0, ctx.currentTime)
  masterGain.connect(ctx.destination)

  // ── Layer 1: Sub-bass hum (felt more than heard — 38 Hz) ──
  const osc1 = ctx.createOscillator()
  const g1 = ctx.createGain()
  osc1.type = 'sine'
  osc1.frequency.value = 38
  g1.gain.value = 0.06
  osc1.connect(g1)
  g1.connect(masterGain)
  osc1.start()
  ambientNodes.push(osc1, g1)

  // ── Layer 2: Mid hum with slow LFO vibrato (82 Hz) ──
  const osc2 = ctx.createOscillator()
  const g2 = ctx.createGain()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  osc2.type = 'sine'
  osc2.frequency.value = 82
  g2.gain.value = 0.04
  lfo.frequency.value = 0.2 // very slow vibrato
  lfoGain.gain.value = 1.5
  lfo.connect(lfoGain)
  lfoGain.connect(osc2.frequency)
  osc2.connect(g2)
  g2.connect(masterGain)
  osc2.start()
  lfo.start()
  ambientNodes.push(osc2, g2, lfo, lfoGain)

  // ── Layer 3: White-noise atmosphere (electric air texture) ──
  const bufferSize = ctx.sampleRate * 3 // 3 seconds looped
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1)
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = noiseBuffer
  noiseSource.loop = true
  // Bandpass filter to shape the noise into a soft hiss
  const bpf = ctx.createBiquadFilter()
  bpf.type = 'bandpass'
  bpf.frequency.value = 200
  bpf.Q.value = 0.5
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.015
  noiseSource.connect(bpf)
  bpf.connect(noiseGain)
  noiseGain.connect(masterGain)
  noiseSource.start()
  ambientNodes.push(noiseSource, bpf, noiseGain)
}

function enable() {
  initAudio()
  if (ctx.state === 'suspended') ctx.resume()
  masterGain.gain.cancelScheduledValues(ctx.currentTime)
  masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime)
  masterGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2.5) // Slow fade-in
}

function disable() {
  if (!masterGain) return
  masterGain.gain.cancelScheduledValues(ctx.currentTime)
  masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime)
  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2)
}

function toggle() {
  enabled.value = !enabled.value
  if (enabled.value) enable()
  else disable()
}

// Expose for external components to trigger interaction sounds
function playClick() {
  if (!ctx || !enabled.value) return
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 880
  g.gain.setValueAtTime(0.08, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
  osc.connect(g)
  g.connect(masterGain)
  osc.start()
  osc.stop(ctx.currentTime + 0.12)
}

function playWhoosh() {
  if (!ctx || !enabled.value) return
  const bufLen = Math.floor(ctx.sampleRate * 0.3)
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1)
  const src = ctx.createBufferSource()
  src.buffer = buf
  const hpf = ctx.createBiquadFilter()
  hpf.type = 'highpass'
  hpf.frequency.value = 1200
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.06, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
  src.connect(hpf)
  hpf.connect(g)
  g.connect(masterGain)
  src.start()
  src.stop(ctx.currentTime + 0.3)
}

// Make sounds accessible globally for other components
onMounted(() => {
  window.__avatrSound = { playClick, playWhoosh }
})

onUnmounted(() => {
  disable()
  ambientNodes.forEach(n => { try { n.disconnect() } catch (_) {} })
  delete window.__avatrSound
})

defineExpose({ toggle, enabled, playClick, playWhoosh })
</script>

<style scoped>
.sound-toggle {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px 8px 10px;
  background: rgba(10, 10, 14, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(200, 169, 110, 0.2);
  border-radius: 100px;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s, transform 0.2s;
  color: rgba(200, 169, 110, 0.7);
  user-select: none;
}

.sound-toggle:hover {
  border-color: rgba(200, 169, 110, 0.5);
  background: rgba(10, 10, 14, 0.9);
  transform: translateY(-2px);
  color: var(--color-accent);
}

.sound-toggle--muted {
  color: var(--color-muted);
  border-color: rgba(255,255,255,0.06);
}

.sound-toggle__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.sound-toggle__label {
  font-family: var(--font-display);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  font-weight: 600;
}
</style>
