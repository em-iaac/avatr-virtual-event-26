<template>
  <!-- Sound is always on — no visible toggle -->
  <div style="display:none"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const enabled = ref(true)
let ctx = null
let masterGain = null
let ambientNodes = []
let roomNodes = []
let isInitialized = false
let currentRoom = null

// ── Room-specific ambient sound profiles ──
const ROOM_PROFILES = {
  lobby: { bassHz: 38, bassGain: 0.06, midHz: 82, midGain: 0.04, lfoHz: 0.15, noiseGain: 0.012, bpfHz: 180 },
  'waiting-room': { bassHz: 50, bassGain: 0.04, midHz: 110, midGain: 0.05, lfoHz: 0.3, noiseGain: 0.02, bpfHz: 300 },
  'reveal-room': { bassHz: 32, bassGain: 0.08, midHz: 65, midGain: 0.06, lfoHz: 0.08, noiseGain: 0.025, bpfHz: 120 },
  'watching-room': { bassHz: 42, bassGain: 0.05, midHz: 90, midGain: 0.03, lfoHz: 0.12, noiseGain: 0.008, bpfHz: 150 },
  invitation: { bassHz: 55, bassGain: 0.03, midHz: 130, midGain: 0.04, lfoHz: 0.5, noiseGain: 0.01, bpfHz: 400 },
}

function initAudio() {
  if (isInitialized) return
  isInitialized = true
  ctx = new (window.AudioContext || window.webkitAudioContext)()
  masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0, ctx.currentTime)
  masterGain.connect(ctx.destination)
}

// Build room-specific ambient layers
function buildRoomAmbient(profile) {
  teardownRoomAmbient()
  if (!ctx) return
  currentRoom = profile

  // Layer 1: Sub-bass
  const osc1 = ctx.createOscillator()
  const g1 = ctx.createGain()
  osc1.type = 'sine'
  osc1.frequency.value = profile.bassHz
  g1.gain.value = profile.bassGain
  osc1.connect(g1)
  g1.connect(masterGain)
  osc1.start()
  roomNodes.push(osc1, g1)

  // Layer 2: Mid hum with LFO
  const osc2 = ctx.createOscillator()
  const g2 = ctx.createGain()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  osc2.type = 'sine'
  osc2.frequency.value = profile.midHz
  g2.gain.value = profile.midGain
  lfo.frequency.value = profile.lfoHz
  lfoGain.gain.value = 1.5
  lfo.connect(lfoGain)
  lfoGain.connect(osc2.frequency)
  osc2.connect(g2)
  g2.connect(masterGain)
  osc2.start()
  lfo.start()
  roomNodes.push(osc2, g2, lfo, lfoGain)

  // Layer 3: Shaped noise atmosphere
  const bufferSize = ctx.sampleRate * 3
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = noiseBuffer
  noiseSource.loop = true
  const bpf = ctx.createBiquadFilter()
  bpf.type = 'bandpass'
  bpf.frequency.value = profile.bpfHz
  bpf.Q.value = 0.5
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = profile.noiseGain
  noiseSource.connect(bpf)
  bpf.connect(noiseGain)
  noiseGain.connect(masterGain)
  noiseSource.start()
  roomNodes.push(noiseSource, bpf, noiseGain)
}

function teardownRoomAmbient() {
  roomNodes.forEach(n => { try { n.stop?.() } catch (_) {} })
  roomNodes.forEach(n => { try { n.disconnect() } catch (_) {} })
  roomNodes = []
  currentRoom = null
}

function switchRoom(roomName) {
  const profile = ROOM_PROFILES[roomName] || ROOM_PROFILES.lobby
  buildRoomAmbient(profile)
}

function enable() {
  initAudio()
  if (ctx.state === 'suspended') ctx.resume()
  switchRoom(route.name || 'lobby')
  masterGain.gain.cancelScheduledValues(ctx.currentTime)
  masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime)
  masterGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2.5)
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

// Watch route changes to switch ambient profile
watch(() => route.name, (roomName) => {
  if (enabled.value && ctx) switchRoom(roomName)
})

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
  for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1
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

function playCorrect() {
  if (!ctx || !enabled.value) return
  const now = ctx.currentTime
  // Ascending two-tone chime (E5 → A5)
  const g1 = ctx.createGain()
  g1.gain.setValueAtTime(0.1, now)
  g1.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
  g1.connect(masterGain)
  const osc1 = ctx.createOscillator()
  osc1.type = 'sine'
  osc1.frequency.value = 660
  osc1.connect(g1)
  osc1.start(now)
  osc1.stop(now + 0.15)

  const g2 = ctx.createGain()
  g2.gain.setValueAtTime(0.1, now + 0.12)
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
  g2.connect(masterGain)
  const osc2 = ctx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = 880
  osc2.connect(g2)
  osc2.start(now + 0.12)
  osc2.stop(now + 0.5)
}

function playWrong() {
  if (!ctx || !enabled.value) return
  const now = ctx.currentTime
  // Descending triangle wave
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(330, now)
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.25)
  g.gain.setValueAtTime(0.08, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
  osc.connect(g)
  g.connect(masterGain)
  osc.start(now)
  osc.stop(now + 0.3)
}

onMounted(() => {
  window.__avatrSound = { playClick, playWhoosh, playCorrect, playWrong, toggle, enabled }
  // Auto-enable sound on mount
  enable()
})

onUnmounted(() => {
  disable()
  teardownRoomAmbient()
  ambientNodes.forEach(n => { try { n.disconnect() } catch (_) {} })
  delete window.__avatrSound
})

defineExpose({ toggle, enabled, playClick, playWhoosh, playCorrect, playWrong })
</script>

<style scoped>
</style>
